import type { Metadata } from "next";

import { ProductGrid } from "@/components/products/ProductGrid";
import { buildMetadata, getAbsoluteUrl } from "@/lib/seo";
import { getProducts } from "@/services/productService";

export const metadata: Metadata = buildMetadata({
  title: "Shop Fragrances | Kane & Kaori",
  description: "Explore the complete Kane & Kaori fragrance collection and discover scents crafted for meaning and memory.",
  path: "/products",
});

export default async function ProductsPage() {
  const products = await getProducts();
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kane & Kaori fragrance collection",
    url: getAbsoluteUrl("/products"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: getAbsoluteUrl(`/products/${product.slug}`),
        name: product.name,
      })),
    },
  };

  return (
    <section className="section-wrap">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="mb-10 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Shop</p>
        <h1 className="display-font mt-3 text-4xl md:text-6xl">Discover the full fragrance collection</h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">Explore scents shaped by intention, memory, and everyday moments of quiet beauty.</p>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
