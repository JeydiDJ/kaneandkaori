"use client";

import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import { mapProductRow } from "@/lib/supabase-mappers";
import type { Product } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      setProducts((data ?? []).map((product) => mapProductRow(product)));
      setLoading(false);
    }

    void loadProducts();
  }, []);

  return { products, loading };
}
