import { normalizeSlug } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import { getOrCreateUncategorized, isUncategorized } from "@/lib/category";
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
        if (isUncategorized(slug) && normalizedNewSlug && normalizedNewSlug !== slug) {
            return NextResponse.json(
                { success: false, message: 'The "Uncategorized" category slug cannot be changed' },
                { status: 400 }
            );
        }
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
        if (isUncategorized(slug)) {
            return NextResponse.json(
                { success: false, message: 'The "Uncategorized" category cannot be deleted' },
                { status: 400 }
            );
        }

        const existing = await prisma.productCategory.findUnique({
            where: { slug },
            include: { products: { select: { id: true, categoryIds: true } } },
        });
        if (!existing) {
            return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
        }

        const uncategorized = await getOrCreateUncategorized();
        const categoryId = existing.id;

        await prisma.$transaction(async (tx) => {
            // 1. Products assigned ONLY to this category → reassign to Uncategorized
            const productsOnlyInThis = existing.products.filter(
                (p) => p.categoryIds.length === 1 && p.categoryIds[0] === categoryId
            );
            for (const product of productsOnlyInThis) {
                await tx.product.update({
                    where: { id: product.id },
                    data: { categories: { set: [{ id: uncategorized.id }] } },
                });
            }

            // 2. Products in multiple categories → just remove this category
            const productsInMultiple = existing.products.filter(
                (p) => p.categoryIds.length > 1
            );
            for (const product of productsInMultiple) {
                await tx.product.update({
                    where: { id: product.id },
                    data: { categories: { disconnect: { id: categoryId } } },
                });
            }

            // 3. Child categories become top-level (parentId = null)
            await tx.productCategory.updateMany({
                where: { parentId: categoryId },
                data: { parentId: null },
            });

            // 4. Delete the category (products are never deleted)
            await tx.productCategory.delete({
                where: { id: categoryId },
            });
        });

        return NextResponse.json({ success: true, message: 'Category deleted' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to delete category' }, { status: 500 });
    }
}