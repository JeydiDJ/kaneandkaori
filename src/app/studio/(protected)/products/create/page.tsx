import { ProductForm } from "@/components/admin/ProductForm";

export default function CreateProductPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Catalog</p>
        <h1 className="display-font mt-3 text-5xl">Create a new fragrance</h1>
      </div>
      <ProductForm />
    </div>
  );
}
