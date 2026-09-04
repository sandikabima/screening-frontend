import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope, QueryParams } from "@/shared/types/api";
import {
  CreateFacultyPayload,
  Faculty,
  FacultyListData,
} from "../types/faculty.types";

export const facultyService = {
  getFaculties: async (
    params?: QueryParams,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<FacultyListData>> => {
    const res = await api.get<BackendResponseEnvelope<FacultyListData>>(
      "/faculty",
      {
        signal,
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search || "",
        },
      },
    );
    return res.data;
  },

  getFacultyById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<Faculty>> => {
    const res = await api.get<BackendResponseEnvelope<Faculty>>(
      `/faculty/${id}`,
      { signal },
    );
    return res.data;
  },

  createFaculty: async (
    payload: CreateFacultyPayload,
  ): Promise<BackendResponseEnvelope<Faculty>> => {
    const res = await api.post<BackendResponseEnvelope<Faculty>>(
      "/faculty",
      payload,
    );
    return res.data;
  },

  updateFaculty: async (
    id: string,
    payload: CreateFacultyPayload,
  ): Promise<BackendResponseEnvelope<Faculty>> => {
    const res = await api.put<BackendResponseEnvelope<Faculty>>(
      `/faculty/${id}`,
      payload,
    );
    return res.data;
  },

  toggleFacultyStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<BackendResponseEnvelope<Faculty>> => {
    const res = await api.patch<BackendResponseEnvelope<Faculty>>(
      `/faculty/${id}/toggle-status`,
      { isActive },
    );
    return res.data;
  },

  deleteFaculty: async (id: string): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(
      `/faculty/${id}`,
    );
    return res.data;
  },
};
