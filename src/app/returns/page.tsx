import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns | Kane & Kaori",
  description: "Return and exchange policy for Kane & Kaori fragrance orders.",
};

export default function ReturnsPage() {
  return (
    <section className="section-wrap">
      <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/70 bg-white/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Returns</p>
        <h1 className="display-font text-4xl md:text-5xl">Return Policy</h1>
        <ul className="space-y-3 leading-8 text-[var(--muted)]">
          <li>Returns are accepted for damaged or incorrect items reported within 48 hours of delivery.</li>
          <li>Unopened items may be eligible for exchange subject to review.</li>
          <li>For hygiene and safety reasons, opened fragrance products are generally non-returnable unless defective.</li>
          <li>Please include your order reference when requesting support.</li>
        </ul>
      </div>
    </section>
  );
}


