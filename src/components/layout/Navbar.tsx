 "use client";

import Link from "next/link";

import { routes } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";

export function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-[rgba(247,241,232,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={routes.home} className="text-lg font-semibold tracking-[0.28em] uppercase">
          Kane & Kaori
        </Link>
        <nav className="flex items-center gap-5 text-sm text-[var(--muted)]">
          <Link href={routes.products}>Shop</Link>
          <Link href={routes.cart} className="inline-flex items-center gap-2">
            Cart
            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-contrast)]">
              {itemCount}
            </span>
          </Link>
          <Link href={routes.checkout}>Checkout</Link>
        </nav>
      </div>
    </header>
  );
}
