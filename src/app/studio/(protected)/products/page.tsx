"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchAdminJson } from "@/lib/admin-client";
import { mapProductRow } from "@/lib/supabase-mappers";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminJson<unknown[]>("/api/admin/products");
        setProducts((data ?? []).map((row) => mapProductRow(row as never)));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load products right now.",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-[var(--muted)]">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-[var(--muted)]">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Catalog</p>
          <h1 className="display-font mt-3 text-3xl md:text-5xl">Manage products</h1>
        </div>
        <Link href="/studio/products/create" className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)] shadow-[0_12px_26px_rgba(0,0,0,0.28)] transition hover:brightness-95">Add product</Link>
      </div>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="grid gap-4 rounded-[2rem] border border-white/75 bg-white/88 p-4 shadow-[0_16px_45px_rgba(0,0,0,0.08)] sm:p-5 md:grid-cols-[100px_1fr_auto] md:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] md:aspect-square">
              <Image src={product.image || "/next.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-xl font-semibold leading-snug">{product.name}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{product.category} - {formatPrice(product.price)} - Stock {product.inventory}</p>
            </div>
            <Link href={`/studio/products/edit/${product.id}`} className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-3 text-center text-sm font-semibold transition hover:bg-[var(--surface)]/75 md:justify-self-end">Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}


