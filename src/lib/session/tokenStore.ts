/**
 * Holds the bearer token returned by POST /api/auth/login.
 *
 * sessionStorage (not localStorage) so a token does not outlive the tab; the
 * backend also expires it server-side. Access is guarded because these modules
 * are imported by server components during SSR where `window` is undefined.
 */
const TOKEN_KEY = "orbitly.accessToken";
const EXPIRY_KEY = "orbitly.accessTokenExpiresAt";

type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  const s = storage();
  if (!s) return null;
  const token = s.getItem(TOKEN_KEY);
  const expiresAt = s.getItem(EXPIRY_KEY);
  if (token && expiresAt && Date.parse(expiresAt) <= Date.now()) {
    clearToken();
    return null;
  }
  return token;
}

export function setToken(token: string, expiresAt: string): void {
  const s = storage();
  if (!s) return;
  s.setItem(TOKEN_KEY, token);
  s.setItem(EXPIRY_KEY, expiresAt);
  listeners.forEach((fn) => fn(token));
}

export function clearToken(): void {
  const s = storage();
  if (!s) return;
  s.removeItem(TOKEN_KEY);
  s.removeItem(EXPIRY_KEY);
  listeners.forEach((fn) => fn(null));
}

export function onTokenChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
