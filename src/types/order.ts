export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  barangay: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  paymentReference: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type OrderInput = Omit<Order, "id" | "status" | "createdAt">;
