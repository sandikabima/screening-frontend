import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope, QueryParams } from "@/shared/types/api";
import { Question, UpdateQuestionTextPayload } from "../types/question.types";

export const questionService = {
  getQuestions: async (
    params?: QueryParams & { category?: string; code?: string },
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<Question[]>> => {
    const queryParams: Record<string, any> = {
      search: params?.search || "",
    };

    if (params?.category && params.category.trim() !== "") {
      queryParams.category = params.category;
    }

    if (params?.code && params.code.trim() !== "") {
      queryParams.code = params.code;
    }

    const res = await api.get<BackendResponseEnvelope<Question[]>>(
      "/quetions",
      {
        signal,
        params: queryParams,
      },
    );
    return res.data;
  },

  getQuestionById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<Question>> => {
    const res = await api.get<BackendResponseEnvelope<Question>>(
      `/quetions/${id}`,
      { signal },
    );
    return res.data;
  },

  updateQuestionText: async (
    id: string,
    payload: UpdateQuestionTextPayload,
  ): Promise<BackendResponseEnvelope<Question>> => {
    const res = await api.put<BackendResponseEnvelope<Question>>(
      `/quetions/${id}`,
      payload,
    );
    return res.data;
  },

  toggleQuestionStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<BackendResponseEnvelope<Question>> => {
    const res = await api.patch<BackendResponseEnvelope<Question>>(
      `/quetions/${id}/toggle-status`,
      { isActive },
    );
    return res.data;
  },
};

export default questionService;
