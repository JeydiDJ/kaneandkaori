import Link from "next/link";

import { ProductGrid } from "@/components/products/ProductGrid";
import { getFeaturedProducts } from "@/services/productService";

const IKIGAI = "Ikigai (\u751f\u304d\u7532\u6590)";
const KAIZEN = "Kaizen (\u6539\u5584)";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="relative overflow-hidden">
      <section className="section-wrap pt-14 md:pt-20">
        <div className="kk-orb kk-orb-1" aria-hidden />
        <div className="kk-orb kk-orb-2" aria-hidden />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="kk-fade-up">
            <p className="text-xs uppercase tracking-[0.45em] text-[var(--muted)]">Kane & Kaori</p>
            <h1 className="display-font mt-4 max-w-4xl text-6xl leading-[0.95] md:text-8xl">
              Fragrance for
              <br />
              becoming.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              At Kane & Kaori, scent is a quiet compass. Each blend is shaped to hold memory, mark growth, and bring clarity to everyday rituals.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/products" className="rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition hover:brightness-95">
                Explore the collection
              </Link>
              <a href="#philosophy" className="rounded-full border border-[var(--border)] bg-white/65 px-7 py-3 text-sm font-semibold text-[var(--foreground)]">
                Read our philosophy
              </a>
            </div>
          </div>

          <div className="kk-fade-up-delayed rounded-[2rem] border border-white/70 bg-white/65 p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Foundations</p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/55 p-5">
                <p className="display-font text-2xl">{IKIGAI}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">A reason for being that guides each scent toward emotional meaning.</p>
              </div>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/55 p-5">
                <p className="display-font text-2xl">{KAIZEN}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">A commitment to refine formulas, details, and craftsmanship over time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="philosophy" className="section-wrap pt-2 md:pt-6">
        <div className="grid gap-6 rounded-[2rem] border border-white/80 bg-white/70 p-7 md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="kk-fade-up">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Brand Philosophy</p>
            <h2 className="display-font mt-4 text-4xl md:text-5xl">Purpose in every bottle</h2>
            <p className="mt-5 text-base leading-8 text-[var(--muted)]">
              We create fragrances that do more than smell beautiful. They become personal markers of intention, comfort, and transformation.
            </p>
            <p className="mt-5 text-base leading-8 text-[var(--muted)]">
              Rooted in {IKIGAI} and {KAIZEN}, Kane & Kaori is devoted to purposeful living and continuous refinement.
            </p>
          </div>
          <div className="kk-fade-up-delayed grid gap-4 text-[var(--muted)]">
            <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(244,232,219,0.8))] p-5">
              <p className="display-font text-2xl text-[var(--foreground)]">Moments we design for</p>
              <p className="mt-3 leading-8">A fragrance before a brave decision. A scent that returns you to a cherished memory. An aroma that honors a new beginning.</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-white/75 p-5">
              <p className="display-font text-2xl text-[var(--foreground)]">Our promise</p>
              <p className="mt-3 leading-8">Purpose becomes art, and growth becomes beauty, captured gently and carried daily.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap pt-2 md:pt-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Scent Rituals</p>
            <h2 className="display-font mt-2 text-4xl md:text-5xl">Crafted for memory and meaning</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-[var(--muted)] underline-offset-4 hover:underline">
            View all fragrances
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
}
