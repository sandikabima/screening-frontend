import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope } from "@/shared/types/api";
import { Session, SessionQueryParams } from "../types/session.types";

export const sessionService = {
  getSessions: async (
    params?: SessionQueryParams,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<Session[]>> => {
    const res = await api.get<BackendResponseEnvelope<Session[]>>("/session", {
      signal,
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        status: params?.status || "all",
      },
    });
    return res.data;
  },

  getSessionById: async (
    id: string,
  ): Promise<BackendResponseEnvelope<Session>> => {
    const res = await api.get<BackendResponseEnvelope<Session>>(
      `/session/${id}`,
    );
    return res.data;
  },

  revokeSession: async (id: string): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(
      `/session/${id}`,
    );
    return res.data;
  },

  revokeOtherSessions: async (): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(
      "/session/revoke-others",
    );
    return res.data;
  },
};
