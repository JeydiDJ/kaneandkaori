import Image from "next/image";

import logo from "@/assets/kaneandkaori-logo.png";

const IKIGAI = "Ikigai (\u751f\u304d\u7532\u6590)";
const KAIZEN = "Kaizen (\u6539\u5584)";

export function Footer() {
  return (
    <footer className="border-t border-white/50 bg-white/45">
      <div className="mx-auto grid max-w-7xl gap-3 px-6 py-10 text-sm text-[var(--muted)] md:grid-cols-2">
        <div>
          <Image src={logo} alt="Kane & Kaori" className="h-8 w-auto" />
          <p className="mt-3 max-w-md">A fragrance house rooted in {IKIGAI} and {KAIZEN}, creating scents that carry memory, purpose, and quiet beauty.</p>
        </div>
        <div className="md:text-right">
          <p>Thoughtful fragrances</p>
          <p>Purposeful craft</p>
          <p>Continuous refinement</p>
        </div>
      </div>
    </footer>
  );
}
