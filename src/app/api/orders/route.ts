import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";

function generateOrderNumber(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            billingFirstName,
            billingLastName,
            billingEmail,
            billingPhone,
            billingCompany,
            billingAddress1,
            billingAddress2,
            billingCity,
            billingState,
            billingPostcode,
            billingCountry,
            shippingFirstName,
            shippingLastName,
            shippingEmail,
            shippingPhone,
            shippingCompany,
            shippingAddress1,
            shippingAddress2,
            shippingCity,
            shippingState,
            shippingPostcode,
            shippingCountry,
            paymentMethod,
            transactionId,
            items,
            subtotal,
            taxAmount,
            shippingCost,
            discountAmount,
            total,
            orderNotes,
        } = body;

        // Validate required fields
        if (!billingFirstName || !billingLastName || !billingEmail || !billingAddress1 ||
            !billingCity || !billingState || !billingPostcode || !billingCountry) {
            return NextResponse.json(
                { success: false, message: 'Missing required billing information' },
                { status: 400 }
            );
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Order must contain at least one item' },
                { status: 400 }
            );
        }

        if (!paymentMethod) {
            return NextResponse.json(
                { success: false, message: 'Payment method is required' },
                { status: 400 }
            );
        }

        const orderNumber = generateOrderNumber();
        const customerIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;

        // Determine payment status based on payment method
        let paymentStatus: PaymentStatus = PaymentStatus.PENDING;
        let paidAt: Date | undefined = undefined;

        if (paymentMethod === PaymentMethod.PAYPAL && transactionId) {
            paymentStatus = PaymentStatus.PAID;
            paidAt = new Date();
        } else if (paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
            paymentStatus = PaymentStatus.PENDING;
        }

        // Create order with items
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                orderNumber,
                status: OrderStatus.PENDING,
                paymentStatus,
                paymentMethod: paymentMethod as PaymentMethod,
                billingFirstName,
                billingLastName,
                billingEmail,
                billingPhone: billingPhone || null,
                billingCompany: billingCompany || null,
                billingAddress1,
                billingAddress2: billingAddress2 || null,
                billingCity,
                billingState,
                billingPostcode,
                billingCountry,
                shippingFirstName: shippingFirstName || null,
                shippingLastName: shippingLastName || null,
                shippingEmail: shippingEmail || null,
                shippingPhone: shippingPhone || null,
                shippingCompany: shippingCompany || null,
                shippingAddress1: shippingAddress1 || null,
                shippingAddress2: shippingAddress2 || null,
                shippingCity: shippingCity || null,
                shippingState: shippingState || null,
                shippingPostcode: shippingPostcode || null,
                shippingCountry: shippingCountry || null,
                subtotal: subtotal || 0,
                taxAmount: taxAmount || 0,
                shippingCost: shippingCost || 0,
                discountAmount: discountAmount || 0,
                total: total || 0,
                orderNotes: orderNotes || null,
                customerIp,
                transactionId: transactionId || null,
                paidAt,
                items: {
                    create: items.map((item: {
                        id: string;
                        name: string;
                        price: number;
                        quantity: number;
                        image?: string;
                        sku?: string;
                    }) => ({
                        productId: item.id,
                        productName: item.name,
                        productSku: item.sku || null,
                        price: item.price,
                        quantity: item.quantity,
                        subtotal: item.price * item.quantity,
                        imageUrl: item.image || null,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        // Update user's last order date
        await prisma.user.update({
            where: { id: session.user.id },
            data: { lastOrderDate: new Date() },
        });

        return NextResponse.json({
            success: true,
            message: 'Order created successfully',
            order,
        }, { status: 201 });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create order' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        const isAdmin = session?.user?.roles.includes('ADMIN');
        if (!isAdmin) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const orders = await prisma.order.findMany({
            include: {
                items: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json({ success: true, data: orders }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
