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

function shouldShowDayLabel(index: number, total: number) {
  return index === 0 || index === total - 1 || (index + 1) % 5 === 0;
}

export function ReportsPanel() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [chartRange, setChartRange] = useState<"six-months" | "this-month">("six-months");
  const [isChartExpanded, setIsChartExpanded] = useState(false);

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

  const reportData = analytics;
  const activeSeries =
    chartRange === "this-month" ? reportData.currentMonthSales : reportData.monthlySales;
  const maxRevenue = Math.max(...activeSeries.map((entry) => entry.revenue), 1);
  const maxUnits = Math.max(...reportData.topProducts.map((entry) => entry.unitsSold), 1);
  const chartPoints = activeSeries.map((point, index) => {
    const x = activeSeries.length === 1 ? 50 : (index / (activeSeries.length - 1)) * 100;
    const y = 100 - (point.revenue / maxRevenue) * 100;
    return `${x},${Number.isFinite(y) ? y : 100}`;
  });
  const currentMonthRevenue = reportData.currentMonthSales.reduce((sum, point) => sum + point.revenue, 0);
  const currentMonthOrders = reportData.currentMonthSales.reduce((sum, point) => sum + point.orders, 0);
  const bestDay = [...reportData.currentMonthSales].sort(
    (left, right) => right.revenue - left.revenue || right.orders - left.orders,
  )[0];

  function downloadFile(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportSalesCsv() {
    const rows = [
      [chartRange === "this-month" ? "Day" : "Month", "Revenue", "Orders"],
      ...activeSeries.map((point) => [point.label, String(point.revenue), String(point.orders)]),
    ];

    downloadFile(
      chartRange === "this-month" ? "sales-report-this-month.csv" : "sales-report-6-months.csv",
      rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n"),
      "text/csv;charset=utf-8;",
    );
  }

  function exportInventoryCsv() {
    const rows = [
      ["Product", "Category", "Price", "Stock", "Status"],
      ...reportData.inventory.report.map((product) => [
        product.name,
        product.category,
        String(product.price),
        String(product.inventory),
        product.status,
      ]),
    ];

    downloadFile(
      "inventory-report.csv",
      rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n"),
      "text/csv;charset=utf-8;",
    );
  }

  function exportSummaryJson() {
    downloadFile("admin-analytics.json", JSON.stringify(reportData, null, 2), "application/json;charset=utf-8;");
  }

  function renderChart(expanded = false) {
    return chartType === "bar" ? (
      <div className={`overflow-x-auto pb-2 ${expanded ? "mt-4" : "mt-5"}`}>
        <div className={`flex items-end gap-3 sm:gap-4 ${expanded ? "min-w-[960px]" : chartRange === "this-month" ? "min-w-[980px]" : "min-w-[680px]"}`}>
          {activeSeries.map((point, index) => (
            <div key={point.label} className={`flex flex-1 flex-col justify-end ${chartRange === "this-month" ? "min-w-[46px]" : "min-w-[92px]"}`} title={`${point.label}: ${formatPrice(point.revenue)} - ${point.orders} orders`}>
              <div className={`flex items-end rounded-[1.4rem] bg-white/55 p-2 sm:p-3 ${expanded ? "h-[26rem]" : "h-56 sm:h-64"}`}>
                <div
                  className="w-full rounded-[1rem] bg-[linear-gradient(180deg,#000000,#3b3b3b)] shadow-[0_14px_24px_rgba(0,0,0,0.16)]"
                  style={{
                    height: `${Math.max((point.revenue / maxRevenue) * 100, point.revenue > 0 ? 14 : 6)}%`,
                  }}
                />
              </div>
              {chartRange === "this-month" ? (
                <p className={`mt-3 text-center text-xs font-semibold text-[var(--muted)] ${shouldShowDayLabel(index, activeSeries.length) ? "opacity-100" : "opacity-0"}`}>
                  {point.label}
                </p>
              ) : (
                <>
                  <p className="mt-3 text-sm font-semibold">{point.label}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{formatPrice(point.revenue)}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{point.orders} orders</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className={`overflow-x-auto pb-2 ${expanded ? "mt-4" : "mt-5"}`}>
        <div className={`${expanded ? "min-w-[960px]" : chartRange === "this-month" ? "min-w-[980px]" : "min-w-[680px]"}`}>
          <div className={`${expanded ? "h-[28rem]" : "h-64"} rounded-[1.6rem] bg-white/55 p-4`}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
              <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(17,17,17,0.14)" strokeWidth="0.65" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(17,17,17,0.08)" strokeWidth="0.45" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(17,17,17,0.08)" strokeWidth="0.45" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(17,17,17,0.08)" strokeWidth="0.45" />
              <polyline
                fill="none"
                stroke="rgba(17,17,17,0.76)"
                strokeWidth="1.25"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={chartPoints.join(" ")}
              />
            </svg>
          </div>
          {chartRange === "this-month" ? (
            <div className="mt-4 flex justify-between gap-2 text-xs font-semibold text-[var(--muted)]">
              {activeSeries.map((point, index) =>
                shouldShowDayLabel(index, activeSeries.length) ? (
                  <span key={point.label}>{point.label}</span>
                ) : null,
              )}
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-6 gap-3 sm:gap-4">
              {activeSeries.map((point) => (
                <div key={point.label} className="min-w-0">
                  <p className="text-sm font-semibold">{point.label}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{formatPrice(point.revenue)}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{point.orders} orders</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2 sm:flex sm:flex-wrap">
        <button
          type="button"
          className="w-full rounded-full border border-black/10 bg-white/86 px-4 py-2 text-sm font-semibold shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition hover:bg-black hover:text-white sm:w-auto"
          onClick={exportSalesCsv}
        >
          Download sales CSV
        </button>
        <button
          type="button"
          className="w-full rounded-full border border-black/10 bg-white/86 px-4 py-2 text-sm font-semibold shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition hover:bg-black hover:text-white sm:w-auto"
          onClick={exportInventoryCsv}
        >
          Download inventory CSV
        </button>
        <button
          type="button"
          className="w-full rounded-full border border-black/10 bg-white/86 px-4 py-2 text-sm font-semibold shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition hover:bg-black hover:text-white sm:w-auto"
          onClick={exportSummaryJson}
        >
          Download summary JSON
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {reportData.cards.map((card) => (
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
        <div className="min-w-0 rounded-[2rem] border border-white/75 bg-white/92 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.10)] sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Sales report</p>
              <h2 className="mt-2 text-2xl font-semibold">
                {chartRange === "this-month" ? "This month performance" : "Revenue trend"}
              </h2>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--surface-strong)]/65 px-4 py-3 text-right">
              <p className="text-2xl font-semibold">{activeSeries.length}</p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(243,237,225,0.92))] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="grid gap-2 sm:flex sm:flex-wrap">
                <div className="grid grid-cols-2 rounded-full border border-black/10 bg-white/80 p-1 sm:inline-flex">
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 text-sm font-medium ${chartRange === "six-months" ? "bg-black text-white" : "text-[var(--muted)]"}`}
                    onClick={() => setChartRange("six-months")}
                  >
                    6 months
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 text-sm font-medium ${chartRange === "this-month" ? "bg-black text-white" : "text-[var(--muted)]"}`}
                    onClick={() => setChartRange("this-month")}
                  >
                    This month
                  </button>
                </div>
                <div className="grid grid-cols-2 rounded-full border border-black/10 bg-white/80 p-1 sm:inline-flex">
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
              <button
                type="button"
                className="w-full rounded-full border border-black/10 bg-white/86 px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white sm:w-auto"
                onClick={() => setIsChartExpanded(true)}
              >
                Expand
              </button>
            </div>
            {renderChart()}
            {chartRange === "this-month" ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.3rem] bg-white/65 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Revenue</p>
                  <p className="mt-1 text-lg font-semibold">{formatPrice(currentMonthRevenue)}</p>
                </div>
                <div className="rounded-[1.3rem] bg-white/65 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Orders</p>
                  <p className="mt-1 text-lg font-semibold">{currentMonthOrders}</p>
                </div>
                <div className="rounded-[1.3rem] bg-white/65 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Best day</p>
                  <p className="mt-1 text-lg font-semibold">
                    {bestDay ? `${bestDay.label} - ${formatPrice(bestDay.revenue)}` : "No sales"}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 rounded-[2rem] border border-white/75 bg-white/92 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.10)] sm:p-6">
          <h2 className="mt-2 text-2xl font-semibold">Top-performing fragrances</h2>
          <div className="mt-5 grid gap-4">
            {reportData.topProducts.length > 0 ? (
              reportData.topProducts.map((product) => (
                <div
                  key={`${product.productId}-${product.name}`}
                  className="rounded-[1.5rem] border border-white/70 bg-[var(--surface-strong)]/55 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{product.name}</p>
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
            <h2 className="mt-2 text-2xl font-semibold">Current stock levels</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-[var(--muted)]">
            <span className="rounded-full bg-[var(--surface-strong)]/70 px-3 py-2">{reportData.inventory.totalSkus} SKUs</span>
            <span className="rounded-full bg-[var(--surface-strong)]/70 px-3 py-2">{reportData.inventory.totalUnits} units on hand</span>
            <span className="rounded-full bg-[var(--surface-strong)]/70 px-3 py-2">{reportData.inventory.lowStockCount} low stock</span>
            <span className="rounded-full bg-[var(--surface-strong)]/70 px-3 py-2">{reportData.inventory.outOfStockCount} out of stock</span>
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
              {reportData.inventory.report.map((product) => (
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
      {isChartExpanded ? (
        <div className="fixed inset-0 z-50 bg-black/45 p-4 backdrop-blur-sm sm:p-8">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col rounded-[2rem] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,237,225,0.94))] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Expanded chart</p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {chartRange === "this-month" ? "This month performance" : "Revenue trend"}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex rounded-full border border-black/10 bg-white/90 p-1">
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 text-sm font-medium ${chartRange === "six-months" ? "bg-black text-white" : "text-[var(--muted)]"}`}
                    onClick={() => setChartRange("six-months")}
                  >
                    6 months
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 text-sm font-medium ${chartRange === "this-month" ? "bg-black text-white" : "text-[var(--muted)]"}`}
                    onClick={() => setChartRange("this-month")}
                  >
                    This month
                  </button>
                </div>
                <div className="inline-flex rounded-full border border-black/10 bg-white/90 p-1">
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
                <button
                  type="button"
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
                  onClick={() => setIsChartExpanded(false)}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="mt-5 min-h-0 flex-1 overflow-hidden rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(243,237,225,0.96))] p-4 sm:p-5">
              {renderChart(true)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
