import "server-only";

import { mapProductRow } from "@/lib/supabase-mappers";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { ProductInput } from "@/types/product";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function getProducts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products", error);
    return [];
  }

  return data.map(mapProductRow);
}

export async function getFeaturedProducts() {
  const products = await getProducts();
  return products.filter((product) => product.featured).slice(0, 3);
}

export async function getProductById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data: slugMatch, error: slugError } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("slug", id)
    .maybeSingle();

  if (slugMatch) {
    return mapProductRow(slugMatch);
  }

  if (slugError || !isUuid(id)) {
    return null;
  }

  const { data: idMatch, error: idError } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("id", id)
    .maybeSingle();

  if (idError || !idMatch) {
    return null;
  }

  return mapProductRow(idMatch);
}

export async function createProduct(input: ProductInput) {
  throw new Error(
    `createProduct is not implemented in productService for "${input.name}". Use the admin product form flow instead.`,
  );
}

export async function updateProduct(id: string, input: ProductInput) {
  void input;
  throw new Error(
    `updateProduct is not implemented in productService for "${id}". Use the admin product form flow instead.`,
  );
}

export async function deleteProduct(id: string) {
  throw new Error(
    `deleteProduct is not implemented in productService for "${id}". Add a dedicated admin delete flow before calling this.`,
  );
}
