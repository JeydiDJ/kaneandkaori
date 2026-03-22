import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms | Kane & Kaori",
  description: "Terms and conditions for purchases and use of the Kane & Kaori website.",
};

export default function TermsPage() {
  return (
    <section className="section-wrap">
      <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/70 bg-white/70 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Terms</p>
        <h1 className="display-font text-5xl">Terms & Conditions</h1>
        <p className="leading-8 text-[var(--muted)]">By placing an order, you agree to provide accurate details and use valid payment information. Pricing, stock, and fulfillment timelines may change without prior notice.</p>
        <p className="leading-8 text-[var(--muted)]">Kane & Kaori may cancel or decline orders in cases of suspected fraud, inaccurate data, or unavailable inventory.</p>
      </div>
    </section>
  );
}
