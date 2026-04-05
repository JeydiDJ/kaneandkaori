"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import logo from "@/assets/kaneandkaori-logo.png";
import { routes } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";

export function Navbar() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const inStudio = pathname.startsWith("/studio");

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-[linear-gradient(180deg,rgba(243,237,225,0.28),rgba(243,237,225,0.08))] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4 md:px-6 md:py-3">
        <Link href={routes.home} className="inline-flex items-center gap-2 sm:gap-3" aria-label="Kane and Kaori home">
          <Image src={logo} alt="Kane & Kaori" className="h-10 w-auto sm:h-12 md:h-16" priority />
          <span className="hidden text-xs font-semibold tracking-[0.18em] uppercase text-[var(--foreground)] sm:block md:text-lg md:tracking-[0.28em]">
            Kane & Kaori
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-xs text-[var(--muted)] sm:text-sm md:gap-3">
          <Link href={routes.blog} className="rounded-full px-2 py-1.5 transition hover:bg-white/35 hover:text-[var(--foreground)] sm:px-3 sm:py-2">
            Blog
          </Link>
          <Link href={routes.products} className="rounded-full px-2 py-1.5 transition hover:bg-white/35 hover:text-[var(--foreground)] sm:px-3 sm:py-2">
            Shop
          </Link>
          {inStudio ? (
            <>
              <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-full px-2 py-1.5 opacity-45 sm:gap-2 sm:px-3 sm:py-2" aria-disabled="true">
                Cart
                <span suppressHydrationWarning className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-contrast)]">
                  {itemCount}
                </span>
              </span>
              <span className="cursor-not-allowed rounded-full px-2 py-1.5 opacity-45 sm:px-3 sm:py-2" aria-disabled="true">
                Checkout
              </span>
            </>
          ) : (
            <>
              <Link href={routes.cart} className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 transition hover:bg-white/35 hover:text-[var(--foreground)] sm:gap-2 sm:px-3 sm:py-2">
                Cart
                <span suppressHydrationWarning className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-contrast)] shadow-[0_8px_16px_rgba(0,0,0,0.25)]">
                  {itemCount}
                </span>
              </Link>
              <Link href={routes.checkout} className="rounded-full px-2 py-1.5 transition hover:bg-white/35 hover:text-[var(--foreground)] sm:px-3 sm:py-2">
                Checkout
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

