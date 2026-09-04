import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope, QueryParams } from "@/shared/types/api";
import {
  CreateSchedulePayload,
  ScheduleListData,
  ScreeningSchedule,
  UpdateSchedulePayload,
} from "../types/screeningSchedule.types";

export const screeningScheduleService = {
  getSchedules: async (
    params?: QueryParams & { statusBarcode?: string },
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<ScheduleListData>> => {
    const res = await api.get<BackendResponseEnvelope<ScheduleListData>>(
      "/screening-schedule",
      {
        signal,
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search || "",
          statusBarcode: params?.statusBarcode,
        },
      },
    );
    return res.data;
  },

  getScheduleById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<ScreeningSchedule>> => {
    const res = await api.get<BackendResponseEnvelope<ScreeningSchedule>>(
      `/screening-schedule/${id}`,
      { signal },
    );
    return res.data;
  },

  createSchedule: async (
    payload: CreateSchedulePayload,
  ): Promise<BackendResponseEnvelope<ScreeningSchedule>> => {
    const res = await api.post<BackendResponseEnvelope<ScreeningSchedule>>(
      "/screening-schedule",
      payload,
    );
    return res.data;
  },

  updateSchedule: async (
    id: string,
    payload: UpdateSchedulePayload,
  ): Promise<BackendResponseEnvelope<ScreeningSchedule>> => {
    const res = await api.put<BackendResponseEnvelope<ScreeningSchedule>>(
      `/screening-schedule/${id}`,
      payload,
    );
    return res.data;
  },

  deleteSchedule: async (
    id: string,
  ): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(
      `/screening-schedule/${id}`,
    );
    return res.data;
  },
};
