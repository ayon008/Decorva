import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const email = data.email;
    const existingContactMessage = await prisma.contactMessage.findUnique({
        where: {
            email: email,
        },
    });
    if (existingContactMessage) {
        return NextResponse.json({ success: false, message: 'Message already sent' }, { status: 400 });
    }
    try {
        const contactMessage = await prisma.contactMessage.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                message: data.message,
            },
        });
        return NextResponse.json({ success: true, message: 'Message sent successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to send message' }, { status: 500 });
    }
}