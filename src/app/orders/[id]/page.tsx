"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OrderSummary } from "@/components/OrderSummary";
import { getOrder } from "@/lib/api/orders";
import { formatMoney } from "@/lib/pricing/money";
import type { Order } from "@/lib/types";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const justPlaced = useSearchParams().get("placed") === "1";
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrder(params.id)
      .then(setOrder)
      .catch((err: Error) => setError(err.message));
  }, [params.id]);

  if (error) return <p className="error">{error}</p>;
  if (!order) return <p className="muted">Loading…</p>;

  return (
    <>
      {justPlaced ? <p className="card">Thanks! Your order has been placed.</p> : null}
      <h1>Order #{order.id.slice(0, 8)}</h1>
      <p className="muted">
        Placed {new Date(order.createdAt).toLocaleString()} · Status: {order.status}
      </p>
      <ul>
        {order.lines.map((l) => (
          <li key={l.productId}>
            {l.quantity} × {l.name} — {formatMoney(l.unitPriceCents * l.quantity, order.currency)}
          </li>
        ))}
      </ul>
      <OrderSummary totals={order} currency={order.currency} />
    </>
  );
}
