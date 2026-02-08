import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Account",
    description: "Manage your information, view your orders and update your shipping addresses.",
    keywords: ["account", "profile", "orders", "billing", "shipping", "decorva"],
    robots: {
        index: false,
        follow: false,
    },
};

export default function MyAccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
