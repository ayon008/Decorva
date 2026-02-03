import { prisma } from "@/lib/prisma";

export const UNCATEGORIZED_SLUG = "uncategorized";

/**
 * Returns the "Uncategorized" category, creating it if it doesn't exist.
 * Used when reassigning products that lose their last category.
 */
export async function getOrCreateUncategorized() {
  let uncategorized = await prisma.productCategory.findUnique({
    where: { slug: UNCATEGORIZED_SLUG },
  });
  if (!uncategorized) {
    uncategorized = await prisma.productCategory.create({
      data: {
        name: "Uncategorized",
        slug: UNCATEGORIZED_SLUG,
        description: "Default category for products without a category",
      },
    });
  }
  return uncategorized;
}

/**
 * Checks if a category slug is the protected "Uncategorized" category.
 */
export function isUncategorized(slug: string): boolean {
  return slug === UNCATEGORIZED_SLUG;
}
