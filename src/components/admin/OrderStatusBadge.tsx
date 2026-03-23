import type { OrderStatus } from "@/types/order";

const styles: Record<OrderStatus, string> = {
  Pending: "border border-[#e2c674] bg-[#f8eed1] text-[#7a5a00]",
  Confirmed: "border border-[#9dd1bc] bg-[#e2f3eb] text-[#175a43]",
  Packed: "border border-[#a8c2dd] bg-[#e7f0f8] text-[#234d72]",
  Shipped: "border border-[#9ec6da] bg-[#e3f0f6] text-[#1f5873]",
  Delivered: "border border-[#a9d59b] bg-[#e5f5df] text-[#275d1d]",
  Cancelled: "border border-[#d9a6a6] bg-[#f8e3e3] text-[#8b3030]",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.02em] ${styles[status]}`}>{status}</span>;
}
