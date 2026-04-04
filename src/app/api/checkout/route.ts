import { NextResponse } from "next/server";

import { sendNewOrderNotification } from "@/lib/email";
import { applyInventoryAdjustments } from "@/lib/inventory";
import { toOrderEmailData } from "@/lib/order-email-data";
import { createSupabaseAdminClient } from "@/lib/supabase";

type CheckoutItem = {
  productId: string;
  quantity: number;
};

type ProductRow = {
  id: string;
  name: string;
  price: number | string;
  inventory: number;
};

const MAX_ITEM_QUANTITY = 20;

function isValidQuantity(quantity: number) {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= MAX_ITEM_QUANTITY;
}

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

    const normalizedItems = body.items
      .map((item) => ({
        productId: String(item.productId ?? "").trim(),
        quantity: Number(item.quantity),
      }))
      .filter((item) => item.productId);

    if (normalizedItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    for (const item of normalizedItems) {
      if (!isValidQuantity(item.quantity)) {
        return NextResponse.json(
          { error: `Each item quantity must be between 1 and ${MAX_ITEM_QUANTITY}.` },
          { status: 400 },
        );
      }
    }

    const supabase = createSupabaseAdminClient();
    const productIds = Array.from(new Set(normalizedItems.map((item) => item.productId)));
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, inventory")
      .in("id", productIds)
      .eq("is_active", true);

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    const productMap = new Map((products as ProductRow[]).map((product) => [product.id, product]));
    const inventoryDemand = new Map<string, number>();

    for (const item of normalizedItems) {
      const product = productMap.get(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: "One or more products are no longer available." },
          { status: 400 },
        );
      }

      inventoryDemand.set(item.productId, (inventoryDemand.get(item.productId) ?? 0) + item.quantity);
    }

    const orderItems = normalizedItems.map((item) => {
      const product = productMap.get(item.productId)!;
      const price = Number(product.price ?? 0);

      return {
        product_id: product.id,
        product_name: product.name,
        price,
        quantity: item.quantity,
        line_total: price * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);
    const inventoryResult = await applyInventoryAdjustments(
      supabase,
      orderItems.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
      })),
      "reserve",
    );

    if (!inventoryResult.ok) {
      return NextResponse.json({ error: inventoryResult.error }, { status: 409 });
    }

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
        status: "Confirmed",
      })
      .select(
        "id, customer_name, email, phone, address_line, barangay, city_municipality, province, postal_code, country, payment_method, payment_reference, notes, total_amount",
      )
      .single();

    if (orderError || !order) {
      await applyInventoryAdjustments(
        supabase,
        orderItems.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
        })),
        "release",
      );

      return NextResponse.json(
        { error: orderError?.message ?? "Could not create order." },
        { status: 500 },
      );
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      orderItems.map((item) => ({
        order_id: order.id,
        ...item,
      })),
    );

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      await applyInventoryAdjustments(
        supabase,
        orderItems.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
        })),
        "release",
      );

      return NextResponse.json(
        { error: "Could not save order items. Please try again." },
        { status: 500 },
      );
    }

    try {
      await sendNewOrderNotification(
        toOrderEmailData({
          ...order,
          order_items: orderItems.map((item) => ({
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      );
    } catch (error) {
      console.error("Failed to send new order notification", error);
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
