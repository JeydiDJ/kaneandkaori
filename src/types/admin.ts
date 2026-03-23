export type AdminMetricCard = {
  label: string;
  value: number;
  changeLabel: string;
};

export type MonthlySalesPoint = {
  label: string;
  revenue: number;
  orders: number;
};

export type StatusBreakdownItem = {
  status: string;
  count: number;
};

export type TopProductReportItem = {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
};

export type InventoryReportItem = {
  id: string;
  name: string;
  category: string;
  inventory: number;
  price: number;
  status: "In stock" | "Low stock" | "Out of stock";
};

export type AdminAnalytics = {
  generatedAt: string;
  cards: AdminMetricCard[];
  monthlySales: MonthlySalesPoint[];
  statusBreakdown: StatusBreakdownItem[];
  topProducts: TopProductReportItem[];
  inventory: {
    totalSkus: number;
    totalUnits: number;
    lowStockCount: number;
    outOfStockCount: number;
    report: InventoryReportItem[];
  };
};
