import type { Cents } from "./money";

export interface Promo {
  code: string;
  /** Percentage off in basis points, e.g. 1500 = 15%. */
  percentBps?: number;
  /** Fixed amount off the subtotal. */
  amountOffCents?: Cents;
  minSubtotalCents?: Cents;
}

/**
 * Client-side mirror of the promo table so the cart can preview a discount.
 * The backend re-validates every code at order time; this list is cosmetic.
 */
export const KNOWN_PROMOS: Record<string, Promo> = {
  ORBIT10: { code: "ORBIT10", percentBps: 1000 },
  LAUNCH15: { code: "LAUNCH15", percentBps: 1500, minSubtotalCents: 5_000 },
  SHIPFREE: { code: "SHIPFREE", amountOffCents: 599, minSubtotalCents: 3_500 },
};

export function findPromo(code: string | undefined): Promo | null {
  if (!code) return null;
  return KNOWN_PROMOS[code.trim().toUpperCase()] ?? null;
}
