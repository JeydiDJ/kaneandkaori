import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shipping | Kane & Kaori",
  description: "Shipping timelines, delivery details, and return guidance for Kane & Kaori orders.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <section className="section-wrap">
      <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/70 bg-white/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Shipping</p>
        <h1 className="display-font text-4xl md:text-5xl">Delivery Information</h1>
        <p className="leading-8 text-[var(--muted)]">
          Order fulfillment and after-delivery support live together here so shipping expectations and return guidance are easy to find in one place.
        </p>
        <ul className="space-y-3 leading-8 text-[var(--muted)]">
          <li>Orders are reviewed and prepared within 1-2 business days.</li>
          <li>Local delivery usually arrives within 2-5 business days after dispatch.</li>
          <li>Tracking or delivery confirmation details are shared after fulfillment.</li>
          <li>For urgent requests, contact us before placing your order.</li>
        </ul>
        <div className="space-y-4 border-t border-[var(--foreground)]/10 pt-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Returns & Exchanges</p>
          <ul className="space-y-3 leading-8 text-[var(--muted)]">
            <li>Returns are accepted for damaged or incorrect items reported within 48 hours of delivery.</li>
            <li>Unopened items may be eligible for exchange subject to review.</li>
            <li>For hygiene and safety reasons, opened fragrance products are generally non-returnable unless defective.</li>
            <li>Please include your order reference when requesting support.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
