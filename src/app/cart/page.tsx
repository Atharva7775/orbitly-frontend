"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CartLineItem } from "@/components/CartLineItem";
import { OrderSummary } from "@/components/OrderSummary";
import { getCart, removeCartItem, updateCartItem } from "@/lib/api/cart";
import { findPromo } from "@/lib/pricing/discounts";
import { computeTotals } from "@/lib/pricing/totals";
import type { Cart } from "@/lib/types";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCart()
      .then(setCart)
      .catch((err: Error) => setError(err.message));
  }, []);

  const promo = findPromo(promoCode);
  const totals = useMemo(() => computeTotals(cart?.items ?? [], promo), [cart, promo]);

  if (error) return <p className="error">{error}</p>;
  if (!cart) return <p className="muted">Loading…</p>;
  if (cart.items.length === 0) {
    return (
      <p>
        Your cart is empty. <Link href="/catalog">Browse the catalog</Link>
      </p>
    );
  }

  return (
    <>
      <h1>Cart</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cart.items.map((item) => (
          <CartLineItem
            key={item.productId}
            item={item}
            onQuantityChange={(id, qty) => updateCartItem(id, qty).then(setCart)}
            onRemove={(id) => removeCartItem(id).then(setCart)}
          />
        ))}
      </ul>
      <label className="field" style={{ maxWidth: 240 }}>
        Promo code
        <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
      </label>
      {promoCode && !promo ? <p className="error">That code is not valid.</p> : null}
      <OrderSummary totals={totals} />
      <Link
        className="button"
        href={promo ? `/checkout?promo=${encodeURIComponent(promo.code)}` : "/checkout"}
        style={{ display: "inline-block", marginTop: 16 }}
      >
        Continue to checkout
      </Link>
    </>
  );
}
