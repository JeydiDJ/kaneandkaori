"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { formatOrderReference, formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";

export function OrderTable({ orders }: { orders: Order[] }) {
  const [savingId, setSavingId] = useState<string | null>(null);

  async function updateStatus(orderId: string, status: Order["status"]) {
    setSavingId(orderId);
    const supabase = getSupabaseBrowserClient();
    await supabase.from("orders").update({ status }).eq("id", orderId);
    window.location.reload();
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[var(--surface)] text-[var(--muted)]">
          <tr>
            <th className="px-5 py-4">Reference</th>
            <th className="px-5 py-4">Customer</th>
            <th className="px-5 py-4">Total</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Created</th>
            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-[var(--border)] align-top">
              <td className="px-5 py-4 font-semibold">{formatOrderReference(order.id)}</td>
              <td className="px-5 py-4">
                <p className="font-semibold text-[var(--foreground)]">{order.customerName}</p>
                <p className="text-[var(--muted)]">{order.email}</p>
              </td>
              <td className="px-5 py-4">{formatPrice(order.total)}</td>
              <td className="px-5 py-4"><OrderStatusBadge status={order.status} /></td>
              <td className="px-5 py-4 text-[var(--muted)]">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/studio/orders/${order.id}`} className="rounded-full border border-[var(--border)] px-3 py-2">View</Link>
                  <Button variant="secondary" className="px-3 py-2" disabled={savingId === order.id} onClick={() => updateStatus(order.id, "Confirmed")}>Confirm</Button>
                  <Button variant="secondary" className="px-3 py-2" disabled={savingId === order.id} onClick={() => updateStatus(order.id, "Shipped")}>Ship</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
