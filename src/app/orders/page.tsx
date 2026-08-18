"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listOrders } from "@/lib/api/orders";
import { formatMoney } from "@/lib/pricing/money";
import type { Order, Page } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Page<Order> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listOrders()
      .then(setOrders)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p className="muted">Loading…</p>;

  return (
    <>
      <h1>Your orders</h1>
      {orders.items.length === 0 ? <p className="muted">You have not placed any orders yet.</p> : null}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {orders.items.map((o) => (
            <tr key={o.id}>
              <td>
                <Link href={`/orders/${o.id}`}>#{o.id.slice(0, 8)}</Link>
              </td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>{o.status}</td>
              <td style={{ textAlign: "right" }}>{formatMoney(o.totalCents, o.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
