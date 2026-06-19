import { apiFetch } from "./http";
import type { Page, Product } from "@/lib/types";

export interface ProductQuery {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: "price_asc" | "price_desc" | "newest";
}

export function listProducts(query: ProductQuery = {}): Promise<Page<Product>> {
  return apiFetch<Page<Product>>("/api/products", {
    query: { q: query.q, page: query.page, page_size: query.pageSize, sort: query.sort },
  });
}

export function getProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/api/products/${encodeURIComponent(id)}`);
}
