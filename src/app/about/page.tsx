import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Kane & Kaori",
  description: "Learn the story, philosophy, and craft behind Kane & Kaori fragrances.",
};

export default function AboutPage() {
  return (
    <section className="section-wrap">
      <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/70 bg-white/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">About</p>
        <h1 className="display-font text-4xl md:text-5xl">Our Story</h1>
        <p className="leading-8 text-[var(--muted)]">Kane & Kaori is built around purposeful fragrance design. Inspired by Ikigai (生き甲斐) and Kaizen (改善), we create scents that carry memory, intention, and everyday clarity.</p>
        <p className="leading-8 text-[var(--muted)]">Each release is developed with care for composition, quality, and emotional resonance. We believe fragrance is personal and should feel timeless, intimate, and quietly expressive.</p>
      </div>
    </section>
  );
}


