import type { Metadata } from "next";

import '../globals.css';
import { rubik } from "@/Shared/font/Rubik";
import Footer from "@/Shared/Foooter/footer";
import NavBar from "@/Shared/Navbar/NavBar";
import { SessionProvider } from "next-auth/react";
import TanstackProvider from "@/Shared/Providers/TanstackProvider";
import CartProvider from "@/Shared/Providers/CartPovider";
import WishlistProvider from "@/Shared/Providers/WishlistProvider";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = defaultMetadata;

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
        <SessionProvider>
          <TanstackProvider>
            <CartProvider>
              <WishlistProvider>
                <NavBar />
                {children}
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </TanstackProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
