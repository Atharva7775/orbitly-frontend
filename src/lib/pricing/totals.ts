import { applyBps, type Cents } from "./money";
import type { Promo } from "./discounts";
import { tieredUnitPrice } from "./tiered";

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

/** Experimental: list price times quantity, before volume tiers. */
export function lineTotal(line: PricedLine): Cents {
  return line.unitPriceCents * line.quantity;
}

export function tieredLineTotal(line: PricedLine): Cents {
  return tieredUnitPrice(line.unitPriceCents, line.quantity) * line.quantity;
}

export function computeTotals(lines: PricedLine[], promo: Promo | null, country = "US"): Totals {
  const listSubtotal = lines.reduce((sum, l) => sum + lineTotal(l), 0);
  const subtotalCents = lines.reduce((sum, l) => sum + tieredLineTotal(l), 0);
  const tierSavings = listSubtotal - subtotalCents;

  // Promos do not stack with volume tiers; the customer gets the better of the two.
  let promoCents = 0;
  if (promo && listSubtotal >= (promo.minSubtotalCents ?? 0)) {
    if (promo.percentBps) promoCents = applyBps(listSubtotal, promo.percentBps);
    else if (promo.amountOffCents) promoCents = Math.min(promo.amountOffCents, listSubtotal);
  }

  const discountCents = Math.max(tierSavings, promoCents);
  const taxable = listSubtotal - discountCents;
  const taxCents = applyBps(taxable, TAX_RATE_BPS[country] ?? 0);
  return { subtotalCents: listSubtotal, discountCents, taxCents, totalCents: taxable + taxCents };
}
