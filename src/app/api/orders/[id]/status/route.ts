import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin-auth";
import { sendOrderStatusEmail } from "@/lib/email";
import { applyInventoryAdjustments } from "@/lib/inventory";
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

async function updateInventoryForOrder(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  order: OrderRow,
  direction: "reserve" | "release",
) {
  return applyInventoryAdjustments(
    supabase,
    order.order_items
      .filter((item) => item.product_id)
      .map((item) => ({
        productId: item.product_id as string,
        quantity: item.quantity,
      })),
    direction,
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { status } = (await request.json()) as { status?: OrderStatus };

    if (!status || !["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    }

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

    let inventoryDirection: "reserve" | "release" | null = null;

    if (shouldReserveInventory(order.status, status)) {
      inventoryDirection = "reserve";
    } else if (shouldReleaseInventory(order.status, status)) {
      inventoryDirection = "release";
    }

    if (inventoryDirection) {
      const inventoryResult = await updateInventoryForOrder(
        supabase,
        order,
        inventoryDirection,
      );

      if (!inventoryResult.ok) {
        return NextResponse.json({ error: inventoryResult.error }, { status: 409 });
      }
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .eq("status", order.status)
      .select(
        "id, customer_name, email, phone, address_line, barangay, city_municipality, province, postal_code, country, payment_method, payment_reference, notes, total_amount, order_items(product_name, quantity, price)",
      )
      .maybeSingle();

    if (updateError) {
      throw new Error(updateError.message);
    }

    if (!updatedOrder) {
      if (inventoryDirection) {
        await updateInventoryForOrder(
          supabase,
          order,
          inventoryDirection === "reserve" ? "release" : "reserve",
        );
      }

      return NextResponse.json(
        {
          error:
            "This order changed while you were updating it. Please refresh and try again.",
        },
        { status: 409 },
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
  } catch (error) {
    console.error("Failed to update order status", error);
    return NextResponse.json(
      { error: "Could not update order status." },
      { status: 500 },
    );
  }
}
