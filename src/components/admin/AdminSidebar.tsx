"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const links = [
  { href: "/studio", label: "Dashboard" },
  { href: "/studio/products", label: "Products" },
  { href: "/studio/orders", label: "Orders" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/studio/login");
  }

  return (
    <aside className="rounded-[2rem] border border-white/75 bg-white/88 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.10)]">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Studio</p>
      <nav className="mt-5 grid gap-2 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-2xl px-4 py-3 font-medium transition ${pathname === link.href ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_12px_28px_rgba(0,0,0,0.25)]" : "hover:bg-[var(--surface)]/75"}`}
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

