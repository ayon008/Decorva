import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    const isAdmin = session?.user?.roles?.includes('ADMIN');
    if (!isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const product = await prisma.product.delete({
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
