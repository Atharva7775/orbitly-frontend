"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWishlist()
      .then(setItems)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!items) return <p className="muted">Loading…</p>;

  return (
    <>
      <h1>Wishlist</h1>
      {items.length === 0 ? <p className="muted">Save products here to buy them later.</p> : null}
      <div className="grid">
        {items.map((p) => (
          <div key={p.id}>
            <ProductCard product={p} />
            <button
              className="button"
              onClick={async () => {
                await removeFromWishlist(p.id);
                setItems((list) => (list ?? []).filter((x) => x.id !== p.id));
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
