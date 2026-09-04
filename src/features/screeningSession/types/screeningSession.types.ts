import { Pagination } from "@/shared/types/api";

export type SessionStatus = "In_Progress" | "Completed";

export interface ScreeningSessionSchedule {
  id: string;
  name: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  statusBarcode: string;
}

export interface ScreeningSessionStudentUser {
  id: string;
  name: string;
  email: string;
}

export interface ScreeningSessionStudent {
  id: string;
  nim: string;
  userId: string;
  user?: ScreeningSessionStudentUser;
}

export interface ScreeningSession {
  id: string;
  scheduleId: string;
  studentId: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  schedule?: ScreeningSessionSchedule;
  student?: ScreeningSessionStudent;
}

export interface SessionFilterParams {
  page?: number;
  limit?: number;
  scheduleId?: string;
  studentId?: string;
  status?: string;
}

export interface SessionListData {
  sessions: ScreeningSession[];
  pagination?: Pagination;
}
