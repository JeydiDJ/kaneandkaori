"use client";

import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import type { AdminAnalytics } from "@/types/admin";

function ReportTag({ label }: { label: string }) {
  const tone =
    label === "Out of stock"
      ? "bg-black text-white"
      : label === "Low stock"
        ? "bg-[#d9c2a0] text-black"
        : "bg-[var(--surface-strong)] text-[var(--muted)]";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone}`}>
      {label}
    </span>
  );
}

function formatMetricValue(label: string, value: number) {
  if (label.toLowerCase().includes("revenue") || label.toLowerCase().includes("order value")) {
    return formatPrice(value);
  }

  return new Intl.NumberFormat("en-PH").format(Math.round(value));
}

export function ReportsPanel() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/admin/reports", {
        headers: {
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
      });

      const data = (await response.json()) as AdminAnalytics | { error?: string };

      if (!response.ok) {
        setError((data as { error?: string }).error ?? "Could not load reports.");
        return;
      }

      setAnalytics(data as AdminAnalytics);
    }

    void load();
  }, []);

  if (error) {
    return (
      <div className="rounded-[2rem] border border-white/75 bg-white/88 p-6 text-sm text-[var(--muted)] shadow-[0_20px_55px_rgba(0,0,0,0.10)]">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="rounded-[2rem] border border-white/75 bg-white/88 p-6 text-sm text-[var(--muted)] shadow-[0_20px_55px_rgba(0,0,0,0.10)]">
        Preparing sales and inventory reports...
      </div>
    );
  }

  const maxRevenue = Math.max(...analytics.monthlySales.map((entry) => entry.revenue), 1);
  const maxUnits = Math.max(...analytics.topProducts.map((entry) => entry.unitsSold), 1);
  const chartPoints = analytics.monthlySales.map((month, index) => {
    const x = analytics.monthlySales.length === 1 ? 50 : (index / (analytics.monthlySales.length - 1)) * 100;
    const y = 100 - (month.revenue / maxRevenue) * 100;
    return `${x},${Number.isFinite(y) ? y : 100}`;
  });

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {analytics.cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[2rem] border border-white/75 bg-white/92 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.10)] sm:p-6"
          >
            <p className="text-sm text-[var(--muted)]">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold sm:text-4xl">{formatMetricValue(card.label, card.value)}</p>
            <p className="mt-3 text-sm text-[var(--muted)]">{card.changeLabel}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,0.95fr)]">
        <div className="rounded-[2rem] border border-white/75 bg-white/92 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.10)] sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Sales report</p>
              <h2 className="mt-2 text-2xl font-semibold">Revenue trend</h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
                Recent monthly performance so the admin team can quickly spot stronger and weaker selling periods.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--surface-strong)]/65 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Tracked months</p>
              <p className="mt-1 text-2xl font-semibold">{analytics.monthlySales.length}</p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(243,237,225,0.92))] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[var(--muted)]">Switch the chart style for whichever view is easier to read.</p>
              <div className="inline-flex rounded-full border border-black/10 bg-white/80 p-1">
                <button
                  type="button"
                  className={`rounded-full px-3 py-2 text-sm font-medium ${chartType === "bar" ? "bg-black text-white" : "text-[var(--muted)]"}`}
                  onClick={() => setChartType("bar")}
                >
                  Bar
                </button>
                <button
                  type="button"
                  className={`rounded-full px-3 py-2 text-sm font-medium ${chartType === "line" ? "bg-black text-white" : "text-[var(--muted)]"}`}
                  onClick={() => setChartType("line")}
                >
                  Line
                </button>
              </div>
            </div>
            {chartType === "bar" ? (
              <div className="mt-5 overflow-x-auto pb-2">
                <div className="flex min-w-[680px] items-end gap-3 sm:gap-4">
                  {analytics.monthlySales.map((month) => (
                    <div key={month.label} className="flex min-w-[92px] flex-1 flex-col justify-end">
                      <div className="flex h-56 items-end rounded-[1.4rem] bg-white/55 p-2 sm:h-64 sm:p-3">
                        <div
                          className="w-full rounded-[1rem] bg-[linear-gradient(180deg,#000000,#3b3b3b)] shadow-[0_14px_24px_rgba(0,0,0,0.16)]"
                          style={{
                            height: `${Math.max((month.revenue / maxRevenue) * 100, month.revenue > 0 ? 14 : 6)}%`,
                          }}
                        />
                      </div>
                      <p className="mt-3 text-sm font-semibold">{month.label}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{formatPrice(month.revenue)}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{month.orders} orders</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto pb-2">
                <div className="min-w-[680px]">
                  <div className="h-64 rounded-[1.6rem] bg-white/55 p-4">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                      <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
                      <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(0,0,0,0.1)" strokeWidth="0.6" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(0,0,0,0.1)" strokeWidth="0.6" />
                      <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(0,0,0,0.1)" strokeWidth="0.6" />
                      <polyline
                        fill="none"
                        stroke="#111111"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points={chartPoints.join(" ")}
                      />
                      {chartPoints.map((point) => {
                        const [cx, cy] = point.split(",");
                        return <circle key={point} cx={cx} cy={cy} r="2.2" fill="#111111" />;
                      })}
                    </svg>
                  </div>
                  <div className="mt-4 grid grid-cols-6 gap-3 sm:gap-4">
                    {analytics.monthlySales.map((month) => (
                      <div key={month.label} className="min-w-0">
                        <p className="text-sm font-semibold">{month.label}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{formatPrice(month.revenue)}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{month.orders} orders</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/75 bg-white/92 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.10)] sm:p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Best sellers</p>
          <h2 className="mt-2 text-2xl font-semibold">Top-performing fragrances</h2>
          <div className="mt-5 grid gap-4">
            {analytics.topProducts.length > 0 ? (
              analytics.topProducts.map((product, index) => (
                <div
                  key={`${product.productId}-${product.name}`}
                  className="rounded-[1.5rem] border border-white/70 bg-[var(--surface-strong)]/55 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">#{index + 1} seller</p>
                      <p className="mt-1 font-semibold">{product.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(product.revenue)}</p>
                      <p className="text-sm text-[var(--muted)]">{product.unitsSold} units</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/70">
                    <div
                      className="h-2 rounded-full bg-black"
                      style={{ width: `${Math.max((product.unitsSold / maxUnits) * 100, 12)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Top products will appear here once fulfilled orders come in.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/75 bg-white/92 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.10)] sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Inventory report</p>
            <h2 className="mt-2 text-2xl font-semibold">Current stock levels</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-[var(--muted)]">
            <span className="rounded-full bg-[var(--surface-strong)]/70 px-3 py-2">{analytics.inventory.totalSkus} SKUs</span>
            <span className="rounded-full bg-[var(--surface-strong)]/70 px-3 py-2">{analytics.inventory.totalUnits} units on hand</span>
            <span className="rounded-full bg-[var(--surface-strong)]/70 px-3 py-2">{analytics.inventory.lowStockCount} low stock</span>
            <span className="rounded-full bg-[var(--surface-strong)]/70 px-3 py-2">{analytics.inventory.outOfStockCount} out of stock</span>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[720px] text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">Stock</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.inventory.report.map((product) => (
                <tr key={product.id} className="border-t border-[var(--border)]">
                  <td className="px-3 py-4 font-medium">{product.name}</td>
                  <td className="px-3 py-4 text-[var(--muted)]">{product.category}</td>
                  <td className="px-3 py-4">{formatPrice(product.price)}</td>
                  <td className="px-3 py-4">{product.inventory}</td>
                  <td className="px-3 py-4">
                    <ReportTag label={product.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
