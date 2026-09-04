import { Pagination } from "@/shared/types/api";

export interface Session {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  deviceInfo: string;
  isRevoked: boolean;
  isActive: boolean;
  expiredAt: string;
  createdAt: string;
}

export type SessionStatusFilter = "all" | "active" | "inactive";

export interface SessionQueryParams {
  page?: number;
  limit?: number;
  status?: SessionStatusFilter;
}

export interface SessionListData {
  sessions: Session[];
  pagination?: Pagination;
}
