import Link from "next/link";
import type { Product } from "@/lib/types";
import { PriceTag } from "./PriceTag";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="card" style={{ textDecoration: "none", color: "inherit" }}>
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.imageUrl} alt={product.name} style={{ width: "100%", borderRadius: 8 }} />
      ) : null}
      <h3 style={{ margin: "12px 0 4px" }}>{product.name}</h3>
      <PriceTag cents={product.priceCents} currency={product.currency} />
      {product.stock === 0 ? <p className="muted">Out of stock</p> : null}
    </Link>
  );
}
