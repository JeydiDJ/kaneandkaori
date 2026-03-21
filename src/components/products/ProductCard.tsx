import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(106,73,53,0.09)]">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="grid gap-3 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{product.category}</p>
            <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
          </div>
          <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
        </div>
        <p className="text-sm leading-6 text-[var(--muted)]">{product.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
          {product.notes.map((note, index) => (
            <span key={`${note}-${index}`} className="rounded-full bg-[var(--surface)] px-3 py-1">
              {note}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
