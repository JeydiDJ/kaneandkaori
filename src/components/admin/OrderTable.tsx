"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { formatOrderReference, formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";

const statusOptions: Array<Order["status"] | "All"> = [
  "All",
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

type SortOption =
  | "newest"
  | "oldest"
  | "highest-total"
  | "lowest-total"
  | "customer-a-z"
  | "status";

const nextActions: Partial<Record<Order["status"], Order["status"][]>> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Packed", "Cancelled"],
  Packed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
};

function ViewIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M2.25 10s2.9-4.75 7.75-4.75S17.75 10 17.75 10 14.85 14.75 10 14.75 2.25 10 2.25 10Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="2.1" />
    </svg>
  );
}

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

export function OrderTable({ orders }: { orders: Order[] }) {
  const [localOrders, setLocalOrders] = useState(orders);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "All">("All");

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const displayedOrders = useMemo(() => {
    const filtered =
      statusFilter === "All"
        ? [...localOrders]
        : localOrders.filter((order) => order.status === statusFilter);

    return filtered.sort((left, right) => {
      switch (sortBy) {
        case "oldest":
          return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
        case "highest-total":
          return right.total - left.total;
        case "lowest-total":
          return left.total - right.total;
        case "customer-a-z":
          return left.customerName.localeCompare(right.customerName);
        case "status":
          return left.status.localeCompare(right.status) || right.total - left.total;
        case "newest":
        default:
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }
    });
  }, [localOrders, sortBy, statusFilter]);

  async function updateStatus(orderId: string, status: Order["status"]) {
    const confirmed = window.confirm(getConfirmationMessage(status));

    if (!confirmed) {
      return;
    }

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
      <div className="flex flex-col gap-3 rounded-[1.6rem] border border-white/75 bg-white/82 px-4 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Orders</p>
        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
            Sort
            <span className="relative">
              <select
                className="w-full min-w-0 appearance-none rounded-[1.4rem] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(243,237,225,0.85))] px-4 py-2 pr-10 text-sm font-semibold normal-case tracking-normal text-[var(--foreground)] shadow-[0_10px_24px_rgba(0,0,0,0.06)] outline-none transition focus:border-black/20 sm:min-w-[180px]"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="highest-total">Highest amount</option>
                <option value="lowest-total">Lowest amount</option>
                <option value="customer-a-z">Customer A-Z</option>
                <option value="status">Status</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted)]">v</span>
            </span>
          </label>
          <label className="grid gap-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
            Filter
            <span className="relative">
              <select
                className="w-full min-w-0 appearance-none rounded-[1.4rem] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(243,237,225,0.85))] px-4 py-2 pr-10 text-sm font-semibold normal-case tracking-normal text-[var(--foreground)] shadow-[0_10px_24px_rgba(0,0,0,0.06)] outline-none transition focus:border-black/20 sm:min-w-[180px]"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as Order["status"] | "All")}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted)]">v</span>
            </span>
          </label>
        </div>
      </div>
      <div className="overflow-x-auto rounded-[2rem] border border-white/75 bg-white/88 shadow-[0_20px_55px_rgba(0,0,0,0.10)]">
        <table className="min-w-[760px] text-left text-sm">
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
            {displayedOrders.map((order) => (
              <tr key={order.id} className="border-t border-[var(--border)] align-top hover:bg-white/35">
                <td className="px-5 py-4 font-semibold">{formatOrderReference(order.id)}</td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-[var(--foreground)]">{order.customerName}</p>
                  <p className="text-[var(--muted)]">{order.email}</p>
                </td>
                <td className="px-5 py-4">{formatPrice(order.total)}</td>
                <td className="px-5 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-5 py-4 text-[var(--muted)]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <div className="flex max-w-[240px] flex-nowrap gap-1.5 overflow-x-auto pb-1">
                    <Link
                      href={`/studio/orders/${order.id}`}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-[var(--border)] bg-white/78 px-2.5 py-1.5 text-[11px] leading-none font-semibold uppercase tracking-[0.14em] shadow-[0_8px_16px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-black/15 hover:bg-black hover:text-white hover:shadow-[0_14px_24px_rgba(0,0,0,0.12)]"
                    >
                      <ViewIcon />
                      View
                    </Link>
                    {(nextActions[order.status] ?? []).map((status) => (
                      <Button
                        key={status}
                        variant="secondary"
                        className="shrink-0 px-2.5 py-1.5 text-[11px] leading-none font-semibold uppercase tracking-[0.14em] shadow-[0_8px_16px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-black/15 hover:bg-black hover:text-white hover:shadow-[0_14px_24px_rgba(0,0,0,0.12)]"
                        disabled={savingId === order.id}
                        onClick={() => updateStatus(order.id, status)}
                      >
                        <ActionIcon status={status} />
                        {getActionLabel(status)}
                      </Button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {displayedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-[var(--muted)]">
                  No matching orders.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
