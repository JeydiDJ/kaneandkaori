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
      <div className="grid gap-4 lg:grid-cols-3">
        <Link
          href="/studio/blog/create"
          className="group relative overflow-hidden rounded-[2.2rem] border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(250,244,236,0.9))] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.14)] sm:p-7"
        >
          <div className="absolute left-0 top-0 h-28 w-28 rounded-full bg-white/70 blur-2xl transition group-hover:scale-110" />
          <div className="relative z-10 flex h-full flex-col">
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Publish a new article</h2>
            <div className="mt-6 inline-flex items-center gap-3 self-start rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_14px_28px_rgba(0,0,0,0.10)] transition group-hover:translate-x-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M5.75 14.25 14.5 5.5" strokeLinecap="round" />
                  <path d="M7 5.5h7.5V13" strokeLinecap="round" />
                </svg>
              </span>
              Open blog editor
            </div>
          </div>
        </Link>
        <Link
          href="/studio/products/create"
          className="group relative overflow-hidden rounded-[2.2rem] border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(243,237,225,0.84))] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.14)] sm:p-7"
        >
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/70 blur-2xl transition group-hover:scale-110" />
          <div className="relative z-10 flex h-full flex-col">
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Add a new fragrance</h2>
            <div className="mt-6 inline-flex items-center gap-3 self-start rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(0,0,0,0.18)] transition group-hover:translate-x-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/14">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M10 4.25v11.5" strokeLinecap="round" />
                  <path d="M4.25 10h11.5" strokeLinecap="round" />
                </svg>
              </span>
              Open product creator
            </div>
          </div>
        </Link>
        <Link
          href="/studio/orders"
          className="group relative overflow-hidden rounded-[2.2rem] border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(231,225,214,0.9))] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.14)] sm:p-7"
        >
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-black/6 blur-2xl transition group-hover:scale-110" />
          <div className="relative z-10 flex h-full flex-col">
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Review customer orders</h2>
            <div className="mt-6 inline-flex items-center gap-3 self-start rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_14px_28px_rgba(0,0,0,0.10)] transition group-hover:translate-x-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M6 5.75h8" strokeLinecap="round" />
                  <path d="M6 10h8" strokeLinecap="round" />
                  <path d="M6 14.25h5.5" strokeLinecap="round" />
                </svg>
              </span>
              Open order queue
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
