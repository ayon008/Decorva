import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://decorva.com";
const siteName = "Decorva";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Home Decor & Furniture`,
    template: `%s | ${siteName}`,
  },
  description:
    "Decorva - Online home decor and furniture store. Discover our selection of furniture, lighting and accessories to transform your interior.",
  keywords: [
    "home decor",
    "furniture",
    "interior design",
    "lighting",
    "decor accessories",
    "home furnishings",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: `${siteName} | Home Decor & Furniture`,
    description:
      "Decorva - Online home decor and furniture store. Discover our selection to transform your interior.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Home Decor & Furniture`,
    description: "Online home decor and furniture store.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const authMetadata: Metadata = {
  title: "Login",
  description: "Sign in to your Decorva account to access your orders and wishlist.",
  robots: { index: false, follow: true },
};

export const dashboardMetadata: Metadata = {
  title: "Dashboard",
  description: "Decorva store management - Products, orders and settings.",
  robots: { index: false, follow: false },
};
