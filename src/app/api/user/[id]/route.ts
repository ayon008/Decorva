// app/api/users/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    if (session?.user?.id !== id) {
        return NextResponse.json({ success: false, message: 'You are not authorized to access this resource' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                company: true,
                taxId: true,
                customerNotes: true,
                isActive: true,
                emailVerified: true,
                roles: true,
                marketingOptIn: true,
                createdAt: true,
                updatedAt: true,
                lastLogin: true,
                lastOrderDate: true,
                billingAddress: true,  // This will include all fields from billingAddress
                shippingAddress: true, // This will include all fields from shippingAddress
            }
        })
        return NextResponse.json({ success: true, data: user }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.id || session.user.id !== id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const getUser = await prisma.user.findUnique({
            where: { id },
            include: {
                billingAddress: true,
                shippingAddress: true,
            },
        });

        if (!getUser) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }


        if (body.shippingAddress) {
            if (!getUser.shippingAddressId) {
                return NextResponse.json(
                    { success: false, message: 'Shipping address not found' },
                    { status: 404 }
                );
            }

            const shippingAddress = await prisma.shippingAddress.update({
                where: { id: getUser.shippingAddressId! },
                data: {
                    firstName: body.shippingAddress.firstName ?? getUser.firstName,
                    lastName: body.shippingAddress.lastName ?? getUser.lastName,
                    ...body.shippingAddress,
                },
            });

            return NextResponse.json(
                { success: true, data: shippingAddress },
                { status: 200 }
            );
        }


        if (body.billingAddress) {
            if (!getUser.billingAddressId) {
                return NextResponse.json(
                    { success: false, message: 'Billing address not found' },
                    { status: 404 }
                );
            }

            const billingAddress = await prisma.billingAddress.update({
                where: { id: getUser.billingAddressId },
                data: {
                    firstName: body.billingAddress.firstName ?? getUser.firstName,
                    lastName: body.billingAddress.lastName ?? getUser.lastName,
                    ...body.billingAddress,
                },
            });

            return NextResponse.json(
                { success: true, data: billingAddress },
                { status: 200 }
            );
        }

        const updateData: {
            firstName?: string;
            lastName?: string;
            phone?: string;
            email?: string;
        } = {};

        if (body.firstName) updateData.firstName = body.firstName;
        if (body.lastName) updateData.lastName = body.lastName;
        if (body.phone) updateData.phone = body.phone;
        if (body.email) updateData.email = body.email;

        const updateUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(
            { success: true, data: updateUser },
            { status: 200 }
        );
    } catch (error) {
        console.error('Failed to update user:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}