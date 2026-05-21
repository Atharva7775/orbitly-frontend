/**
 * Base URL of orbitly-backend. Baked in at build time by Next.js because of the
 * NEXT_PUBLIC_ prefix, so each environment gets its own image build arg.
 */
export const API_BASE: string = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");

export const ASSET_BASE: string = (process.env.NEXT_PUBLIC_ASSET_BASE ?? "https://cdn.orbitly.example").replace(/\/+$/, "");

/** Default client-side timeout for API requests. */
export const REQUEST_TIMEOUT_MS = 5_000;
