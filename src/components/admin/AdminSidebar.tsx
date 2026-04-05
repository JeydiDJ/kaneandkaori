"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const links = [
  { href: "/studio", label: "Dashboard" },
  { href: "/studio/blog", label: "Blog" },
  { href: "/studio/products", label: "Products" },
  { href: "/studio/orders", label: "Orders" },
  { href: "/studio/reports", label: "Reports" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/studio") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/studio/login");
  }

  return (
    <aside className="rounded-[2rem] border border-white/75 bg-white/88 p-4 shadow-[0_20px_55px_rgba(0,0,0,0.10)] xl:sticky xl:top-6 xl:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Studio</p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-full border border-white/55 bg-white/50 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:bg-white/80 xl:hidden"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <nav
        className={`mt-5 grid gap-2 overflow-hidden text-sm transition-[max-height,opacity,margin] duration-300 ease-out xl:mt-5 xl:max-h-none xl:opacity-100 ${
          mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 xl:max-h-none"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobileMenu}
            className={`rounded-2xl px-4 py-3 font-medium transition ${isActive(link.href) ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_12px_28px_rgba(0,0,0,0.25)]" : "bg-white/45 hover:bg-[var(--surface)]/75"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Button className="mt-5 w-full" variant="secondary" onClick={handleSignOut}>
        Sign out
      </Button>
    </aside>
  );
}
