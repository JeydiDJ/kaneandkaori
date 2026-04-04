"use client";

import { useEffect, useState } from "react";

import { OrderTable } from "@/components/admin/OrderTable";
import { fetchAdminJson } from "@/lib/admin-client";
import { mapOrderRow } from "@/lib/supabase-mappers";
import type { Order } from "@/types/order";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminJson<unknown[]>("/api/admin/orders");
        setOrders((data ?? []).map((row) => mapOrderRow(row as never)));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load customer orders right now.",
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
        Loading orders...
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
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Orders</p>
        <h1 className="display-font mt-3 text-4xl md:text-5xl">Customer orders</h1>
      </div>
      <OrderTable orders={orders} />
    </div>
  );
}

