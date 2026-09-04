import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope } from "@/shared/types/api";
import { AuditLogItem, ListAuditLogsParams } from "../types/audit.types";

export const auditService = {
  getAuditLogs: async (
    params?: ListAuditLogsParams,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<AuditLogItem[]>> => {
    const cleanedParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(
            ([_, value]) =>
              value !== undefined && value !== "" && value !== null,
          ),
        )
      : undefined;

    const res = await api.get<BackendResponseEnvelope<AuditLogItem[]>>(
      "/audit-logs",
      {
        params: cleanedParams,
        signal,
      },
    );

    return res.data;
  },
};
