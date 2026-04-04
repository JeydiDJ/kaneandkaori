"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ProductForm } from "@/components/admin/ProductForm";
import { fetchAdminJson } from "@/lib/admin-client";
import { mapProductRow } from "@/lib/supabase-mappers";
import type { Product } from "@/types/product";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminJson<unknown>(`/api/admin/products/${params.id}`);
        setProduct(mapProductRow(data as never));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load the product right now.",
        );
      }
    }

    void load();
  }, [params.id]);

  if (error) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-[var(--muted)]">
        {error}
      </div>
    );
  }

  if (!product) {
    return <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-[var(--muted)]">Loading product...</div>;
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Catalog</p>
        <h1 className="display-font mt-3 text-4xl md:text-5xl">Edit product</h1>
      </div>
      <ProductForm product={product} />
    </div>
  );
}

