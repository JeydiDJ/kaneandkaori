"use client";

import Link from "next/link";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const { items } = useCart();

  return (
    <section className="section-wrap">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Cart</p>
        <h1 className="display-font mt-3 text-5xl">Review the order before checkout</h1>
      </div>
      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-white/70 p-10 text-center">
          <p className="text-lg text-[var(--muted)]">The cart is empty right now.</p>
          <Link href="/products" className="mt-4 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)]">Browse products</Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-5">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>
          <CartSummary />
        </div>
      )}
    </section>
  );
}
