"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function load() {
      const [{ count: products }, { data: orders }] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total_amount"),
      ]);

      const revenue = (orders ?? []).reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0);
      setCounts({ products: products ?? 0, orders: orders?.length ?? 0, revenue });
    }

    void load();
  }, []);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Studio dashboard</p>
        <h1 className="display-font mt-3 text-5xl">Manage catalog and customer orders</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] border border-white/75 bg-white/88 p-6 shadow-[0_20px_55px_rgba(106,73,53,0.1)]">
          <p className="text-sm text-[var(--muted)]">Products</p>
          <p className="mt-2 text-4xl font-semibold">{counts.products}</p>
        </div>
        <div className="rounded-[2rem] border border-white/75 bg-white/88 p-6 shadow-[0_20px_55px_rgba(106,73,53,0.1)]">
          <p className="text-sm text-[var(--muted)]">Orders</p>
          <p className="mt-2 text-4xl font-semibold">{counts.orders}</p>
        </div>
        <div className="rounded-[2rem] border border-white/75 bg-white/88 p-6 shadow-[0_20px_55px_rgba(106,73,53,0.1)]">
          <p className="text-sm text-[var(--muted)]">Order value</p>
          <p className="mt-2 text-4xl font-semibold">${counts.revenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/studio/products/create" className="rounded-[2rem] border border-white/75 bg-white/84 p-6 shadow-[0_16px_45px_rgba(106,73,53,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(106,73,53,0.12)]">
          <p className="text-xl font-semibold">Add a new fragrance</p>
          <p className="mt-2 text-[var(--muted)]">Create listings, upload images, and update featured products.</p>
        </Link>
        <Link href="/studio/orders" className="rounded-[2rem] border border-white/75 bg-white/84 p-6 shadow-[0_16px_45px_rgba(106,73,53,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(106,73,53,0.12)]">
          <p className="text-xl font-semibold">Review customer orders</p>
          <p className="mt-2 text-[var(--muted)]">Track new requests and update fulfillment status.</p>
        </Link>
      </div>
    </div>
  );
}
