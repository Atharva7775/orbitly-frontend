"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { OrderSummary } from "@/components/OrderSummary";
import { getCart } from "@/lib/api/cart";
import { createOrder } from "@/lib/api/orders";
import { payOrder, tokenizeCard } from "@/lib/api/payments";
import { findPromo } from "@/utils/discounts";
import { computeTotals } from "@/utils/totals";
import type { Cart } from "@/lib/types";

function CheckoutInner() {
  const router = useRouter();
  const promo = findPromo(useSearchParams().get("promo") ?? undefined);
  const [cart, setCart] = useState<Cart | null>(null);
  const [country, setCountry] = useState("US");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // One key per checkout visit so a double click cannot create two orders.
  const idempotencyKey = useRef(typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now()));

  useEffect(() => {
    getCart()
      .then(setCart)
      .catch((err: Error) => setError(err.message));
  }, []);

  const totals = useMemo(() => computeTotals(cart?.items ?? [], promo, country), [cart, promo, country]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const [expMonth, expYear] = String(form.get("exp")).split("/").map((v) => Number(v.trim()));
      const cardToken = await tokenizeCard({
        number: String(form.get("card")),
        expMonth,
        expYear: expYear < 100 ? 2000 + expYear : expYear,
        cvc: String(form.get("cvc")),
        name: String(form.get("name")),
      });
      const order = await createOrder(
        {
          shippingAddress: {
            line1: String(form.get("line1")),
            line2: String(form.get("line2") ?? "") || undefined,
            city: String(form.get("city")),
            postalCode: String(form.get("postalCode")),
            country,
          },
          promoCode: promo?.code,
        },
        idempotencyKey.current,
      );
      const payment = await payOrder(order.id, cardToken);
      if (payment.status === "declined") {
        setError("Your card was declined. Your order is saved; you can retry payment from Orders.");
        return;
      }
      router.push(`/orders/${order.id}?placed=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!cart) return <p className="muted">{error ?? "Loading…"}</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
      <form onSubmit={handleSubmit} className="card">
        <h1>Checkout</h1>
        <fieldset>
          <legend>Shipping address</legend>
          <label className="field">Address<input name="line1" required autoComplete="address-line1" /></label>
          <label className="field">Apt, suite<input name="line2" autoComplete="address-line2" /></label>
          <label className="field">City<input name="city" required autoComplete="address-level2" /></label>
          <label className="field">Postal code<input name="postalCode" required autoComplete="postal-code" /></label>
          <label className="field">
            Country
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="NL">Netherlands</option>
            </select>
          </label>
        </fieldset>
        <fieldset>
          <legend>Payment</legend>
          <label className="field">Name on card<input name="name" required autoComplete="cc-name" /></label>
          <label className="field">Card number<input name="card" required inputMode="numeric" autoComplete="cc-number" /></label>
          <label className="field">Expiry (MM/YY)<input name="exp" required placeholder="08/29" autoComplete="cc-exp" /></label>
          <label className="field">CVC<input name="cvc" required inputMode="numeric" autoComplete="cc-csc" /></label>
        </fieldset>
        {error ? <p className="error">{error}</p> : null}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>
      <OrderSummary totals={totals} />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}
