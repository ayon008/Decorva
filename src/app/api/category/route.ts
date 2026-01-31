import { normalizeSlug } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await prisma.productCategory.findMany({
            where: {
                slug: {
                    not: "",
                }
            }
        });
        return NextResponse.json({ success: true, categories }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to get categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const name = body?.name?.trim();
        if (!name) {
            return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
        }

        const rawSlug = body?.slug?.trim() ? body.slug : name;
        const slug = normalizeSlug(rawSlug);
        if (!slug) {
            return NextResponse.json({ success: false, message: 'Slug is required or could not be generated from name' }, { status: 400 });
        }

        const existing = await prisma.productCategory.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ success: false, message: 'A category with this slug already exists' }, { status: 400 });
        }

        const parentId = body?.parentId && body.parentId !== '' ? body.parentId : null;

        const category = await prisma.productCategory.create({
            data: {
                name,
                slug,
                ...(parentId && { parentId }),
            },
        });
        return NextResponse.json({ success: true, message: 'Category created', category }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to create category' }, { status: 500 });
    }
}