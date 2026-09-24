export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  stock: number;
}

export interface CartItem {
  productId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotalCents: number;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled" | "refunded";

export interface OrderLine {
  productId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: "bearer";
  expiresAt: string;
  user: User;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
