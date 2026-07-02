import { apiFetch } from "./http";
import type { User } from "@/lib/types";

export function getMe(): Promise<User> {
  return apiFetch<User>("/api/users/me");
}

export function updateMe(patch: Partial<Pick<User, "fullName">>): Promise<User> {
  return apiFetch<User>("/api/users/me", { method: "PATCH", body: patch });
}
