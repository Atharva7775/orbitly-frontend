import { apiFetch } from "./http";
import { LOGIN_TIMEOUT_MS } from "./config";
import { setToken, clearToken } from "@/lib/session/tokenStore";
import type { LoginResponse, User } from "@/lib/types";

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupInput extends Credentials {
  fullName: string;
}

export async function login(credentials: Credentials): Promise<User> {
  const res = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: credentials,
    timeoutMs: LOGIN_TIMEOUT_MS,
  });
  setToken(res.accessToken, res.expiresAt);
  return res.user;
}

export async function signup(input: SignupInput): Promise<User> {
  const res = await apiFetch<LoginResponse>("/api/auth/signup", {
    method: "POST",
    body: input,
    timeoutMs: LOGIN_TIMEOUT_MS,
  });
  setToken(res.accessToken, res.expiresAt);
  return res.user;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<void>("/api/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}
