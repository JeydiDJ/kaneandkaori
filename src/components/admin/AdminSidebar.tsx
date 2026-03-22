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
    <aside className="rounded-[2rem] border border-white/70 bg-white/85 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Studio</p>
      <nav className="mt-5 grid gap-2 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-2xl px-4 py-3 transition ${pathname === link.href ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "hover:bg-[var(--surface)]"}`}
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
