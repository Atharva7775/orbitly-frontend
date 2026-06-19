import { formatMoney, type Cents } from "@/utils/money";

interface Props {
  cents: Cents;
  currency?: string;
  compareAtCents?: Cents;
}

export function PriceTag({ cents, currency = "USD", compareAtCents }: Props) {
  return (
    <span>
      <strong>{formatMoney(cents, currency)}</strong>
      {compareAtCents && compareAtCents > cents ? (
        <s className="muted" style={{ marginLeft: 8 }}>
          {formatMoney(compareAtCents, currency)}
        </s>
      ) : null}
    </span>
  );
}
