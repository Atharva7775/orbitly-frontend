import { api } from "./axiosClient";
import type { Product } from "@/lib/types";

export async function getWishlist(): Promise<Product[]> {
  const { data } = await api.get<{ items: Product[] }>("/api/wishlist");
  return data.items;
}

export async function addToWishlist(productId: string): Promise<void> {
  await api.put(`/api/wishlist/${productId}`);
}

export async function removeFromWishlist(productId: string): Promise<void> {
  await api.delete(`/api/wishlist/${productId}`);
}
