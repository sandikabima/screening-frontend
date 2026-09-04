import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope, QueryParams } from "@/shared/types/api";
import {
  ClassEntity,
  ClassListData,
  CreateClassPayload,
} from "../types/class.types";

export const classService = {
  getClasses: async (
    params?: QueryParams & { studyProgramId?: string; cohortId?: string },
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<ClassListData>> => {
    const queryParams: Record<string, any> = {
      page: params?.page || 1,
      limit: params?.limit || 10,
      search: params?.search || "",
    };

    if (params?.studyProgramId && params.studyProgramId.trim() !== "") {
      queryParams.studyProgramId = params.studyProgramId;
    }

    if (params?.cohortId && params.cohortId.trim() !== "") {
      queryParams.cohortId = params.cohortId;
    }

    const res = await api.get<BackendResponseEnvelope<ClassListData>>(
      "/class",
      {
        signal,
        params: queryParams,
      },
    );
    return res.data;
  },

  getClassById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<ClassEntity>> => {
    const res = await api.get<BackendResponseEnvelope<ClassEntity>>(
      `/class/${id}`,
      { signal },
    );
    return res.data;
  },

  createClass: async (
    payload: CreateClassPayload,
  ): Promise<BackendResponseEnvelope<ClassEntity>> => {
    const res = await api.post<BackendResponseEnvelope<ClassEntity>>(
      "/class",
      payload,
    );
    return res.data;
  },

  updateClass: async (
    id: string,
    payload: CreateClassPayload,
  ): Promise<BackendResponseEnvelope<ClassEntity>> => {
    const res = await api.put<BackendResponseEnvelope<ClassEntity>>(
      `/class/${id}`,
      payload,
    );
    return res.data;
  },

  toggleClassStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<BackendResponseEnvelope<ClassEntity>> => {
    const res = await api.patch<BackendResponseEnvelope<ClassEntity>>(
      `/class/${id}/toggle-status`,
      { isActive },
    );
    return res.data;
  },

  deleteClass: async (id: string): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(`/class/${id}`);
    return res.data;
  },
};

export default classService;
