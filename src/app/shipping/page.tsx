import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping | Kane & Kaori",
  description: "Shipping timelines, processing details, and delivery information for Kane & Kaori orders.",
};

export default function ShippingPage() {
  return (
    <section className="section-wrap">
      <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/70 bg-white/70 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Shipping</p>
        <h1 className="display-font text-5xl">Delivery Information</h1>
        <ul className="space-y-3 leading-8 text-[var(--muted)]">
          <li>Orders are reviewed and prepared within 1-2 business days.</li>
          <li>Local delivery usually arrives within 2-5 business days after dispatch.</li>
          <li>Tracking or delivery confirmation details are shared after fulfillment.</li>
          <li>For urgent requests, contact us before placing your order.</li>
        </ul>
      </div>
    </section>
  );
}
