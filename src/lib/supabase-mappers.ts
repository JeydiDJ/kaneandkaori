import type { Order, OrderItem, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | string;
  inventory: number;
  featured: boolean;
  category: string | null;
  notes: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

type OrderItemRow = {
  product_id: string | null;
  product_name: string;
  price: number | string;
  quantity: number;
  line_total?: number | string;
};

type OrderRow = {
  id: string;
  customer_name: string;
  email: string | null;
  phone: string;
  address_line: string;
  barangay: string | null;
  city_municipality: string;
  province: string;
  postal_code: string | null;
  country: string;
  payment_method: string;
  payment_reference: string | null;
  notes: string | null;
  status: OrderStatus;
  subtotal: number | string;
  shipping_fee: number | string;
  total_amount: number | string;
  created_at: string;
  order_items?: OrderItemRow[];
};

function parseNotes(value: string | null) {
  return value
    ? value
        .split(",")
        .map((note) => note.trim())
        .filter(Boolean)
    : [];
}

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    price: Number(row.price),
    inventory: row.inventory,
    featured: row.featured,
    notes: parseNotes(row.notes),
    category: row.category ?? "",
    image: row.image_url ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapOrderItemRow(row: OrderItemRow): OrderItem {
  return {
    productId: row.product_id ?? "",
    name: row.product_name,
    price: Number(row.price),
    quantity: row.quantity,
    image: "",
  };
}

export function mapOrderRow(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    email: row.email ?? "",
    phone: row.phone,
    address: row.address_line,
    barangay: row.barangay ?? "",
    city: row.city_municipality,
    province: row.province,
    postalCode: row.postal_code ?? "",
    country: row.country,
    paymentMethod: row.payment_method,
    paymentReference: row.payment_reference ?? "",
    notes: row.notes ?? "",
    items: (row.order_items ?? []).map(mapOrderItemRow),
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shipping_fee),
    total: Number(row.total_amount),
    status: row.status,
    createdAt: row.created_at,
  };
}
