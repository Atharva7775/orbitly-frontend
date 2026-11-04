import type { OrderStatus } from "@/lib/types";

const STEPS: OrderStatus[] = ["pending", "paid", "shipped"];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled" || status === "refunded") {
    return <p className="muted">This order was {status}.</p>;
  }
  const current = STEPS.indexOf(status);
  return (
    <ol style={{ display: "flex", gap: 16, listStyle: "none", padding: 0 }} aria-label="Order progress">
      {STEPS.map((step, i) => (
        <li key={step} style={{ opacity: i <= current ? 1 : 0.4 }}>
          {i <= current ? "●" : "○"} {step}
        </li>
      ))}
    </ol>
  );
}
