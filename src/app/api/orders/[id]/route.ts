import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await auth();
        if (session?.user?.id !== id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: id,
            },
            include: {
                items: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({
            success: true,
            orders,
        }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { status } = await request.json();
    try {
        const session = await auth();
        const isAdmin = session?.user?.roles.includes(UserRole.ADMIN);
        if (!isAdmin) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }
        const order = await prisma.order.update({
            where: { id },
            data: { status },
        })
        return NextResponse.json({ success: true, order }, { status: 200 });
    } catch (error) {
        console.error('Failed to update order status:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update order status' },
            { status: 500 }
        );
    }
}