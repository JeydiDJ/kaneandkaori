"use client";

import Image from "next/image";
import { useState } from "react";

import { fetchAdminJson } from "@/lib/admin-client";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { formatOrderReference, formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";

const nextActions: Partial<Record<Order["status"], Order["status"][]>> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Packed", "Cancelled"],
  Packed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
};

function ActionIcon({ status }: { status: Order["status"] }) {
  switch (status) {
    case "Confirmed":
      return (
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="m5.5 10 2.5 2.5 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Packed":
      return (
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M4.5 6.25 10 3.5l5.5 2.75L10 9 4.5 6.25Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 6.25V13.75L10 16.5l5.5-2.75V6.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Shipped":
      return (
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M3.5 6.5h8.25v5.25H3.5Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.75 8h2l1.75 2v1.75h-3.75Z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6.5" cy="13.75" r="1.25" />
          <circle cx="13.75" cy="13.75" r="1.25" />
        </svg>
      );
    case "Delivered":
      return (
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="m5.5 10 2.5 2.5 6-6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.75 5.5h2.75v2.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Cancelled":
      return (
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="m6 6 8 8" strokeLinecap="round" />
          <path d="m14 6-8 8" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function getActionLabel(status: Order["status"]) {
  switch (status) {
    case "Confirmed":
      return "Confirm";
    case "Packed":
      return "Pack";
    case "Shipped":
      return "Ship";
    case "Delivered":
      return "Deliver";
    case "Cancelled":
      return "Cancel";
    default:
      return status;
  }
}

function getConfirmationMessage(status: Order["status"]) {
  switch (status) {
    case "Confirmed":
      return "Confirm this order and reserve inventory?";
    case "Packed":
      return "Mark this order as packed?";
    case "Shipped":
      return "Mark this order as shipped and notify the customer?";
    case "Delivered":
      return "Mark this order as delivered?";
    case "Cancelled":
      return "Cancel this order? Inventory will be released if it was already reserved.";
    default:
      return `Update this order to ${status}?`;
  }
}

export function AdminOrderDetails({ order }: { order: Order }) {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function updateStatus(status: Order["status"]) {
    const confirmed = window.confirm(getConfirmationMessage(status));

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      await fetchAdminJson<{ ok: true; status: Order["status"] }>(
        `/api/orders/${currentOrder.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      setCurrentOrder((existing) => ({ ...existing, status }));
      setMessage(`Order ${formatOrderReference(currentOrder.id)} marked as ${status}.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not update the order status.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      {message ? (
        <div className="rounded-2xl border border-white/75 bg-white/88 px-4 py-3 text-sm text-[var(--muted)] shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
          {message}
        </div>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Order detail</p>
          <h1 className="display-font mt-3 text-4xl md:text-5xl">{currentOrder.customerName}</h1>
          <p className="mt-3 text-[var(--muted)]">{currentOrder.email} - {currentOrder.phone}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--accent)]">Reference: {formatOrderReference(currentOrder.id)}</p>
        </div>
        <OrderStatusBadge status={currentOrder.status} />
      </div>
      <div className="grid gap-4 rounded-[2rem] border border-white/75 bg-white/88 p-6 shadow-[0_20px_55px_rgba(0,0,0,0.10)] md:grid-cols-2">
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
      <div className="rounded-[2rem] border border-white/75 bg-white/88 p-6 shadow-[0_20px_55px_rgba(0,0,0,0.10)]">
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
      <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1">
        {(nextActions[currentOrder.status] ?? []).map((status) => (
          <Button
            key={status}
            variant="secondary"
            className="shrink-0 px-3 py-1.5 text-[11px] leading-none font-semibold uppercase tracking-[0.14em] shadow-[0_8px_16px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-black/15 hover:bg-black hover:text-white hover:shadow-[0_14px_24px_rgba(0,0,0,0.12)]"
            disabled={saving}
            onClick={() => updateStatus(status)}
          >
            <ActionIcon status={status} />
            {getActionLabel(status)}
          </Button>
        ))}
      </div>
    </div>
  );
}

