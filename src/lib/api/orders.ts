import { api } from "./axiosClient";
import type { Order, Page } from "@/lib/types";

export interface CreateOrderInput {
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  promoCode?: string;
}

/**
 * Places an order from the current cart. The idempotency key lets the backend
 * de-duplicate double submits (and lets the axios client retry on 503).
 */
export async function createOrder(input: CreateOrderInput, idempotencyKey: string): Promise<Order> {
  const { data } = await api.post<Order>("/api/orders", input, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return data;
}

export async function listOrders(page = 1): Promise<Page<Order>> {
  const { data } = await api.get<Page<Order>>("/api/orders", { params: { page } });
  return data;
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await api.get<Order>(`/api/orders/${id}`);
  return data;
}
