import { apiFetch } from "./http";
import type { User } from "@/lib/types";

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupInput extends Credentials {
  fullName: string;
}

interface SessionResponse {
  user: User;
}

export async function login(credentials: Credentials): Promise<User> {
  const res = await apiFetch<SessionResponse>("/api/auth/login", { method: "POST", body: credentials });
  return res.user;
}

export async function signup(input: SignupInput): Promise<User> {
  const res = await apiFetch<SessionResponse>("/api/auth/signup", { method: "POST", body: input });
  return res.user;
}

export async function logout(): Promise<void> {
  await apiFetch<void>("/api/auth/logout", { method: "POST" });
}
