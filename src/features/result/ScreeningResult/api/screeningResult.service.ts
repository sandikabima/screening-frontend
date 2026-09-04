import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope } from "@/shared/types/api";
import {
  ScreeningResultDetail,
  ScreeningResultListData,
  ScreeningResultQueryParams,
} from "../types/screeningResult.types";

export const screeningResultService = {
  /**
   * Fetch paginated list of screening results with filter params
   */
  getResults: async (
    params?: ScreeningResultQueryParams,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<ScreeningResultListData>> => {
    const res = await api.get<BackendResponseEnvelope<ScreeningResultListData>>(
      "/screening-result",
      {
        signal,
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          priorityResult: params?.priorityResult || undefined,
          scheduleId: params?.scheduleId || undefined,
          search: params?.search || "",
        },
      },
    );
    return res.data;
  },

  /**
   * Fetch single screening result detail (including JSONB rawResponses)
   */
  getResultById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<ScreeningResultDetail>> => {
    const res = await api.get<BackendResponseEnvelope<ScreeningResultDetail>>(
      `/screening-result/${id}`,
      { signal },
    );
    return res.data;
  },
};

export default screeningResultService;
