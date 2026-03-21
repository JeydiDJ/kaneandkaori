"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminOrderDetails } from "@/components/admin/AdminOrderDetails";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { mapOrderRow } from "@/lib/supabase-mappers";
import type { Order } from "@/types/order";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function load() {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", params.id)
        .single();

      if (data) {
        setOrder(mapOrderRow(data));
      }
    }

    void load();
  }, [params.id]);

  if (!order) {
    return <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-[var(--muted)]">Loading order...</div>;
  }

  return <AdminOrderDetails order={order} />;
}
