import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/75 bg-white/82 shadow-[0_24px_70px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(0,0,0,0.16)]">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        </div>
      </Link>
      <div className="grid gap-3 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">{product.category}</p>
            <h3 className="mt-2 text-xl font-semibold leading-snug">{product.name}</h3>
          </div>
          <p className="rounded-full bg-[var(--surface)]/65 px-3 py-1 text-sm font-semibold">{formatPrice(product.price)}</p>
        </div>
        <p className="text-sm leading-6 text-[var(--muted)]">{product.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
          {product.notes.map((note, index) => (
            <span key={`${note}-${index}`} className="rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-3 py-1">
              {note}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

