import { prisma } from "@/lib/prisma";

/**
 * Generates a unique SKU. Format: SKU-{timestamp}-{random}
 * Retries if collision occurs (extremely rare).
 */
export async function generateUniqueSku(): Promise<string> {
  const base = `SKU-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  let sku = base;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (!existing) return sku;
    sku = `SKU-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    attempts++;
  }

  return sku;
}
