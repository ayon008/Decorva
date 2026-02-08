import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { defaultMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: "asc" } },
      },
    });

    if (!product) {
      return defaultMetadata;
    }

    const title = product.name;
    const description =
      product.shortDescriptionHtml?.replace(/<[^>]*>/g, "").slice(0, 160) ||
      product.descriptionHtml?.replace(/<[^>]*>/g, "").slice(0, 160) ||
      `${product.name} - Discover this product on Decorva`;

    const imageUrl = product.images?.[0]?.url;

    return {
      ...defaultMetadata,
      title,
      description,
      openGraph: {
        ...defaultMetadata.openGraph,
        title,
        description,
        images: imageUrl ? [{ url: imageUrl, alt: product.name }] : undefined,
      },
      twitter: {
        ...defaultMetadata.twitter,
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch {
    return defaultMetadata;
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
