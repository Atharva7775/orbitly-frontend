"use client";

import type { CartItem } from "@/lib/types";
import { formatMoney } from "@/lib/pricing/money";
import { lineTotal } from "@/lib/pricing/totals";

interface Props {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartLineItem({ item, onQuantityChange, onRemove }: Props) {
  return (
    <li className="card" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <span style={{ flex: 1 }}>{item.name}</span>
      <input
        aria-label={`Quantity for ${item.name}`}
        type="number"
        min={1}
        max={20}
        value={item.quantity}
        onChange={(e) => onQuantityChange(item.productId, Math.max(1, Number(e.target.value)))}
        style={{ width: 64 }}
      />
      <span>{formatMoney(lineTotal(item))}</span>
      <button type="button" className="button" onClick={() => onRemove(item.productId)}>
        Remove
      </button>
    </li>
  );
}
