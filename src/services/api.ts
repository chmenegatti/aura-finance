import axios, { AxiosError, AxiosHeaders, type AxiosInstance } from "axios";
import { clearAuthStorage, getAuthToken } from "./auth.storage";
import type { ApiError, ApiErrorCode, ApiResponseError } from "@/types/api";

const DEFAULT_TIMEOUT_MS = 30_000;

function getBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  return envUrl ?? "";
}

function toApiErrorCode(status?: number, axiosCode?: string): ApiErrorCode {
  if (axiosCode === "ECONNABORTED") return "TIMEOUT";
  if (!status) return "NETWORK";

  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 422) return "VALIDATION";
  if (status === 429) return "RATE_LIMIT";

  return "UNKNOWN";
}

function normalizeAxiosError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return {
      name: "ApiError",
      message: "Erro inesperado.",
      code: "UNKNOWN",
      original: error,
    };
  }

  const axiosError = error as AxiosError<ApiResponseError | unknown>;
  const status = axiosError.response?.status;
  const payload = axiosError.response?.data as ApiResponseError | undefined;

  const messageFromPayload =
    (payload &&
      typeof payload === "object" &&
      payload.success === false &&
      typeof payload.error?.message === "string" &&
      payload.error.message) ||
    undefined;

  return {
    name: "ApiError",
    message: messageFromPayload || "Não foi possível completar a requisição.",
    status,
    code: toApiErrorCode(status, axiosError.code),
    details: payload && payload.success === false ? payload.error.details : undefined,
    original: error,
  };
}

function handleUnauthorized(): void {
  clearAuthStorage();

  // Evita loop se já estiver na rota de auth
  if (window.location.pathname !== "/auth") {
    window.location.assign("/auth");
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: DEFAULT_TIMEOUT_MS,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeAxiosError(error);

    if (normalized.status === 401) {
      handleUnauthorized();
    }

    return Promise.reject(normalized);
  }
);
