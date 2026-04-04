"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminOrderDetails } from "@/components/admin/AdminOrderDetails";
import { fetchAdminJson } from "@/lib/admin-client";
import { mapOrderRow } from "@/lib/supabase-mappers";
import type { Order } from "@/types/order";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminJson<unknown>(`/api/admin/orders/${params.id}`);
        setOrder(mapOrderRow(data as never));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load the order right now.",
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

  if (!order) {
    return <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-[var(--muted)]">Loading order...</div>;
  }

  return <AdminOrderDetails order={order} />;
}
