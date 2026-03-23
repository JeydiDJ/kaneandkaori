import { createSupabaseAdminClient } from "@/lib/supabase";
import type {
  AdminAnalytics,
  AdminMetricCard,
  DailySalesPoint,
  InventoryReportItem,
  MonthlySalesPoint,
  StatusBreakdownItem,
  TopProductReportItem,
} from "@/types/admin";
import type { OrderStatus } from "@/types/order";

type AnalyticsOrderItemRow = {
  product_id: string | null;
  product_name: string;
  price: number | string;
  quantity: number;
  line_total?: number | string | null;
};

type AnalyticsOrderRow = {
  id: string;
  status: OrderStatus;
  total_amount: number | string;
  created_at: string;
  order_items?: AnalyticsOrderItemRow[];
};

type AnalyticsProductRow = {
  id: string;
  name: string;
  category: string | null;
  inventory: number;
  price: number | string;
};

type MonthSeriesPoint = MonthlySalesPoint & {
  key: string;
};

const LOW_STOCK_THRESHOLD = 10;
const MONTHS_TO_SHOW = 6;
const FULFILLED_STATUSES: OrderStatus[] = ["Confirmed", "Packed", "Shipped", "Delivered"];

function getMonthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function createMonthSeries() {
  const months: MonthSeriesPoint[] = [];
  const now = new Date();

  for (let offset = MONTHS_TO_SHOW - 1; offset >= 0; offset -= 1) {
    const monthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    months.push({
      key: getMonthKey(monthDate),
      label: monthDate.toLocaleString("en-PH", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }),
      revenue: 0,
      orders: 0,
    });
  }

  return months;
}

function createCurrentMonthSeries() {
  const days: DailySalesPoint[] = [];
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(Date.UTC(year, month, day));
    days.push({
      label: String(day),
      date: date.toISOString(),
      revenue: 0,
      orders: 0,
    });
  }

  return days;
}

function getInventoryStatus(inventory: number): InventoryReportItem["status"] {
  if (inventory <= 0) {
    return "Out of stock";
  }

  if (inventory < LOW_STOCK_THRESHOLD) {
    return "Low stock";
  }

  return "In stock";
}

function formatPercentChange(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) {
      return "No change vs last month";
    }

    return "New activity this month";
  }

  const percent = Math.round(((current - previous) / previous) * 100);
  const prefix = percent > 0 ? "+" : "";
  return `${prefix}${percent}% vs last month`;
}

