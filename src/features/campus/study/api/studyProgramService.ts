import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope, QueryParams } from "@/shared/types/api";
import {
  CreateStudyProgramPayload,
  StudyProgram,
  StudyProgramListData,
} from "../types/studyProgram.types";

export const studyProgramService = {
  getStudyPrograms: async (
    params?: QueryParams & { facultyId?: string },
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<StudyProgramListData>> => {
    // Susun query params dasar
    const queryParams: Record<string, any> = {
      page: params?.page || 1,
      limit: params?.limit || 10,
      search: params?.search || "",
    };

    // Hanya tambahkan facultyId jika benar-benar ada isinya (mencegah error 422 karena string kosong)
    if (params?.facultyId && params.facultyId.trim() !== "") {
      queryParams.facultyId = params.facultyId;
    }

    const res = await api.get<BackendResponseEnvelope<StudyProgramListData>>(
      "/study-program",
      {
        signal,
        params: queryParams,
      },
    );
    return res.data;
  },

  getPublicStudyPrograms: async (
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<StudyProgram[]>> => {
    const res = await api.get<BackendResponseEnvelope<StudyProgram[]>>(
      "/study-program/public",
      { signal },
    );
    return res.data;
  },

  getStudyProgramById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<StudyProgram>> => {
    const res = await api.get<BackendResponseEnvelope<StudyProgram>>(
      `/study-program/${id}`,
      { signal },
    );
    return res.data;
  },

  createStudyProgram: async (
    payload: CreateStudyProgramPayload,
  ): Promise<BackendResponseEnvelope<StudyProgram>> => {
    const res = await api.post<BackendResponseEnvelope<StudyProgram>>(
      "/study-program",
      payload,
    );
    return res.data;
  },

  updateStudyProgram: async (
    id: string,
    payload: CreateStudyProgramPayload,
  ): Promise<BackendResponseEnvelope<StudyProgram>> => {
    const res = await api.put<BackendResponseEnvelope<StudyProgram>>(
      `/study-program/${id}`,
      payload,
    );
    return res.data;
  },

  toggleStudyProgramStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<BackendResponseEnvelope<StudyProgram>> => {
    const res = await api.patch<BackendResponseEnvelope<StudyProgram>>(
      `/study-program/${id}/toggle-status`,
      { isActive },
    );
    return res.data;
  },

  deleteStudyProgram: async (
    id: string,
  ): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(
      `/study-program/${id}`,
    );
    return res.data;
  },
};

export default studyProgramService;
