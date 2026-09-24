# syntax=docker/dockerfile:1.7
FROM node:20.18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:20.18-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ASSET_BASE=https://cdn.orbitly.example
ARG NEXT_PUBLIC_PAYMENTS_ENV=sandbox
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_ASSET_BASE=${NEXT_PUBLIC_ASSET_BASE} \
    NEXT_PUBLIC_PAYMENTS_ENV=${NEXT_PUBLIC_PAYMENTS_ENV} \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20.18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S orbitly && adduser -S orbitly -G orbitly
COPY --from=build --chown=orbitly:orbitly /app/.next/standalone ./
COPY --from=build --chown=orbitly:orbitly /app/.next/static ./.next/static
COPY --from=build --chown=orbitly:orbitly /app/public ./public
USER orbitly
EXPOSE 3000
CMD ["node", "server.js"]
