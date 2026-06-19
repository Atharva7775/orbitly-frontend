import { api } from "./axiosClient";
import type { Cart } from "@/lib/types";

export async function getCart(): Promise<Cart> {
  const { data } = await api.get<Cart>("/api/cart");
  return data;
}

export async function addToCart(productId: string, quantity = 1): Promise<Cart> {
  const { data } = await api.post<Cart>("/api/cart/items", { productId, quantity });
  return data;
}

export async function updateCartItem(productId: string, quantity: number): Promise<Cart> {
  const { data } = await api.patch<Cart>(`/api/cart/items/${productId}`, { quantity });
  return data;
}

export async function removeCartItem(productId: string): Promise<Cart> {
  const { data } = await api.delete<Cart>(`/api/cart/items/${productId}`);
  return data;
}
