import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms | Kane & Kaori",
  description: "Terms, conditions, and privacy information for purchases and use of the Kane & Kaori website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <section className="section-wrap">
      <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/70 bg-white/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Terms</p>
        <h1 className="display-font text-4xl md:text-5xl">Terms & Conditions</h1>
        <p className="leading-8 text-[var(--muted)]">By placing an order, you agree to provide accurate details and use valid payment information. Pricing, stock, and fulfillment timelines may change without prior notice.</p>
        <p className="leading-8 text-[var(--muted)]">Kane & Kaori may cancel or decline orders in cases of suspected fraud, inaccurate data, or unavailable inventory.</p>
        <div className="space-y-4 border-t border-[var(--foreground)]/10 pt-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Privacy</p>
          <p className="leading-8 text-[var(--muted)]">
            We only collect details required to process and deliver your order, provide support, and improve service quality.
          </p>
          <p className="leading-8 text-[var(--muted)]">
            Personal information is handled with care and is not sold to third parties. Payment data should be shared only through secure, approved channels.
          </p>
        </div>
      </div>
    </section>
  );
}
