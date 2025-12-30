export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "RATE_LIMIT"
  | "NETWORK"
  | "TIMEOUT"
  | "UNKNOWN";

export interface ApiErrorPayload {
  message: string;
  code?: string | null;
  details?: unknown;
}

export interface ApiResponseError {
  success: false;
  error: ApiErrorPayload;
}

export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export interface ApiError {
  name: "ApiError";
  message: string;
  status?: number;
  code: ApiErrorCode;
  details?: unknown;
  original?: unknown;
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { name?: unknown }).name === "ApiError"
  );
}
