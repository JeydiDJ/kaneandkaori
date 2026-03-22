import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <section className="section-wrap">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Checkout</p>
        <h1 className="display-font mt-3 text-5xl md:text-6xl">Guest checkout with delivery details</h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">Complete your order in a few steps and we will carefully prepare your fragrance for delivery.</p>
      </div>
      <CheckoutForm />
    </section>
  );
}
