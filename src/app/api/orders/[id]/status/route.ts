import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin-auth";
import { sendOrderStatusEmail } from "@/lib/email";
import { toOrderEmailData } from "@/lib/order-email-data";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { OrderStatus } from "@/types/order";

type RouteContext = {
  params: Promise<{ id: string }>;
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
  total_amount: number | string;
  order_items: {
    product_id: string | null;
    product_name: string;
    quantity: number;
    price: number | string;
  }[];
};

type ProductInventoryRow = {
  id: string;
  inventory: number;
};

const FULFILLMENT_STATUSES: OrderStatus[] = ["Confirmed", "Packed", "Shipped", "Delivered"];
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Packed", "Cancelled"],
  Packed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

function canTransition(from: OrderStatus, to: OrderStatus) {
  return from === to || TRANSITIONS[from].includes(to);
}

function shouldReserveInventory(previousStatus: OrderStatus, nextStatus: OrderStatus) {
  return !FULFILLMENT_STATUSES.includes(previousStatus) && FULFILLMENT_STATUSES.includes(nextStatus);
}

function shouldReleaseInventory(previousStatus: OrderStatus, nextStatus: OrderStatus) {
  return FULFILLMENT_STATUSES.includes(previousStatus) && nextStatus === "Cancelled";
}

async function updateInventoryForOrder(order: OrderRow, direction: "reserve" | "release") {
  const quantities = new Map<string, number>();

  for (const item of order.order_items) {
    if (!item.product_id) {
      continue;
    }

    quantities.set(item.product_id, (quantities.get(item.product_id) ?? 0) + item.quantity);
  }

  if (quantities.size === 0) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const productIds = Array.from(quantities.keys());
  const { data: products, error } = await supabase
    .from("products")
    .select("id, inventory")
    .in("id", productIds);

  if (error) {
    throw new Error(error.message);
  }

  const productMap = new Map((products as ProductInventoryRow[]).map((product) => [product.id, product]));

  for (const [productId, quantity] of quantities.entries()) {
    const product = productMap.get(productId);

    if (!product) {
      return "One or more items are no longer available in the catalog.";
    }

    const currentInventory = Number(product.inventory ?? 0);
    const nextInventory =
      direction === "reserve" ? currentInventory - quantity : currentInventory + quantity;

    if (nextInventory < 0) {
      const item = order.order_items.find((entry) => entry.product_id === productId);
      return `Not enough stock for ${item?.product_name ?? "an item"}. Only ${currentInventory} left.`;
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({ inventory: nextInventory })
      .eq("id", productId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  return null;
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { status } = (await request.json()) as { status: OrderStatus };
  const supabase = createSupabaseAdminClient();

  const { data: existingOrder, error: fetchError } = await supabase
    .from("orders")
    .select(
      "id, customer_name, email, phone, address_line, barangay, city_municipality, province, postal_code, country, payment_method, payment_reference, notes, status, total_amount, order_items(product_id, product_name, quantity, price)",
    )
    .eq("id", id)
    .single();

  if (fetchError || !existingOrder) {
    return NextResponse.json(
      { error: fetchError?.message ?? "Order not found." },
      { status: 404 },
    );
  }

  const order = existingOrder as OrderRow;

  if (!canTransition(order.status, status)) {
    return NextResponse.json(
      { error: `Cannot move an order from ${order.status} to ${status}.` },
      { status: 400 },
    );
  }

  if (shouldReserveInventory(order.status, status)) {
    const inventoryError = await updateInventoryForOrder(order, "reserve");

    if (inventoryError) {
      return NextResponse.json({ error: inventoryError }, { status: 400 });
    }
  }

  if (shouldReleaseInventory(order.status, status)) {
    const inventoryError = await updateInventoryForOrder(order, "release");

    if (inventoryError) {
      return NextResponse.json({ error: inventoryError }, { status: 400 });
    }
  }

  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select(
      "id, customer_name, email, phone, address_line, barangay, city_municipality, province, postal_code, country, payment_method, payment_reference, notes, total_amount, order_items(product_name, quantity, price)",
    )
    .single();

  if (updateError || !updatedOrder) {
    if (shouldReserveInventory(order.status, status)) {
      await updateInventoryForOrder(order, "release");
    }

    if (shouldReleaseInventory(order.status, status)) {
      await updateInventoryForOrder(order, "reserve");
    }

    return NextResponse.json(
      { error: updateError?.message ?? "Could not update order status." },
      { status: 500 },
    );
  }

  if (["Confirmed", "Packed", "Shipped", "Delivered"].includes(status)) {
    try {
      await sendOrderStatusEmail(toOrderEmailData(updatedOrder), status);
    } catch (emailError) {
      console.error("Failed to send order status email", emailError);
    }
  }

  return NextResponse.json({ ok: true, status });
}
