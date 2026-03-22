import type { Metadata } from "next";

import { ProductGrid } from "@/components/products/ProductGrid";
import { getProducts } from "@/services/productService";

export const metadata: Metadata = {
  title: "Shop Fragrances | Kane & Kaori",
  description: "Explore the complete Kane & Kaori fragrance collection and discover scents crafted for meaning and memory.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="section-wrap">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Shop</p>
        <h1 className="display-font mt-3 text-5xl md:text-6xl">Discover the full fragrance collection</h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">Explore scents shaped by intention, memory, and everyday moments of quiet beauty.</p>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
