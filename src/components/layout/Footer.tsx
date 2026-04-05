import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/kaneandkaori-logo.png";

const IKIGAI = "Ikigai (\u751f\u304d\u7532\u6590)";
const KAIZEN = "Kaizen (\u6539\u5584)";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="mt-8 border-t border-white/55 bg-white/50">
      <div className="mx-auto grid max-w-7xl gap-7 px-4 py-10 text-sm text-[var(--muted)] sm:px-6 md:grid-cols-[1.2fr_0.8fr] md:py-12">
        <div className="space-y-4">
          <Image src={logo} alt="Kane & Kaori" className="h-9 w-auto" />
          <p className="max-w-lg leading-7">
            A fragrance house rooted in {IKIGAI} and {KAIZEN}, creating scents that carry memory, purpose, and quiet beauty.
          </p>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]/85">Purpose becomes art. Growth becomes beauty.</p>
        </div>
        <div className="md:text-right">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--foreground)]/80">Information</p>
          <div className="mt-3 grid gap-2 md:justify-items-end">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[var(--foreground)] hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
