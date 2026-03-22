import type { OrderStatus } from "@/types/order";

const styles: Record<OrderStatus, string> = {
  Pending: "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)]",
  Confirmed: "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]",
  Packed: "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)]",
  Shipped: "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]",
  Delivered: "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]",
  Cancelled: "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.02em] ${styles[status]}`}>{status}</span>;
}
