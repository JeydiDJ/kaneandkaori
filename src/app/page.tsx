import Link from "next/link";

import { ProductGrid } from "@/components/products/ProductGrid";
import { getFeaturedProducts } from "@/services/productService";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      <section className="section-wrap grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-[var(--muted)]">Perfume startup storefront</p>
          <h1 className="display-font mt-5 text-6xl leading-none md:text-8xl">Scent stories with a warm editorial feel.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
            Kane & Kaori pairs a polished ecommerce storefront with a private admin space where your friend can upload product photos, add fragrances, and manage incoming orders.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products" className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-contrast)]">Shop fragrances</Link>
          </div>
        </div>
        <div className="grid gap-4 rounded-[2.5rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(239,225,209,0.95))] p-6 shadow-[0_24px_80px_rgba(106,73,53,0.12)]">
          <div className="grid gap-3 rounded-[2rem] bg-[rgba(255,255,255,0.7)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Built for launch</p>
            <p className="display-font text-3xl">Guest checkout, catalog management, and order tracking in one Next.js app.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.75rem] bg-white/75 p-5">
              <p className="text-3xl font-semibold">01</p>
              <p className="mt-3 text-sm text-[var(--muted)]">Customers can browse and order without creating an account.</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/75 p-5">
              <p className="text-3xl font-semibold">02</p>
              <p className="mt-3 text-sm text-[var(--muted)]">A protected admin area keeps product edits and uploads private.</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/75 p-5">
              <p className="text-3xl font-semibold">03</p>
              <p className="mt-3 text-sm text-[var(--muted)]">Orders are saved and visible in the dashboard right away.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap pt-0">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Featured fragrances</p>
            <h2 className="display-font mt-2 text-4xl">A soft launch collection</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-[var(--muted)]">View all products</Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
}
