import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your favorite Decorva products. Find the items you saved for later.",
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
