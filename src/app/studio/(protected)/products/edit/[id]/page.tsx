"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ProductForm } from "@/components/admin/ProductForm";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { mapProductRow } from "@/lib/supabase-mappers";
import type { Product } from "@/types/product";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function load() {
      const { data } = await supabase.from("products").select("*").eq("id", params.id).single();
      if (data) {
        setProduct(mapProductRow(data));
      }
    }

    void load();
  }, [params.id]);

  if (!product) {
    return <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-[var(--muted)]">Loading product...</div>;
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Catalog</p>
        <h1 className="display-font mt-3 text-5xl">Edit product</h1>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
