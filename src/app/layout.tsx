import type { Metadata } from "next";

import "./globals.css";

import favicon from "@/assets/favicon.ico";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { siteConfig } from "@/constants/config";
import { CartProvider } from "@/hooks/useCart";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Perfume Ecommerce`,
  description: siteConfig.description,
  icons: {
    icon: favicon.src,
    shortcut: favicon.src,
    apple: favicon.src,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="page-shell">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
