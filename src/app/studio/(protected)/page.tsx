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
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Admin dashboard</p>
        <h1 className="display-font mt-3 text-5xl">Manage catalog and orders</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6">
          <p className="text-sm text-[var(--muted)]">Products</p>
          <p className="mt-2 text-4xl font-semibold">{counts.products}</p>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6">
          <p className="text-sm text-[var(--muted)]">Orders</p>
          <p className="mt-2 text-4xl font-semibold">{counts.orders}</p>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6">
          <p className="text-sm text-[var(--muted)]">Order value</p>
          <p className="mt-2 text-4xl font-semibold">${counts.revenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/studio/products/create" className="rounded-[2rem] border border-white/70 bg-white/80 p-6">
          <p className="text-xl font-semibold">Add a new fragrance</p>
          <p className="mt-2 text-[var(--muted)]">Create products, upload images, and control featured inventory.</p>
        </Link>
        <Link href="/studio/orders" className="rounded-[2rem] border border-white/70 bg-white/80 p-6">
          <p className="text-xl font-semibold">Review customer orders</p>
          <p className="mt-2 text-[var(--muted)]">See guest checkout submissions and update their status.</p>
        </Link>
      </div>
    </div>
  );
}
