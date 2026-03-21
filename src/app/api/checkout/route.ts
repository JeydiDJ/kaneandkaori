import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase";

type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
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
      items: CheckoutItem[];
    };

    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const subtotal = body.items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );

    const supabase = createSupabaseAdminClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: body.customerName,
        email: body.email,
        phone: body.phone,
        address_line: body.address,
        barangay: body.barangay,
        city_municipality: body.city,
        province: body.province,
        postal_code: body.postalCode,
        country: body.country || "Philippines",
        payment_method: body.paymentMethod || "GCash",
        payment_reference: body.paymentReference,
        notes: body.notes,
        subtotal,
        shipping_fee: 0,
        total_amount: subtotal,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: orderError?.message ?? "Could not create order." },
        { status: 500 },
      );
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      body.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId || null,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        line_total: item.price * item.quantity,
      })),
    );

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message, orderId: order.id },
        { status: 500 },
      );
    }

    return NextResponse.json({
      orderId: order.id,
      total: subtotal,
      paymentMethod: body.paymentMethod || "GCash",
      customerName: body.customerName,
    });
  } catch {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }
}
