import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Kane & Kaori",
  description: "Contact Kane & Kaori for order support, shipping questions, and fragrance inquiries.",
};

export default function ContactPage() {
  return (
    <section className="section-wrap">
      <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/70 bg-white/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Contact</p>
        <h1 className="display-font text-4xl md:text-5xl">Get in Touch</h1>
        <p className="leading-8 text-[var(--muted)]">For order support, product questions, or partnership inquiries, reach out and include your order reference if available.</p>
        <div className="space-y-2 text-[var(--muted)]">
          <p>Email: support@kaneandkaori.com</p>
          <p>Response Time: within 1-2 business days</p>
        </div>
      </div>
    </section>
  );
}


