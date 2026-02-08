import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your Decorva cart. Proceed to checkout to complete your decor and furniture order.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
