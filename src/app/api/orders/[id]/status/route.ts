import { NextResponse } from "next/server";

import { sendShippedOrderEmail } from "@/lib/email";
import { toOrderEmailData } from "@/lib/order-email-data";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { OrderStatus } from "@/types/order";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function isAdminRequest(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    return false;
  }

  const supabase = createSupabaseAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user) {
    return false;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { status } = (await request.json()) as { status: OrderStatus };
  const supabase = createSupabaseAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select(
      "id, customer_name, email, phone, address_line, barangay, city_municipality, province, postal_code, country, payment_method, payment_reference, notes, total_amount, order_items(product_name, quantity, price)",
    )
    .single();

  if (error || !order) {
    return NextResponse.json({ error: error?.message ?? "Order not found." }, { status: 404 });
  }

  if (status === "Shipped") {
    try {
      await sendShippedOrderEmail(toOrderEmailData(order));
    } catch (emailError) {
      console.error("Failed to send shipped order email", emailError);
    }
  }

  return NextResponse.json({ ok: true, status });
}
