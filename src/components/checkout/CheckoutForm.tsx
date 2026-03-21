"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useCart } from "@/hooks/useCart";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const supabase = getSupabaseBrowserClient();
    const shippingFee = Number(formData.get("shippingFee") ?? 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalAmount = subtotal + shippingFee;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: String(formData.get("customerName") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        address_line: String(formData.get("address") ?? ""),
        barangay: String(formData.get("barangay") ?? ""),
        city_municipality: String(formData.get("city") ?? ""),
        province: String(formData.get("province") ?? ""),
        postal_code: String(formData.get("postalCode") ?? ""),
        country: String(formData.get("country") ?? "Philippines"),
        payment_method: String(formData.get("paymentMethod") ?? "GCash"),
        payment_reference: String(formData.get("paymentReference") ?? ""),
        notes: String(formData.get("notes") ?? ""),
        subtotal,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      setMessage(orderError?.message ?? "We could not place the order. Please try again.");
      setLoading(false);
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.productId || null,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        line_total: item.price * item.quantity,
      })),
    );

    if (itemsError) {
      setMessage(itemsError.message);
      setLoading(false);
      return;
    }

    clearCart();
    setMessage("Order placed successfully. Your friend can review it in the admin dashboard.");
    event.currentTarget.reset();
    setLoading(false);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-white/70 p-8 text-center text-[var(--muted)]">
        Add a fragrance to the cart before checkout.
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/85 p-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Full name" name="customerName" required />
          <Input label="Email" name="email" type="email" required />
          <Input label="Phone" name="phone" required />
          <Input label="Country" name="country" defaultValue="Philippines" required />
          <Input label="Barangay" name="barangay" />
          <Input label="City" name="city" required />
          <Input label="Province" name="province" required />
          <Input label="Postal code" name="postalCode" required />
          <Input label="Shipping fee" name="shippingFee" type="number" min="0" defaultValue="0" required />
        </div>
        <Input label="Street address" name="address" required />
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Payment method" name="paymentMethod" defaultValue="GCash" required />
          <Input label="Payment reference" name="paymentReference" hint="Optional for GCash or bank transfer" />
        </div>
        <Textarea label="Order notes" name="notes" hint="Optional gifting or delivery notes" />
        <Button type="submit" disabled={loading}>{loading ? "Placing order..." : "Place guest order"}</Button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </form>
      <aside className="rounded-[2rem] border border-white/70 bg-white/80 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Order review</p>
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between gap-4 text-sm">
              <div>
                <p className="font-semibold text-[var(--foreground)]">{item.name}</p>
                <p className="text-[var(--muted)]">Qty {item.quantity}</p>
              </div>
              <p>{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between border-t border-[var(--border)] pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </aside>
    </div>
  );
}
