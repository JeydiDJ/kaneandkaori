import type { OrderStatus } from "@/types/order";

const styles: Record<OrderStatus, string> = {
  Pending: "bg-[#f8e8c8] text-[#6b461d]",
  Confirmed: "bg-[#e8f2ea] text-[#2f5b39]",
  Packed: "bg-[#f2ecdf] text-[#5b4c35]",
  Shipped: "bg-[#eceef6] text-[#39456b]",
  Delivered: "bg-[#dff1e6] text-[#2f5b39]",
  Cancelled: "bg-stone-200 text-stone-800",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.02em] ${styles[status]}`}>{status}</span>;
}
