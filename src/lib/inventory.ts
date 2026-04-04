import type { SupabaseClient } from "@supabase/supabase-js";

type InventoryDirection = "reserve" | "release";

type InventoryAdjustment = {
  productId: string;
  quantity: number;
};

type ProductInventoryRow = {
  id: string;
  name: string;
  inventory: number | string | null;
};

const MAX_RETRIES = 3;

function aggregateAdjustments(adjustments: InventoryAdjustment[]) {
  const totals = new Map<string, number>();

  for (const adjustment of adjustments) {
    totals.set(
      adjustment.productId,
      (totals.get(adjustment.productId) ?? 0) + adjustment.quantity,
    );
  }

  return Array.from(totals.entries())
    .map(([productId, quantity]) => ({ productId, quantity }))
    .sort((left, right) => left.productId.localeCompare(right.productId));
}

async function getProductSnapshot(supabase: SupabaseClient, productId: string) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, inventory")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as ProductInventoryRow | null) ?? null;
}

async function updateInventoryWithRetry(
  supabase: SupabaseClient,
  productId: string,
  quantity: number,
  direction: InventoryDirection,
) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const product = await getProductSnapshot(supabase, productId);

    if (!product) {
      return {
        ok: false as const,
        error: "One or more items are no longer available in the catalog.",
      };
    }

    const currentInventory = Number(product.inventory ?? 0);
    const nextInventory =
      direction === "reserve"
        ? currentInventory - quantity
        : currentInventory + quantity;

    if (nextInventory < 0) {
      return {
        ok: false as const,
        error: `Not enough stock for ${product.name}. Only ${currentInventory} left.`,
      };
    }

    const { data, error } = await supabase
      .from("products")
      .update({ inventory: nextInventory })
      .eq("id", productId)
      .eq("inventory", currentInventory)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      return { ok: true as const };
    }
  }

  return {
    ok: false as const,
    error:
      "Inventory changed while we were processing this request. Please refresh and try again.",
  };
}

async function rollbackAdjustments(
  supabase: SupabaseClient,
  applied: InventoryAdjustment[],
  direction: InventoryDirection,
) {
  const reverseDirection = direction === "reserve" ? "release" : "reserve";

  for (const adjustment of [...applied].reverse()) {
    try {
      await updateInventoryWithRetry(
        supabase,
        adjustment.productId,
        adjustment.quantity,
        reverseDirection,
      );
    } catch (error) {
      console.error("Failed to rollback inventory adjustment", error);
    }
  }
}

export async function applyInventoryAdjustments(
  supabase: SupabaseClient,
  adjustments: InventoryAdjustment[],
  direction: InventoryDirection,
) {
  const aggregated = aggregateAdjustments(adjustments);
  const applied: InventoryAdjustment[] = [];

  for (const adjustment of aggregated) {
    const result = await updateInventoryWithRetry(
      supabase,
      adjustment.productId,
      adjustment.quantity,
      direction,
    );

    if (!result.ok) {
      await rollbackAdjustments(supabase, applied, direction);
      return result;
    }

    applied.push(adjustment);
  }

  return { ok: true as const };
}
