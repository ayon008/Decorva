import { normalizeSlug } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request,
    { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    try {
        const category = await prisma.productCategory.findUnique({
            where: { slug },
            include: {
                products: {
                    include: {
                        images: true,
                    }
                },
            }
        });
        return NextResponse.json({ success: true, category }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to get category' }, { status: 500 });
    }
}

export async function PATCH(request: Request,
    { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    try {
        const body = await request.json();
        const { name, slug: newSlug, parentId } = body;

        const existing = await prisma.productCategory.findUnique({ where: { slug } });
        if (!existing) {
            return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
        }

        const normalizedNewSlug = newSlug != null ? normalizeSlug(String(newSlug)) : null;
        if (normalizedNewSlug && normalizedNewSlug !== slug) {
            const taken = await prisma.productCategory.findUnique({ where: { slug: normalizedNewSlug } });
            if (taken) {
                return NextResponse.json({ success: false, message: 'Slug already in use' }, { status: 400 });
            }
        }

        const updateData: { name?: string; slug?: string; parentId?: string | null } = {};
        if (name != null) updateData.name = String(name);
        if (normalizedNewSlug) updateData.slug = normalizedNewSlug;
        if (parentId !== undefined) updateData.parentId = parentId === '' || parentId == null ? null : parentId;

        const category = await prisma.productCategory.update({
            where: { slug },
            data: updateData,
        });
        return NextResponse.json({ success: true, message: 'Category updated', category }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(request: Request,
    { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    try {
        const existing = await prisma.productCategory.findUnique({ where: { slug } });
        if (!existing) {
            return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
        }

        await prisma.productCategory.delete({
            where: { slug },
        });
        return NextResponse.json({ success: true, message: 'Category deleted' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to delete category' }, { status: 500 });
    }
}