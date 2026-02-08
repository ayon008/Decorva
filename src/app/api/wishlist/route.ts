import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type WishlistApiItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
};

function toApiItem(
  item: {
    productId: string;
    product: {
      name: string;
      slug: string;
      salePrice: number | null;
      regularPrice: number | null;
      price: number | null;
      images: { url: string }[];
    };
  }
): WishlistApiItem {
  const product = item.product;
  const price =
    product.salePrice ?? product.regularPrice ?? product.price ?? 0;
  const image = product.images?.[0]?.url ?? "";
  return {
    id: item.productId,
    name: product.name,
    price,
    image,
    slug: product.slug,
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ items: [] });
  }

  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: { images: { orderBy: { position: "asc" } } },
        },
      },
    });
    const apiItems = items.map(toApiItem);
    return NextResponse.json({ items: apiItems });
  } catch (e) {
    console.error("Wishlist GET error:", e);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { productId: string };
    const { productId } = body;
    if (!productId) {
      return NextResponse.json(
        { error: "productId required" },
        { status: 400 }
      );
    }

    const existing = await prisma.wishlistItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });
    if (existing) {
      const items = await prisma.wishlistItem.findMany({
        where: { userId: session.user.id },
        include: {
          product: {
            include: { images: { orderBy: { position: "asc" } } },
          },
        },
      });
      return NextResponse.json({ items: items.map(toApiItem) });
    }

    await prisma.wishlistItem.create({
      data: { userId: session.user.id, productId },
    });

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: { images: { orderBy: { position: "asc" } } },
        },
      },
    });
    return NextResponse.json({ items: items.map(toApiItem) });
  } catch (e) {
    console.error("Wishlist POST error:", e);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "productId required" },
      { status: 400 }
    );
  }

  try {
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: { images: { orderBy: { position: "asc" } } },
        },
      },
    });
    return NextResponse.json({ items: items.map(toApiItem) });
  } catch (e) {
    console.error("Wishlist DELETE error:", e);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
