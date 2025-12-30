import { api } from "./api";
import type { ApiResponseSuccess } from "@/types/api";
import type { AuthData, LoginRequest, RegisterRequest } from "@/types/auth";

export const authService = {
  async login(payload: LoginRequest): Promise<AuthData> {
    const { data } = await api.post<ApiResponseSuccess<AuthData>>("/auth/login", payload);
    return data.data;
  },

  async register(payload: RegisterRequest): Promise<AuthData> {
    const { data } = await api.post<ApiResponseSuccess<AuthData>>("/auth/register", payload);
    return data.data;
  },
};
