import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function parseDateTime(value: unknown): Date | null {
    if (value == null || value === '') return null;
    if (value instanceof Date) return value;
    const str = String(value).trim();
    if (!str) return null;
    const date = new Date(str);
    return Number.isNaN(date.getTime()) ? null : date;
}

export async function PATCH(request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    const isAdmin = session?.user?.roles?.includes('ADMIN');
    if (!isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const data = await request.json();
        const saleStart = parseDateTime(data.saleStart);
        const saleEnd = parseDateTime(data.saleEnd);
        const { saleStart: _s, saleEnd: _e, images, productBrand, categories, ...rest } = data;

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        if (data.sku && data.sku !== existing.sku) {
            const taken = await prisma.product.findUnique({ where: { sku: data.sku } });
            if (taken) {
                return NextResponse.json({ success: false, message: 'SKU already exists' }, { status: 400 });
            }
        }

        const updatePayload: Record<string, unknown> = {
            ...rest,
            ...(saleStart != null && { saleStart }),
            ...(saleEnd != null && { saleEnd }),
            ...(productBrand !== undefined && (productBrand ? { productBrand: { connect: { id: productBrand } } } : { productBrand: { disconnect: true } })),
            ...(categories !== undefined && { categories: { set: (categories as string[]).map((cid: string) => ({ id: cid })) } }),
        };

        if (images && Array.isArray(images)) {
            await prisma.productImage.deleteMany({ where: { productId: id } });
            if (images.length > 0) {
                updatePayload.images = {
                    create: (images as string[]).map((url: string, position: number) => ({ url, position })),
                };
            }
        }

        const updated = await prisma.product.update({
            where: { id },
            data: updatePayload as never,
        });
        return NextResponse.json({ success: true, message: 'Product updated successfully', product: updated }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    const isAdmin = session?.user?.roles?.includes('ADMIN');
    if (!isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    try {
        await prisma.product.delete({
            where: { id },
        });
        return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
    }
}


export async function GET(request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { images: true, categories: true, productBrand: true, tags: true },
        });
        return NextResponse.json({ success: true, product }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to get product' }, { status: 500 });
    }
}
