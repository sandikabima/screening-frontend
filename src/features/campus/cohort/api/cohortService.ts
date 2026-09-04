import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope, QueryParams } from "@/shared/types/api";
import {
  Cohort,
  CohortListData,
  CreateCohortPayload,
} from "../types/cohort.types";

export const cohortService = {
  getCohorts: async (
    params?: QueryParams & { studyProgramId?: string },
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<CohortListData>> => {
    const queryParams: Record<string, any> = {
      page: params?.page || 1,
      limit: params?.limit || 10,
      search: params?.search || "",
    };

    if (params?.studyProgramId && params.studyProgramId.trim() !== "") {
      queryParams.studyProgramId = params.studyProgramId;
    }

    const res = await api.get<BackendResponseEnvelope<CohortListData>>(
      "/cohort",
      {
        signal,
        params: queryParams,
      },
    );
    return res.data;
  },

  getCohortById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<Cohort>> => {
    const res = await api.get<BackendResponseEnvelope<Cohort>>(
      `/cohort/${id}`,
      { signal },
    );
    return res.data;
  },

  createCohort: async (
    payload: CreateCohortPayload,
  ): Promise<BackendResponseEnvelope<Cohort>> => {
    const res = await api.post<BackendResponseEnvelope<Cohort>>(
      "/cohort",
      payload,
    );
    return res.data;
  },

  updateCohort: async (
    id: string,
    payload: CreateCohortPayload,
  ): Promise<BackendResponseEnvelope<Cohort>> => {
    const res = await api.put<BackendResponseEnvelope<Cohort>>(
      `/cohort/${id}`,
      payload,
    );
    return res.data;
  },

  toggleCohortStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<BackendResponseEnvelope<Cohort>> => {
    const res = await api.patch<BackendResponseEnvelope<Cohort>>(
      `/cohort/${id}/toggle-status`,
      { isActive },
    );
    return res.data;
  },

  deleteCohort: async (id: string): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(
      `/cohort/${id}`,
    );
    return res.data;
  },
};

export default cohortService;
