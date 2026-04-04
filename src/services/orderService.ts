import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase";

export async function getOrders() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getOrderById(id: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createOrder() {
  throw new Error("createOrder is not implemented. Use the checkout API route instead.");
}

export async function updateOrderStatus() {
  throw new Error(
    "updateOrderStatus is not implemented here. Use the order status API route instead.",
  );
}
