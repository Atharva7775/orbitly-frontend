import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { API_BASE, REQUEST_TIMEOUT_MS } from "./config";
import { toApiError } from "./errors";

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

const MAX_RETRIES = 2;
const RETRYABLE_STATUS = new Set([502, 503, 504]);

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? API_BASE,
  timeout: REQUEST_TIMEOUT_MS,
  // Session cookie is set by POST /api/auth/login on the API origin.
  withCredentials: true,
  headers: { Accept: "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;
    const status = error.response?.status ?? 0;

    // Only idempotent requests are retried; POST /api/orders must never be replayed blindly.
    const idempotent = config?.method === "get" || config?.headers?.get("Idempotency-Key") != null;
    if (config && idempotent && RETRYABLE_STATUS.has(status) && (config._retryCount ?? 0) < MAX_RETRIES) {
      config._retryCount = (config._retryCount ?? 0) + 1;
      await new Promise((r) => setTimeout(r, 250 * 2 ** config._retryCount!));
      return api.request(config);
    }

    return Promise.reject(toApiError(status, error.response?.data));
  },
);
