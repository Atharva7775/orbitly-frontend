"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { listProducts, type ProductQuery } from "@/lib/api/products";
import type { Page, Product } from "@/lib/types";

const PAGE_SIZE = 24;

export default function CatalogPage() {
  const [query, setQuery] = useState<ProductQuery>({ page: 1, pageSize: PAGE_SIZE, sort: "newest" });
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Page<Product> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listProducts(query)
      .then((page) => !cancelled && setData(page))
      .catch((err: Error) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <>
      <h1>Catalog</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery((q) => ({ ...q, q: search, page: 1 }));
        }}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input aria-label="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select
          aria-label="Sort"
          value={query.sort}
          onChange={(e) => setQuery((q) => ({ ...q, sort: e.target.value as ProductQuery["sort"], page: 1 }))}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
        <button className="button" type="submit">
          Search
        </button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      {!data && !error ? <p className="muted">Loading…</p> : null}
      <div className="grid">
        {data?.items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
