import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSku } from "@/lib/product";
import { NextResponse } from "next/server";

function parseDateTime(value: unknown): Date | null {
    if (value == null || value === '') return null;
    if (value instanceof Date) return value;
    const str = String(value).trim();
    if (!str) return null;
    const date = new Date(str);
    return Number.isNaN(date.getTime()) ? null : date;
}

export async function POST(req: Request) {
    const session = await auth();
    const isAdmin = session?.user?.roles?.includes('ADMIN');
    if (!isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const data = await req.json();

    const saleStart = parseDateTime(data.saleStart);
    const saleEnd = parseDateTime(data.saleEnd);
    const { saleStart: _s, saleEnd: _e, images, productBrand, categories, ...rest } = data;

    let sku = typeof data.sku === 'string' ? data.sku.trim() : '';
    if (!sku) {
        sku = await generateUniqueSku();
    } else {
        const existingProduct = await prisma.product.findUnique({
            where: { sku },
        });
        if (existingProduct) {
            return NextResponse.json({ success: false, message: 'SKU already exists' }, { status: 400 });
        }
    }

    const payload = {
        ...rest,
        sku,
        ...(saleStart != null && { saleStart }),
        ...(saleEnd != null && { saleEnd }),
        ...(images?.length > 0 && { images: { create: images.map((url: string, position: number) => ({ url, position })) } }),
        ...(productBrand && { productBrand: { connect: { id: productBrand } } }),
        ...(categories?.length > 0 && { categories: { connect: categories.map((id: string) => ({ id })) } }),
    };

    try {
        const product = await prisma.product.create({
            data: payload,
        });
        return NextResponse.json({
            success: true,
            message: 'Product created successfully',
            product,
        }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to create product' }, { status: 500 });
    }
}


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    
    try {

        if (slug) {
            const product = await prisma.product.findUnique({
                where: { slug },
                include: {
                    images: true,
                    categories: true,
                    productBrand: true,
                    tags: true,
                }
            });
            return NextResponse.json({ success: true, product }, { status: 200 });
        }

        const products = await prisma.product.findMany({
            where: {
                slug: {
                    not: "",
                },
            },
            include: {
                images: true,
                categories: true,
                productBrand: true,
                tags: true,
            }
        });
        return NextResponse.json({ success: true, products }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to get products' }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    const session = await auth();
    const isAdmin = session?.user?.roles?.includes('ADMIN');
    if (!isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const data = await req.json();
    const { id } = data;
    try {
        const product = await prisma.product.delete({
            where: { id },
        });
        return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
    }
}