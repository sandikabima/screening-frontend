import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope } from "@/shared/types/api";
import { DashboardStats } from "../types/dashboard.types";

export const dashboardService = {
  getOverview: async (
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<DashboardStats>> => {
    const res = await api.get<BackendResponseEnvelope<DashboardStats>>(
      "/dashboard/overview",
      { signal },
    );
    return res.data;
  },
};
