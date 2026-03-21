type OrderEmailRow = {
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
  total_amount: number | string;
  order_items?: Array<{
    product_name: string;
    quantity: number;
    price: number | string;
  }>;
};

export function toOrderEmailData(order: OrderEmailRow) {
  return {
    orderId: order.id,
    customerName: order.customer_name,
    email: order.email ?? "",
    phone: order.phone,
    address: order.address_line,
    barangay: order.barangay ?? "",
    city: order.city_municipality,
    province: order.province,
    postalCode: order.postal_code ?? "",
    country: order.country,
    paymentMethod: order.payment_method,
    paymentReference: order.payment_reference ?? "",
    notes: order.notes ?? "",
    total: Number(order.total_amount),
    items: (order.order_items ?? []).map((item) => ({
      name: item.product_name,
      quantity: item.quantity,
      price: Number(item.price),
    })),
  };
}
