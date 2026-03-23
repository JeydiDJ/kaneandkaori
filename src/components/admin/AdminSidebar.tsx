"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const links = [
  { href: "/studio", label: "Dashboard" },
  { href: "/studio/products", label: "Products" },
  { href: "/studio/orders", label: "Orders" },
  { href: "/studio/reports", label: "Reports" },
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
    <aside className="rounded-[2rem] border border-white/75 bg-white/88 p-4 shadow-[0_20px_55px_rgba(0,0,0,0.10)] xl:sticky xl:top-6 xl:p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Studio</p>
      </div>
      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 text-sm xl:grid xl:gap-2 xl:overflow-visible xl:pb-0">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-2xl px-4 py-3 font-medium transition xl:shrink ${pathname === link.href ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_12px_28px_rgba(0,0,0,0.25)]" : "bg-white/45 hover:bg-[var(--surface)]/75"}`}
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

