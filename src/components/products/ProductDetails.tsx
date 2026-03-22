"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";

export function ProductDetails({ product }: { product: Product }) {
  const { addItem, lastAddedName, itemCount } = useCart();

  return (
    <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/75 bg-white/75 shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />
      </div>
      <div className="grid gap-6 rounded-[2.5rem] border border-white/75 bg-white/82 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{product.category}</p>
          <h1 className="display-font mt-3 text-4xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold tracking-[0.01em]">{formatPrice(product.price)}</p>
        </div>
        <p className="leading-8 text-[var(--muted)]">{product.description}</p>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Scent Notes</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.notes.map((note, index) => (
              <span key={`${note}-${index}`} className="rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-2 text-sm">
                {note}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => addItem(product)}>Add to Cart</Button>
          <Link href="/checkout" className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/70 px-5 py-3 text-sm font-semibold transition hover:bg-[var(--surface)]/70">
            Go to Checkout
          </Link>
        </div>
        {lastAddedName === product.name ? (
          <p className="text-sm font-medium text-[var(--accent)]">
            Added to cart. You now have {itemCount} item{itemCount === 1 ? "" : "s"} ready.
          </p>
        ) : null}
        <p className="text-sm text-[var(--muted)]">Stock available: {product.inventory}</p>
      </div>
    </section>
  );
}

