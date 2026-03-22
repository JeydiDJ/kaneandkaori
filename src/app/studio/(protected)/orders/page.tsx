"use client";

import { useEffect, useState } from "react";

import { OrderTable } from "@/components/admin/OrderTable";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { mapOrderRow } from "@/lib/supabase-mappers";
import type { Order } from "@/types/order";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function load() {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      setOrders((data ?? []).map((row) => mapOrderRow(row)));
    }

    void load();
  }, []);

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

