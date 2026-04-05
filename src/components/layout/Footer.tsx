import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/kaneandkaori-logo.png";

const IKIGAI = "Ikigai (\u751f\u304d\u7532\u6590)";
const KAIZEN = "Kaizen (\u6539\u5584)";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/shipping", label: "Shipping" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="mt-8 border-t border-white/55 bg-white/50">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-[var(--muted)] sm:px-6 md:py-12">
        <div className="flex items-start gap-4 sm:gap-6 md:gap-8">
          <Image src={logo} alt="Kane & Kaori" className="h-24 w-auto shrink-0 sm:h-28 md:h-32" />
          <div className="min-w-0 flex-1 space-y-4">
            <p className="max-w-2xl leading-7">
              A fragrance house rooted in {IKIGAI} and {KAIZEN}, creating scents that carry memory, purpose, and quiet beauty.
            </p>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]/85">Purpose becomes art. Growth becomes beauty.</p>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--foreground)]/80">Information</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="transition hover:text-[var(--foreground)] hover:underline">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
