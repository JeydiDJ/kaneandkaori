"use client";

import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/hooks/useCart";
import { useCart } from "@/hooks/useCart";

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <article className="grid gap-4 rounded-[2rem] border border-white/75 bg-white/82 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)] md:grid-cols-[120px_1fr_auto] md:items-center">
      <div className="relative aspect-square w-full overflow-hidden rounded-[1.5rem]">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div>
        <h3 className="display-font text-2xl">{item.name}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{formatPrice(item.price)} each</p>
        <div className="mt-4 flex items-center gap-3">
          <Button variant="secondary" className="px-3 py-2" onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}>-</Button>
          <span className="min-w-8 rounded-full bg-[var(--surface)]/60 px-3 py-1 text-center font-semibold">{item.quantity}</span>
          <Button variant="secondary" className="px-3 py-2" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 md:items-end">
        <p className="text-lg font-semibold">{formatPrice(item.price * item.quantity)}</p>
        <Button variant="ghost" className="px-0 py-0" onClick={() => removeItem(item.productId)}>Remove</Button>
      </div>
    </article>
  );
}

