import { ProductGrid } from "@/components/products/ProductGrid";
import { getProducts } from "@/services/productService";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="section-wrap">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Shop</p>
        <h1 className="display-font mt-3 text-5xl">Discover the full fragrance collection</h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">Each product page is ready for storytelling, product imagery, scent notes, and direct guest checkout.</p>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
