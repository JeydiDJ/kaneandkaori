"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import logo from "@/assets/kaneandkaori-logo.png";
import { routes } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";

const socialLinks = [
  {
    href: "https://www.instagram.com/kaneandkaori_/",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@kaneandkaori",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M14.2 3c.2 1.6 1.1 3.1 2.4 4.1 1 .8 2.2 1.2 3.4 1.3v3.1c-1.6-.1-3.1-.5-4.5-1.2v5.5c0 3.1-2.5 5.6-5.6 5.6S4.3 18.9 4.3 15.8s2.5-5.6 5.6-5.6c.3 0 .6 0 .9.1v3.2a2.5 2.5 0 1 0 1.9 2.4V3h1.5Z" />
      </svg>
    ),
  },
  {
    href: "https://web.facebook.com/profile.php?id=61583758193943&_rdc=1&_rdr#",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M13.4 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.6 1.6-1.6h1.7V3.5c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7.3V13H10v8h3.4Z" />
      </svg>
    ),
  },
] as const;

const navLinkClass =
  "rounded-full px-2 py-1.5 transition hover:bg-white/35 hover:text-[var(--foreground)] sm:px-3 sm:py-2";

export function Navbar() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const inStudio = pathname.startsWith("/studio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-[linear-gradient(180deg,rgba(243,237,225,0.28),rgba(243,237,225,0.08))] backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-4 md:px-6 md:py-3">
        <div className="flex items-center justify-between">
          <Link href={routes.home} className="inline-flex items-center gap-2 sm:gap-3" aria-label="Kane and Kaori home" onClick={closeMobileMenu}>
            <Image src={logo} alt="Kane & Kaori" className="h-10 w-auto sm:h-12 md:h-16" priority />
            <span className="hidden text-xs font-semibold tracking-[0.18em] uppercase text-[var(--foreground)] sm:block md:text-lg md:tracking-[0.28em]">
              Kane & Kaori
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-[var(--foreground)] transition duration-200 hover:-translate-y-px hover:text-black md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {mobileMenuOpen ? (
                <>
                  <path d="M5 5l10 10" strokeLinecap="round" />
                  <path d="M15 5 5 15" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M3.5 5.5h13" strokeLinecap="round" />
                  <path d="M3.5 10h13" strokeLinecap="round" />
                  <path d="M3.5 14.5h13" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>

          <nav className="hidden items-center gap-1 text-xs text-[var(--muted)] sm:text-sm md:flex md:gap-3">
            <Link href={routes.blog} className={navLinkClass}>
              Blog
            </Link>
            <Link href={routes.products} className={navLinkClass}>
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
                <Link href={routes.checkout} className={navLinkClass}>
                  Checkout
                </Link>
              </>
            )}
            <div className="hidden items-center gap-1 text-[var(--muted)] sm:flex">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="inline-flex h-9 w-9 items-center justify-center text-[var(--muted)] transition duration-200 hover:-translate-y-px hover:text-[var(--foreground)]"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div
          className={`overflow-hidden transition-[max-height,opacity,transform,margin] duration-300 ease-out md:hidden ${
            mobileMenuOpen
              ? "mt-3 max-h-[28rem] translate-y-0 opacity-100"
              : "mt-0 max-h-0 -translate-y-2 opacity-0 pointer-events-none"
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="rounded-[1.8rem] border border-white/70 bg-white/72 p-4 shadow-[0_18px_42px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <nav className="grid gap-2 text-sm text-[var(--muted)]">
              <Link href={routes.blog} className="rounded-2xl px-4 py-3 transition hover:bg-white/70 hover:text-[var(--foreground)]" onClick={closeMobileMenu}>
                Blog
              </Link>
              <Link href={routes.products} className="rounded-2xl px-4 py-3 transition hover:bg-white/70 hover:text-[var(--foreground)]" onClick={closeMobileMenu}>
                Shop
              </Link>
              {inStudio ? (
                <>
                  <span className="inline-flex items-center justify-between rounded-2xl px-4 py-3 opacity-45" aria-disabled="true">
                    <span>Cart</span>
                    <span suppressHydrationWarning className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-contrast)]">
                      {itemCount}
                    </span>
                  </span>
                  <span className="rounded-2xl px-4 py-3 opacity-45" aria-disabled="true">
                    Checkout
                  </span>
                </>
              ) : (
                <>
                  <Link href={routes.cart} className="inline-flex items-center justify-between rounded-2xl px-4 py-3 transition hover:bg-white/70 hover:text-[var(--foreground)]" onClick={closeMobileMenu}>
                    <span>Cart</span>
                    <span suppressHydrationWarning className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-contrast)] shadow-[0_8px_16px_rgba(0,0,0,0.25)]">
                      {itemCount}
                    </span>
                  </Link>
                  <Link href={routes.checkout} className="rounded-2xl px-4 py-3 transition hover:bg-white/70 hover:text-[var(--foreground)]" onClick={closeMobileMenu}>
                    Checkout
                  </Link>
                </>
              )}
            </nav>

            <div className="mt-4 flex items-center gap-3 border-t border-[var(--border)]/70 pt-4 text-[var(--muted)]">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="inline-flex h-10 w-10 items-center justify-center text-[var(--muted)] transition duration-200 hover:-translate-y-px hover:text-[var(--foreground)]"
                  onClick={closeMobileMenu}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
