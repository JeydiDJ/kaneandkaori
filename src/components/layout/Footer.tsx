import Image from "next/image";

import logo from "@/assets/kaneandkaori-logo.png";

const IKIGAI = "Ikigai (\u751f\u304d\u7532\u6590)";
const KAIZEN = "Kaizen (\u6539\u5584)";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-white/55 bg-white/50">
      <div className="mx-auto grid max-w-7xl gap-7 px-6 py-12 text-sm text-[var(--muted)] md:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          <Image src={logo} alt="Kane & Kaori" className="h-9 w-auto" />
          <p className="max-w-lg leading-7">
            A fragrance house rooted in {IKIGAI} and {KAIZEN}, creating scents that carry memory, purpose, and quiet beauty.
          </p>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]/85">Purpose becomes art. Growth becomes beauty.</p>
        </div>
        <div className="md:text-right">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--foreground)]/80">Kane & Kaori</p>
          <div className="mt-3 space-y-2">
            <p>Thoughtful fragrances</p>
            <p>Purposeful craft</p>
            <p>Continuous refinement</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
