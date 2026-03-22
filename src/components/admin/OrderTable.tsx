"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { formatOrderReference, formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";

export function OrderTable({ orders }: { orders: Order[] }) {
  const [localOrders, setLocalOrders] = useState(orders);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  async function updateStatus(orderId: string, status: Order["status"]) {
    setSavingId(orderId);
    setMessage(null);
    const supabase = getSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token ?? ""}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessage(data.error ?? "Could not update the order status.");
      setSavingId(null);
      return;
    }

    setLocalOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );
    setMessage(`Order ${formatOrderReference(orderId)} marked as ${status}.`);
    setSavingId(null);
  }

  return (
    <div className="grid gap-4">
      {message ? (
        <div className="rounded-2xl border border-white/75 bg-white/88 px-4 py-3 text-sm text-[var(--muted)] shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
          {message}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-[2rem] border border-white/75 bg-white/88 shadow-[0_20px_55px_rgba(0,0,0,0.10)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface)]/78 text-[var(--muted)]">
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
            {localOrders.map((order) => (
              <tr key={order.id} className="border-t border-[var(--border)] align-top hover:bg-white/35">
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
                    <Link href={`/studio/orders/${order.id}`} className="rounded-full border border-[var(--border)] bg-white/75 px-3 py-2 font-medium transition hover:bg-[var(--surface)]/75">View</Link>
                    <Button variant="secondary" className="px-3 py-2" disabled={savingId === order.id} onClick={() => updateStatus(order.id, "Confirmed")}>Confirm</Button>
                    <Button variant="secondary" className="px-3 py-2" disabled={savingId === order.id} onClick={() => updateStatus(order.id, "Shipped")}>Ship</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

