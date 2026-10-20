/**
 * All money in Orbitly is integer minor units (cents). Floats are only used at
 * the formatting edge, never for arithmetic, to avoid 0.1 + 0.2 drift.
 */
export type Cents = number;

const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(cents: Cents, currency = "EUR", locale = "en-GB"): string {
  const key = `${locale}:${currency}`;
  let fmt = formatters.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, { style: "currency", currency });
    formatters.set(key, fmt);
  }
  return fmt.format(cents / 100);
}

export function assertCents(value: number): Cents {
  if (!Number.isInteger(value)) {
    throw new RangeError(`Expected integer cents, received ${value}`);
  }
  return value;
}

/** Multiplies by a basis-point rate (1% = 100 bps) using banker's-free half-up rounding. */
export function applyBps(cents: Cents, bps: number): Cents {
  return Math.round((cents * bps) / 10_000);
}
