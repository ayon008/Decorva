import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
        return NextResponse.json({ error: "No file" }, { status: 400 })
    }

    // Convert file → base64 (ImgBB requires this)
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")

    const imgbbForm = new FormData()
    imgbbForm.append("image", base64)

    const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        {
            method: "POST",
            body: imgbbForm,
        }
    )

    const data = await imgbbRes.json()

    if (!data.success) {
        return NextResponse.json(
            { error: "ImgBB upload failed" },
            { status: 500 }
        )
    }

    return NextResponse.json({
        url: data.data.url, // CDN URL
    })
}
