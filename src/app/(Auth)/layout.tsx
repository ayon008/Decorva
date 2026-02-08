import type { Metadata } from "next";
import '../globals.css';
import { rubik } from "@/Shared/font/Rubik";
import { authMetadata, defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: authMetadata.title,
    description: authMetadata.description,
    robots: authMetadata.robots,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${rubik.className} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
