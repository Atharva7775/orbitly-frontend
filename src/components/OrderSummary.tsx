import { formatMoney } from "@/utils/money";
import type { Totals } from "@/utils/totals";

export function OrderSummary({ totals, currency = "USD" }: { totals: Totals; currency?: string }) {
  const rows: [string, number][] = [
    ["Subtotal", totals.subtotalCents],
    ["Discount", -totals.discountCents],
    ["Estimated tax", totals.taxCents],
  ];
  return (
    <section className="card" aria-label="Order summary">
      <dl style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, margin: 0 }}>
        {rows.map(([label, cents]) => (
          <div key={label} style={{ display: "contents" }}>
            <dt className="muted">{label}</dt>
            <dd style={{ margin: 0 }}>{formatMoney(cents, currency)}</dd>
          </div>
        ))}
        <dt>
          <strong>Total</strong>
        </dt>
        <dd style={{ margin: 0 }}>
          <strong>{formatMoney(totals.totalCents, currency)}</strong>
        </dd>
      </dl>
    </section>
  );
}
