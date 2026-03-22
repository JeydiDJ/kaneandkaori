"use client";

import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

export function CartSummary() {
  const { items } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <aside className="grid gap-5 rounded-[2rem] border border-white/75 bg-white/86 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.10)]">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Summary</p>
        <h2 className="display-font mt-2 text-3xl">Your order</h2>
      </div>
      <div className="space-y-3 text-sm text-[var(--muted)]">
        <div className="flex justify-between"><span>Items</span><span>{items.length}</span></div>
        <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>Calculated manually</span></div>
      </div>
      <div className="flex justify-between border-t border-[var(--border)] pt-4 text-lg font-semibold">
        <span>Total</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <Link href="/checkout" className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)] shadow-[0_12px_26px_rgba(0,0,0,0.28)] transition hover:brightness-95">
        Continue to checkout
      </Link>
    </aside>
  );
}

