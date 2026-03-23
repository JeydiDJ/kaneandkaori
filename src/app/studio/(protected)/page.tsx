import Link from "next/link";

import { AdminDashboardOverview } from "@/components/admin/AdminDashboardOverview";

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Studio dashboard</p>
        <h1 className="display-font mt-3 text-4xl md:text-5xl">Monitor sales, stock, and fulfillment</h1>
      </div>
      <AdminDashboardOverview />
      <div className="grid gap-4 lg:grid-cols-2">
        <Link
          href="/studio/products/create"
          className="group relative overflow-hidden rounded-[2.2rem] border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(243,237,225,0.84))] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.14)] sm:p-7"
        >
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/70 blur-2xl transition group-hover:scale-110" />
          <div className="relative z-10 flex h-full flex-col">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Catalog action</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Add a new fragrance</h2>
            <p className="mt-3 max-w-xl text-[var(--muted)]">
              Create a product listing, set pricing and stock, upload imagery, and publish the next scent to the storefront.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              <span className="rounded-full bg-white/75 px-3 py-2">New listing</span>
              <span className="rounded-full bg-white/75 px-3 py-2">Pricing</span>
              <span className="rounded-full bg-white/75 px-3 py-2">Inventory</span>
            </div>
            <div className="mt-6 inline-flex items-center gap-3 self-start rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(0,0,0,0.18)] transition group-hover:translate-x-1">
              Open product creator
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </Link>
        <Link
          href="/studio/orders"
          className="group relative overflow-hidden rounded-[2.2rem] border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(231,225,214,0.9))] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.14)] sm:p-7"
        >
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-black/6 blur-2xl transition group-hover:scale-110" />
          <div className="relative z-10 flex h-full flex-col">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Fulfillment action</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Review customer orders</h2>
            <p className="mt-3 max-w-xl text-[var(--muted)]">
              Check incoming orders, confirm payment, move shipments through fulfillment, and keep customers updated.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              <span className="rounded-full bg-white/75 px-3 py-2">Pending orders</span>
              <span className="rounded-full bg-white/75 px-3 py-2">Status updates</span>
              <span className="rounded-full bg-white/75 px-3 py-2">Customer tracking</span>
            </div>
            <div className="mt-6 inline-flex items-center gap-3 self-start rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_14px_28px_rgba(0,0,0,0.10)] transition group-hover:translate-x-1">
              Open order queue
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
