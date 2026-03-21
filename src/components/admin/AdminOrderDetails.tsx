"use client";

import Image from "next/image";
import { useState } from "react";

import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { formatOrderReference, formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";

export function AdminOrderDetails({ order }: { order: Order }) {
  const [saving, setSaving] = useState(false);

  async function updateStatus(status: Order["status"]) {
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    await supabase.from("orders").update({ status }).eq("id", order.id);
    window.location.reload();
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Order detail</p>
          <h1 className="display-font mt-3 text-5xl">{order.customerName}</h1>
          <p className="mt-3 text-[var(--muted)]">{order.email} - {order.phone}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--accent)]">Reference: {formatOrderReference(order.id)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/85 p-6 md:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Delivery</p>
          <p className="mt-3 leading-7 text-[var(--foreground)]">{order.address}<br />{order.barangay ? `${order.barangay}, ` : ""}{order.city}, {order.province} {order.postalCode}<br />{order.country}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Notes</p>
          <p className="mt-3 leading-7 text-[var(--foreground)]">{order.notes || "No customer notes."}</p>
          <p className="mt-4 text-sm text-[var(--muted)]">Payment: {order.paymentMethod}{order.paymentReference ? ` (${order.paymentReference})` : ""}</p>
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">Items</p>
        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.name}`} className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4 last:border-none">
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
          <span>{formatPrice(order.total)}</span>
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
