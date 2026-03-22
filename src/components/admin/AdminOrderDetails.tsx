"use client";

import Image from "next/image";
import { useState } from "react";

import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { formatOrderReference, formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";

export function AdminOrderDetails({ order }: { order: Order }) {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function updateStatus(status: Order["status"]) {
    setSaving(true);
    setMessage(null);
    const supabase = getSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(`/api/orders/${currentOrder.id}/status`, {
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
      setSaving(false);
      return;
    }

    setCurrentOrder((existing) => ({ ...existing, status }));
    setMessage(`Order ${formatOrderReference(currentOrder.id)} marked as ${status}.`);
    setSaving(false);
  }

  return (
    <div className="grid gap-6">
      {message ? (
        <div className="rounded-2xl border border-white/75 bg-white/88 px-4 py-3 text-sm text-[var(--muted)] shadow-[0_12px_32px_rgba(106,73,53,0.08)]">
          {message}
        </div>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Order detail</p>
          <h1 className="display-font mt-3 text-5xl">{currentOrder.customerName}</h1>
          <p className="mt-3 text-[var(--muted)]">{currentOrder.email} - {currentOrder.phone}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--accent)]">Reference: {formatOrderReference(currentOrder.id)}</p>
        </div>
        <OrderStatusBadge status={currentOrder.status} />
      </div>
      <div className="grid gap-4 rounded-[2rem] border border-white/75 bg-white/88 p-6 shadow-[0_20px_55px_rgba(106,73,53,0.1)] md:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Delivery</p>
          <p className="mt-3 leading-7 text-[var(--foreground)]">{currentOrder.address}<br />{currentOrder.barangay ? `${currentOrder.barangay}, ` : ""}{currentOrder.city}, {currentOrder.province} {currentOrder.postalCode}<br />{currentOrder.country}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Notes</p>
          <p className="mt-3 leading-7 text-[var(--foreground)]">{currentOrder.notes || "No customer notes."}</p>
          <p className="mt-4 text-sm text-[var(--muted)]">Payment: {currentOrder.paymentMethod}{currentOrder.paymentReference ? ` (${currentOrder.paymentReference})` : ""}</p>
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/75 bg-white/88 p-6 shadow-[0_20px_55px_rgba(106,73,53,0.1)]">
        <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Items</p>
        <div className="mt-4 space-y-4">
          {currentOrder.items.map((item) => (
            <div key={`${item.productId}-${item.name}`} className="flex items-center justify-between gap-4 border-b border-[var(--border)]/90 pb-4 last:border-none">
              <div className="flex items-center gap-4">
                {item.image ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface)] text-xs text-[var(--muted)]">No image</div>
                )}
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-[var(--muted)]">Qty {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(currentOrder.total)}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" disabled={saving} onClick={() => updateStatus("Confirmed")}>Confirm</Button>
        <Button variant="secondary" disabled={saving} onClick={() => updateStatus("Packed")}>Pack</Button>
        <Button variant="secondary" disabled={saving} onClick={() => updateStatus("Shipped")}>Ship</Button>
        <Button variant="secondary" disabled={saving} onClick={() => updateStatus("Delivered")}>Deliver</Button>
      </div>
    </div>
  );
}
