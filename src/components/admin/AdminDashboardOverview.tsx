"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import type { AdminAnalytics } from "@/types/admin";

function formatMetricValue(label: string, value: number) {
  if (label.toLowerCase().includes("revenue") || label.toLowerCase().includes("order value")) {
    return formatPrice(value);
  }

  return new Intl.NumberFormat("en-PH").format(Math.round(value));
}

export function AdminDashboardOverview() {
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
        setError("Could not load admin analytics right now.");
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
        Building dashboard metrics...
      </div>
    );
  }

  const bestMonthRevenue = Math.max(...analytics.monthlySales.map((month) => month.revenue), 1);
  const chartPoints = analytics.monthlySales.map((month, index) => {
    const x = analytics.monthlySales.length === 1 ? 50 : (index / (analytics.monthlySales.length - 1)) * 100;
    const y = 100 - (month.revenue / bestMonthRevenue) * 100;
    return `${x},${Number.isFinite(y) ? y : 100}`;
  });

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {analytics.cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[2rem] border border-white/75 bg-white/88 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.10)] sm:p-6"
          >
            <p className="text-sm text-[var(--muted)]">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold sm:text-4xl">{formatMetricValue(card.label, card.value)}</p>
            <p className="mt-3 text-sm text-[var(--muted)]">{card.changeLabel}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.9fr)]">
        <div className="rounded-[2rem] border border-white/75 bg-white/88 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.10)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Sales report</p>
              <h2 className="mt-2 text-2xl font-semibold">Monthly revenue and order flow</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
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
              <Link
                href="/studio/reports"
                className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-medium"
              >
                Open reports
              </Link>
            </div>
          </div>
          <div className="mt-6 rounded-[1.8rem] border border-white/70 bg-[var(--surface-strong)]/45 p-4 sm:p-5">
            {chartType === "bar" ? (
              <div className="overflow-x-auto pb-2">
                <div className="flex min-w-[620px] items-end gap-3 sm:gap-4">
                  {analytics.monthlySales.map((month) => (
                    <div key={month.label} className="flex min-w-[84px] flex-1 flex-col justify-end">
                      <div className="flex h-44 items-end rounded-[1.25rem] bg-white/55 p-2 sm:h-48 sm:p-3">
                        <div
                          className="w-full rounded-[0.9rem] bg-black/90"
                          style={{
                            height: `${Math.max((month.revenue / bestMonthRevenue) * 100, month.revenue > 0 ? 12 : 4)}%`,
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
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[620px]">
                  <div className="h-48 rounded-[1.35rem] bg-white/55 p-4">
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-1">
          <div className="rounded-[2rem] border border-white/75 bg-white/88 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.10)] sm:p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Order monitoring</p>
            <h2 className="mt-2 text-2xl font-semibold">Status mix</h2>
            <div className="mt-5 grid gap-3">
              {analytics.statusBreakdown.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between rounded-2xl bg-[var(--surface-strong)]/55 px-4 py-3"
                >
                  <span className="font-medium">{item.status}</span>
                  <span className="text-[var(--muted)]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/75 bg-white/88 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.10)] sm:p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Inventory watch</p>
            <h2 className="mt-2 text-2xl font-semibold">Items needing attention</h2>
            <div className="mt-5 grid gap-3">
              {analytics.inventory.report.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-2xl bg-[var(--surface-strong)]/55 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-[var(--muted)]">{product.status}</p>
                  </div>
                  <p className="text-sm font-semibold">{product.inventory} left</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
