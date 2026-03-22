"use client";

import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/kaneandkaori-logo.png";
import { routes } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";

export function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/55 bg-[rgba(243,237,225,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href={routes.home} className="inline-flex items-center gap-3" aria-label="Kane and Kaori home">
          <Image src={logo} alt="Kane & Kaori" className="h-14 w-auto md:h-16" priority />
          <span className="text-sm font-semibold tracking-[0.28em] uppercase text-[var(--foreground)] md:text-lg">
            Kane & Kaori
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm text-[var(--muted)] md:gap-3">
          <Link href={routes.products} className="rounded-full px-3 py-2 transition hover:bg-white/65 hover:text-[var(--foreground)]">
            Shop
          </Link>
          <Link href={routes.cart} className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-white/65 hover:text-[var(--foreground)]">
            Cart
            <span suppressHydrationWarning className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-contrast)] shadow-[0_8px_16px_rgba(0,0,0,0.25)]">
              {itemCount}
            </span>
          </Link>
          <Link href={routes.checkout} className="rounded-full px-3 py-2 transition hover:bg-white/65 hover:text-[var(--foreground)]">
            Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}

