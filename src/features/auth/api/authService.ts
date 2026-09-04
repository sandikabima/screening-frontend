import { BackendResponseEnvelope } from "@/shared/types/api";
import { AuthUser, LoginPayload, LoginResponseData } from "../types/auth.types";
import { api } from "@/shared/lib/axios";

export const authService = {
  login: async (
    payload: LoginPayload,
  ): Promise<BackendResponseEnvelope<LoginResponseData>> => {
    const res = await api.post<BackendResponseEnvelope<LoginResponseData>>(
      "/auth/login",
      payload,
    );
    return res.data;
  },

  getProfile: async (
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<AuthUser>> => {
    const res = await api.get<BackendResponseEnvelope<AuthUser>>("/auth/me", {
      signal,
    });
    return res.data;
  },

  logout: async (
    refreshToken: string,
  ): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.post<BackendResponseEnvelope<null>>("/auth/logout", {
      refreshToken,
    });
    return res.data;
  },
};
