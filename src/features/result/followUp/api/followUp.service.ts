import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope } from "@/shared/types/api";
import {
  FollowUpItem,
  FollowUpListData,
  GetFollowUpsParams,
  UpdateFollowUpPayload,
} from "../types/followUp.types";

export const followUpService = {
  getFollowUps: async (
    params?: GetFollowUpsParams,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<FollowUpListData>> => {
    const res = await api.get<BackendResponseEnvelope<FollowUpListData>>(
      "/follow-up",
      {
        signal,
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          status: params?.status || undefined,
          priorityResult: params?.priorityResult || undefined,
          search: params?.search || "",
        },
      },
    );
    return res.data;
  },

  updateFollowUp: async (
    id: string,
    payload: UpdateFollowUpPayload,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<FollowUpItem>> => {
    const res = await api.patch<BackendResponseEnvelope<FollowUpItem>>(
      `/follow-up/${id}`,
      payload,
      { signal },
    );
    return res.data;
  },
};