function buildMetricCards(
  orders: AnalyticsOrderRow[],
  products: AnalyticsProductRow[],
  monthlySales: MonthlySalesPoint[],
): AdminMetricCard[] {
  const currentMonth = monthlySales.at(-1) ?? { revenue: 0, orders: 0, label: "" };
  const previousMonth = monthlySales.at(-2) ?? { revenue: 0, orders: 0, label: "" };
  const revenue = orders.reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0);
  const averageOrderValue = orders.length > 0 ? revenue / orders.length : 0;
  const lowStockCount = products.filter(
    (product) => product.inventory > 0 && product.inventory < LOW_STOCK_THRESHOLD,
  ).length;

  return [
    {
      label: "Total revenue",
      value: revenue,
      changeLabel: formatPercentChange(currentMonth.revenue, previousMonth.revenue),
    },
    {
      label: "Orders placed",
      value: orders.length,
      changeLabel: formatPercentChange(currentMonth.orders, previousMonth.orders),
    },
    {
      label: "Average order value",
      value: averageOrderValue,
      changeLabel: `${currentMonth.orders} orders in ${currentMonth.label || "current month"}`,
    },
    {
      label: "Low-stock products",
      value: lowStockCount,
      changeLabel: `${products.length} active SKUs tracked`,
    },
  ];
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const supabase = createSupabaseAdminClient();
  const [{ data: orderRows, error: ordersError }, { data: productRows, error: productsError }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id, status, total_amount, created_at, order_items(product_id, product_name, price, quantity, line_total)")
        .order("created_at", { ascending: false }),
      supabase
        .from("products")
        .select("id, name, category, inventory, price")
        .eq("is_active", true)
        .order("inventory", { ascending: true }),
    ]);

  if (ordersError) {
    throw new Error(ordersError.message);
  }

  if (productsError) {
    throw new Error(productsError.message);
  }

  const orders = (orderRows ?? []) as AnalyticsOrderRow[];
  const products = (productRows ?? []) as AnalyticsProductRow[];
  const monthlySales = createMonthSeries();
  const currentMonthSales = createCurrentMonthSeries();
  const monthIndexByKey = new Map(monthlySales.map((point, index) => [point.key, index] as const));
  const currentMonthStart = new Date(
    Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1),
  );
  const currentMonthEnd = new Date(
    Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, 1),
  );
  const statusCounts = new Map<string, number>();
  const productTotals = new Map<string, TopProductReportItem>();

  for (const order of orders) {
    const orderTotal = Number(order.total_amount ?? 0);
    const createdAt = new Date(order.created_at);
    const monthKey = getMonthKey(new Date(Date.UTC(createdAt.getUTCFullYear(), createdAt.getUTCMonth(), 1)));
    const monthIndex = monthIndexByKey.get(monthKey);

    if (monthIndex !== undefined) {
      monthlySales[monthIndex] = {
        ...monthlySales[monthIndex],
        revenue: monthlySales[monthIndex].revenue + orderTotal,
        orders: monthlySales[monthIndex].orders + 1,
      };
    }

    if (createdAt >= currentMonthStart && createdAt < currentMonthEnd) {
      const dayIndex = createdAt.getUTCDate() - 1;

      if (currentMonthSales[dayIndex]) {
        currentMonthSales[dayIndex] = {
          ...currentMonthSales[dayIndex],
          revenue: currentMonthSales[dayIndex].revenue + orderTotal,
          orders: currentMonthSales[dayIndex].orders + 1,
        };
      }
    }

    statusCounts.set(order.status, (statusCounts.get(order.status) ?? 0) + 1);

    if (!FULFILLED_STATUSES.includes(order.status)) {
      continue;
    }

    for (const item of order.order_items ?? []) {
      const key = item.product_id ?? item.product_name;
      const revenue = Number(item.line_total ?? 0) || Number(item.price ?? 0) * item.quantity;
      const existing = productTotals.get(key);

      if (existing) {
        existing.unitsSold += item.quantity;
        existing.revenue += revenue;
        continue;
      }

      productTotals.set(key, {
        productId: item.product_id ?? "",
        name: item.product_name,
        unitsSold: item.quantity,
        revenue,
      });
    }
  }

  const statusBreakdown: StatusBreakdownItem[] = Array.from(statusCounts.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((left, right) => right.count - left.count);

  const inventoryReport: InventoryReportItem[] = products
    .map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category ?? "Uncategorized",
      inventory: product.inventory,
      price: Number(product.price ?? 0),
      status: getInventoryStatus(product.inventory),
    }))
    .sort((left, right) => left.inventory - right.inventory || left.name.localeCompare(right.name));

  return {
    generatedAt: new Date().toISOString(),
    cards: buildMetricCards(orders, products, monthlySales),
    monthlySales: monthlySales.map((point) => ({
      label: point.label,
      revenue: point.revenue,
      orders: point.orders,
    })),
    currentMonthSales,
    statusBreakdown,
    topProducts: Array.from(productTotals.values())
      .sort((left, right) => right.unitsSold - left.unitsSold || right.revenue - left.revenue)
      .slice(0, 5),
    inventory: {
      totalSkus: inventoryReport.length,
      totalUnits: inventoryReport.reduce((sum, product) => sum + product.inventory, 0),
      lowStockCount: inventoryReport.filter((product) => product.status === "Low stock").length,
      outOfStockCount: inventoryReport.filter((product) => product.status === "Out of stock").length,
      report: inventoryReport,
    },
  };
}
