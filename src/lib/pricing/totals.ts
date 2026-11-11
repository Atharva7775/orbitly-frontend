import { applyBps, type Cents } from "./money";
import type { Promo } from "./discounts";

export interface PricedLine {
  unitPriceCents: Cents;
  quantity: number;
}

export interface Totals {
  subtotalCents: Cents;
  discountCents: Cents;
  taxCents: Cents;
  totalCents: Cents;
}

/** Estimated VAT/sales tax by country in basis points. The backend is authoritative. */
export const TAX_RATE_BPS: Record<string, number> = {
  US: 0,
  CA: 500,
  GB: 2000,
  DE: 1900,
  FR: 2000,
  NL: 2100,
};

export function lineTotal(line: PricedLine): Cents {
  return line.unitPriceCents * line.quantity;
}

export function computeTotals(lines: PricedLine[], promo: Promo | null, country = "US"): Totals {
  const subtotalCents = lines.reduce((sum, l) => sum + lineTotal(l), 0);

  let discountCents = 0;
  if (promo && subtotalCents >= (promo.minSubtotalCents ?? 0)) {
    if (promo.percentBps) {
      // Round once on the subtotal. Rounding each line and summing drifted by up
      // to 1 cent per line and disagreed with the backend total (support #4127).
      discountCents = applyBps(subtotalCents, promo.percentBps);
    } else if (promo.amountOffCents) {
      discountCents = Math.min(promo.amountOffCents, subtotalCents);
    }
  }

  const taxable = subtotalCents - discountCents;
  const taxCents = applyBps(taxable, TAX_RATE_BPS[country] ?? 0);
  return { subtotalCents, discountCents, taxCents, totalCents: taxable + taxCents };
}
