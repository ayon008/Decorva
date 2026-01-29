import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const session = await auth();
    const isAdmin = session?.user?.roles.includes('ADMIN');
    if (!isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const slug: string = data?.name?.split(' ').join('-').toLowerCase();

    const existingBrand = await prisma.productBrand.findFirst({
        where: { slug }
    });

    if (existingBrand) {
        return NextResponse.json({ success: false, message: 'Brand already exists' }, { status: 400 });
    }

    try {
        await prisma.productBrand.create({
            data: {
                name: data.name,
                slug: slug,
            }
        });
        return NextResponse.json({ success: true, message: 'Brand created successfully' }, { status: 200 });
    } catch {
        return NextResponse.json({ success: false, message: 'An error occurred while creating brand' }, { status: 500 });
    }
}



export async function GET() {
    const session = await auth();
    const isAdmin = session?.user?.roles.includes('ADMIN');
    if (!isAdmin) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const brands = await prisma.productBrand.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
            }
        });
        return NextResponse.json({ success: true, data: brands }, { status: 200 });
    } catch {
        return NextResponse.json({ success: false, message: 'An error occurred while fetching brands' }, { status: 500 });
    }
}