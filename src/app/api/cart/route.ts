import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type CartItemPayload = { id: string; quantity: number; price: number; image: string; name: string };

function toApiItem(item: { productId: string; quantity: number; price: number; image: string; name: string }) {
    return { id: item.productId, quantity: item.quantity, price: item.price, image: item.image, name: item.name };
}

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ items: [] });
    }

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: { items: true },
        });
        const items = (cart?.items ?? []).map(toApiItem);
        return NextResponse.json({ items });
    } catch (e) {
        console.error("Cart GET error:", e);
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = (await request.json()) as CartItemPayload;
        const { id: productId, quantity, price, image, name } = body;
        if (!productId || typeof quantity !== "number" || typeof price !== "number" || !image || !name) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        let cart = await prisma.cart.findUnique({ where: { userId: session.user.id }, include: { items: true } });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: session.user.id },
                include: { items: true },
            });
        }

        const existing = cart.items.find((i) => i.productId === productId);
        if (existing) {
            await prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + quantity },
            });
        } else {
            await prisma.cartItem.create({
                data: { cartId: cart.id, productId, quantity, price, image, name },
            });
        }

        const updated = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: { items: true },
        });
        const items = (updated?.items ?? []).map(toApiItem);
        return NextResponse.json({ items });
    } catch (e) {
        console.error("Cart POST error:", e);
        return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = (await request.json()) as { items?: CartItemPayload[]; productId?: string; quantity?: number };

        if (body.productId != null && typeof body.quantity === "number") {
            const cart = await prisma.cart.findUnique({ where: { userId: session.user.id }, include: { items: true } });
            if (!cart) return NextResponse.json({ items: [] });

            const existing = cart.items.find((i) => i.productId === body.productId);
            if (!existing) return NextResponse.json({ items: (cart.items).map(toApiItem) });

            if (body.quantity <= 0) {
                await prisma.cartItem.delete({ where: { id: existing.id } });
            } else {
                await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: body.quantity } });
            }
            const updated = await prisma.cart.findUnique({
                where: { userId: session.user.id },
                include: { items: true },
            });
            return NextResponse.json({ items: (updated?.items ?? []).map(toApiItem) });
        }

        const payload = body.items;
        if (!Array.isArray(payload)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        let cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId: session.user.id } });
        }

        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

        if (payload.length > 0) {
            await prisma.cartItem.createMany({
                data: payload.map((p) => ({
                    cartId: cart!.id,
                    productId: p.id,
                    quantity: p.quantity,
                    price: p.price,
                    image: p.image,
                    name: p.name,
                })),
            });
        }

        const updated = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: { items: true },
        });
        const items = (updated?.items ?? []).map(toApiItem);
        return NextResponse.json({ items });
    } catch (e) {
        console.error("Cart PATCH error:", e);
        return NextResponse.json({ error: "Failed to merge cart" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    if (!productId) {
        return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    try {
        const cart = await prisma.cart.findUnique({ where: { userId: session.user.id }, include: { items: true } });
        if (!cart) {
            return NextResponse.json({ items: [] });
        }

        const item = cart.items.find((i) => i.productId === productId);
        if (item) {
            await prisma.cartItem.delete({ where: { id: item.id } });
        }

        const updated = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: { items: true },
        });
        const items = (updated?.items ?? []).map(toApiItem);
        return NextResponse.json({ items });
    } catch (e) {
        console.error("Cart DELETE error:", e);
        return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
    }
}
