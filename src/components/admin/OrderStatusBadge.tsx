import type { OrderStatus } from "@/types/order";

const styles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-900",
  Confirmed: "bg-sky-100 text-sky-900",
  Packed: "bg-violet-100 text-violet-900",
  Shipped: "bg-indigo-100 text-indigo-900",
  Delivered: "bg-emerald-100 text-emerald-900",
  Cancelled: "bg-stone-200 text-stone-800",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}
