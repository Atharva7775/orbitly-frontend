"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PriceTag } from "@/components/PriceTag";
import { SizeGuide } from "@/components/SizeGuide";
import { getProduct } from "@/lib/api/products";
import { addToCart } from "@/lib/api/cart";
import type { Product } from "@/lib/types";

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getProduct(params.id)
      .then(setProduct)
      .catch((err: Error) => setError(err.message));
  }, [params.id]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p className="muted">Loading…</p>;

  return (
    <article style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.imageUrl} alt={product.name} style={{ width: "100%", borderRadius: 12 }} />
      ) : (
        <div className="card" />
      )}
      <div>
        <h1>{product.name}</h1>
        <PriceTag cents={product.priceCents} currency={product.currency} />
        <p>{product.description}</p>
        <p className="muted">SKU {product.sku}</p>
        <SizeGuide slug={product.sku} />
        <label className="field" style={{ maxWidth: 120 }}>
          Quantity
          <input
            type="number"
            min={1}
            max={Math.min(20, product.stock)}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          />
        </label>
        <button
          className="button"
          disabled={product.stock === 0 || adding}
          onClick={async () => {
            setAdding(true);
            try {
              await addToCart(product.id, quantity);
              router.push("/cart");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not add to cart");
            } finally {
              setAdding(false);
            }
          }}
        >
          {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
