# orbitly-frontend

Storefront for **Orbitly**, built with Next.js 14 (App Router) and TypeScript.

## Running locally

```bash
cp .env.example .env.local
npm ci
npm run dev
```

The app expects `orbitly-backend` on `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`).
For the full stack (Postgres, Redis, backend, worker) use `docker compose up` in `orbitly-cloud`.

## Layout

| Path | Purpose |
| --- | --- |
| `src/app/*` | Route segments: login, signup, catalog, product, cart, checkout, orders, account |
| `src/components` | Presentational components shared across routes |
| `src/lib/api` | API clients: `http.ts` (fetch) and `axiosClient.ts` (axios), one module per backend router |
| `src/lib/pricing` | Integer-cent money helpers and cart totals (mirrors `app/services/pricing.py` in the backend) |
| `src/lib/session` | Bearer token storage |

## Sessions

Since 1.1 the backend issues opaque bearer tokens (`POST /api/auth/login`). The token is kept in
`sessionStorage` and attached as `Authorization: Bearer …` by both API clients. Cookie sessions were
removed; see the backend migration `004_token_sessions.sql`.

## Deploying

`.github/workflows/deploy.yml` builds `ghcr.io/<owner>/orbitly-frontend:<sha>` and rolls the
`orbitly-frontend` deployment defined in `orbitly-cloud/k8s/`.

## Rounding

Percentage discounts are computed on the subtotal and rounded once (half up, in
cents). Never round per line and sum; see `src/lib/pricing/totals.ts`.
