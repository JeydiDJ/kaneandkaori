"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useCart } from "@/hooks/useCart";
import { formatOrderReference, formatPrice } from "@/lib/utils";

type ReceiptState = {
  orderId: string;
  customerName: string;
  paymentMethod: string;
  total: number;
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptState | null>(null);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setReceipt(null);
    const form = event.currentTarget;

    const formData = new FormData(form);
    const paymentMethod = String(formData.get("paymentMethod") ?? "GCash");
    const customerName = String(formData.get("customerName") ?? "");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName,
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        address: String(formData.get("address") ?? ""),
        barangay: String(formData.get("barangay") ?? ""),
        city: String(formData.get("city") ?? ""),
        province: String(formData.get("province") ?? ""),
        postalCode: String(formData.get("postalCode") ?? ""),
        country: String(formData.get("country") ?? "Philippines"),
        paymentMethod,
        paymentReference: String(formData.get("paymentReference") ?? ""),
        notes: String(formData.get("notes") ?? ""),
        items,
      }),
    });

    const data = (await response.json()) as {
      error?: string;
      orderId?: string;
      total?: number;
      paymentMethod?: string;
      customerName?: string;
    };

    if (!response.ok || !data.orderId) {
      setMessage(data.error ?? "We could not place the order. Please try again.");
      setLoading(false);
      return;
    }

    clearCart();
    setReceipt({
      orderId: data.orderId,
      customerName: data.customerName ?? customerName,
      paymentMethod: data.paymentMethod ?? paymentMethod,
      total: data.total ?? total,
    });
    setMessage("Order placed successfully. We have received your request and will begin preparing it.");
    form.reset();
    setLoading(false);
    router.refresh();
  }

  if (receipt) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-5 rounded-[2rem] border border-white/75 bg-white/86 p-8 shadow-[0_20px_60px_rgba(106,73,53,0.1)]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Order receipt</p>
            <h2 className="display-font mt-3 text-4xl">Thank you for your order</h2>
            <p className="mt-3 text-[var(--muted)]">
              Please save your reference number so we can assist you quickly with any follow-up.
            </p>
          </div>
          <div className="grid gap-4 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)]/72 p-5">
            <div className="flex justify-between gap-4">
              <span className="text-[var(--muted)]">Reference</span>
              <span className="font-semibold">{formatOrderReference(receipt.orderId)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--muted)]">Customer</span>
              <span className="font-semibold">{receipt.customerName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--muted)]">Payment method</span>
              <span className="font-semibold">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--muted)]">Amount</span>
              <span className="font-semibold">{formatPrice(receipt.total)}</span>
            </div>
          </div>
          {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
        </section>
        <aside className="rounded-[2rem] border border-white/75 bg-white/84 p-6 shadow-[0_16px_45px_rgba(106,73,53,0.08)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">What happens next</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <p>Your order has been received by our studio team.</p>
            <p>We will confirm, prepare, and arrange delivery with care.</p>
            <p>Use your reference number if you need to ask about the order.</p>
          </div>
        </aside>
      </div>
    );
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
      <form className="grid gap-4 rounded-[2rem] border border-white/75 bg-white/86 p-6 shadow-[0_20px_60px_rgba(106,73,53,0.1)]" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Full name" name="customerName" required />
          <Input label="Email" name="email" type="email" required />
          <Input label="Phone" name="phone" required />
          <Input label="Country" name="country" defaultValue="Philippines" required />
          <Input label="Barangay" name="barangay" />
          <Input label="City" name="city" required />
          <Input label="Province" name="province" required />
          <Input label="Postal code" name="postalCode" required />
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
      <aside className="rounded-[2rem] border border-white/75 bg-white/84 p-6 shadow-[0_16px_45px_rgba(106,73,53,0.08)]">
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
