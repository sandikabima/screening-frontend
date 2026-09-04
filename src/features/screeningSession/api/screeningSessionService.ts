import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope } from "@/shared/types/api";
import {
  ScreeningSession,
  SessionFilterParams,
} from "../types/screeningSession.types";

export const screeningSessionService = {
  getSessions: async (
    params?: SessionFilterParams,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<ScreeningSession[]>> => {
    const res = await api.get<BackendResponseEnvelope<ScreeningSession[]>>(
      "/screening-session",
      {
        signal,
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          scheduleId: params?.scheduleId || undefined,
          studentId: params?.studentId || undefined,
          status: params?.status || undefined,
        },
      },
    );
    return res.data;
  },

  getSessionById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<ScreeningSession>> => {
    const res = await api.get<BackendResponseEnvelope<ScreeningSession>>(
      `/screening-session/${id}`,
      { signal },
    );
    return res.data;
  },

  deleteSession: async (id: string): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(
      `/screening-session/${id}`,
    );
    return res.data;
  },
};
