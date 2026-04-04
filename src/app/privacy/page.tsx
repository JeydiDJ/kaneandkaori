import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy | Kane & Kaori",
  description: "How Kane & Kaori collects, uses, and protects customer information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <section className="section-wrap">
      <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/70 bg-white/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Privacy</p>
        <h1 className="display-font text-4xl md:text-5xl">Privacy Policy</h1>
        <p className="leading-8 text-[var(--muted)]">We only collect details required to process and deliver your order, provide support, and improve service quality.</p>
        <p className="leading-8 text-[var(--muted)]">Personal information is handled with care and is not sold to third parties. Payment data should be shared only through secure, approved channels.</p>
      </div>
    </section>
  );
}
