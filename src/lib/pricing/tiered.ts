import type { Cents } from "./money";

/**
 * Volume tiers under evaluation by merchandising: buy more of the same SKU,
 * pay less per unit. Thresholds are inclusive lower bounds on quantity.
 */
export interface Tier {
  minQuantity: number;
  offBps: number;
}

export const DEFAULT_TIERS: Tier[] = [
  { minQuantity: 3, offBps: 500 },
  { minQuantity: 6, offBps: 1000 },
  { minQuantity: 12, offBps: 1500 },
];

export function tierFor(quantity: number, tiers: Tier[] = DEFAULT_TIERS): Tier | null {
  let best: Tier | null = null;
  for (const t of tiers) {
    if (quantity >= t.minQuantity && (!best || t.minQuantity > best.minQuantity)) best = t;
  }
  return best;
}

export function tieredUnitPrice(unitPriceCents: Cents, quantity: number, tiers: Tier[] = DEFAULT_TIERS): Cents {
  const tier = tierFor(quantity, tiers);
  if (!tier) return unitPriceCents;
  return unitPriceCents - Math.round((unitPriceCents * tier.offBps) / 10_000);
}
