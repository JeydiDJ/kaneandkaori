import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import heroPerfume from "@/assets/hero-assets/hero-perfume.png";
import { FoundationReel } from "@/components/home/FoundationReel";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getFeaturedProducts } from "@/services/productService";

const IKIGAI = "Ikigai (生き甲斐)";
const KAIZEN = "Kaizen (改善)";

export const metadata: Metadata = {
  title: "Kane & Kaori | Fragrance for Becoming",
  description:
    "Discover purposeful fragrances inspired by Ikigai (生き甲斐) and Kaizen (改善), crafted for memory, clarity, and everyday ritual.",
};

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="kk-landing-stage relative overflow-hidden">
      <div className="kk-landing-fx" aria-hidden>
        <span className="kk-float-blob kk-float-blob-1" />
        <span className="kk-float-blob kk-float-blob-2" />
        <span className="kk-float-blob kk-float-blob-3" />
        <span className="kk-float-blob kk-float-blob-4" />
        <span className="kk-float-blob kk-float-blob-5" />
        <span className="kk-float-blob kk-float-blob-6" />
      </div>
      <section className="kk-intro-stage">
        <div className="kk-orb kk-orb-1" aria-hidden />
        <div className="kk-orb kk-orb-2" aria-hidden />
        <div className="kk-hero-bottle" aria-hidden>
          <Image src={heroPerfume} alt="" className="kk-hero-bottle-image" priority />
        </div>

        <div className="kk-hero-stage">
          <div className="section-wrap relative z-10 flex min-h-[78vh] items-center py-12 md:min-h-[88vh] md:py-20">
            <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="kk-fade-up">
                <p className="text-xs uppercase tracking-[0.45em] text-[var(--muted)]">Kane & Kaori</p>
                <h1 className="display-font mt-4 max-w-4xl text-5xl leading-[0.95] sm:text-6xl md:text-8xl">
                  Fragrance for
                  <br />
                  becoming.
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                  At Kane & Kaori, scent is a quiet compass. Each blend is shaped to hold memory, mark growth, and bring clarity to everyday rituals.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="inline-flex min-h-13 items-center justify-center rounded-full border border-[#3d3833] bg-[#3d3833] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-[#f8f3eb] shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition-all duration-200 hover:-translate-y-px hover:border-[#000000] hover:bg-[#000000] hover:text-[#fff8ef] hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)] sm:px-7 sm:py-3"
                  >
                    Explore the collection
                  </Link>
                  <a
                    href="#philosophy"
                    className="inline-flex min-h-13 items-center justify-center rounded-full border border-[#b99667] bg-transparent px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-[#8f6c3f] shadow-none transition-all duration-200 hover:-translate-y-px hover:border-[#cda87a] hover:bg-[#cda87a] hover:text-[#18110b] hover:shadow-[0_16px_30px_rgba(122,90,49,0.16)] sm:px-7 sm:py-3"
                  >
                    Read our philosophy
                  </a>
                </div>
              </div>

              <div className="kk-fade-up-delayed">
                <FoundationReel />
              </div>
            </div>
          </div>
        </div>

        <div id="philosophy" className="section-wrap kk-philosophy-bridge scroll-mt-16 pt-0">
          <div className="kk-philosophy-panel relative overflow-hidden rounded-[2.2rem] border border-white/75 p-7 shadow-[0_18px_42px_rgba(0,0,0,0.08)] md:p-11">
            <div aria-hidden className="pointer-events-none absolute -left-24 -top-20 h-56 w-56 rounded-full bg-white/45 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 right-6 h-52 w-52 rounded-full bg-[rgba(113,112,108,0.14)] blur-3xl" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="kk-fade-up">
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Brand Philosophy</p>
                <h2 className="display-font mt-4 text-3xl leading-tight sm:text-4xl md:text-6xl">Purpose in every bottle</h2>
                <p className="mt-6 border-l border-[var(--border)] pl-4 text-base leading-8 text-[var(--muted)]">
                  We create fragrances that do more than smell beautiful. They become personal markers of intention, comfort, and transformation.
                </p>
                <p className="mt-5 text-base leading-8 text-[var(--muted)]">
                  Rooted in {IKIGAI} and {KAIZEN}, Kane & Kaori is devoted to purposeful living and continuous refinement.
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Quietly crafted for modern rituals</p>
              </div>

              <div className="kk-fade-up-delayed grid gap-7 text-[var(--muted)]">
                <div className="border-b border-[var(--border)]/70 pb-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Moments we design for</p>
                  <p className="display-font mt-2 text-xl text-[var(--foreground)] sm:text-2xl">Memory. Clarity. New beginnings.</p>
                  <p className="mt-3 leading-8">A fragrance before a brave decision. A scent that returns you to a cherished memory. An aroma that honors a new beginning.</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Our promise</p>
                  <p className="display-font mt-2 text-xl text-[var(--foreground)] sm:text-2xl">Purpose and beauty in motion.</p>
                  <p className="mt-3 leading-8">Purpose becomes art, and growth becomes beauty, captured gently and carried daily.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap pt-2 md:pt-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Scent Rituals</p>
            <h2 className="display-font mt-2 text-3xl sm:text-4xl md:text-5xl">Crafted for memory and meaning</h2>
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
