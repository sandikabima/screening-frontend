export interface AuditLogItem {
  id: string;
  actorUserId: string | null;
  actorEmail: string;
  action: string;
  module: string;
  targetEntity: string | null;
  targetId: string | null;
  ipAddress: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export interface ListAuditLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  action?: string;
  actorEmail?: string;
  targetEntity?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: "asc" | "desc";
}
