import { Pagination } from "@/shared/types/api";

export type PriorityResult = "P1" | "P2" | "P3" | "P4";
export type ReasonCode = "R01" | "R02" | "R03" | "R04" | "R05";

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  isActive: boolean;
}

export interface StudentInfo {
  id: string;
  nim: string;
  gender: string;
  user?: StudentUser;
  studyProgram?: { id: string; name: string; code: string };
  cohort?: { id: string; year: number; name: string };
}

export interface FollowUpSummary {
  id: string;
  status: "Belum" | "Dijadwalkan" | "Selesai";
  notes?: string | null;
  createdAt: string;
}

export interface ScreeningResult {
  id: string;
  sessionId: string;
  studentId: string;
  srqScore: number;
  srqCutOffUsed: number;
  isSrqAboveCutOff: boolean;
  hasHighIndicator: boolean;
  safetyFlag: boolean;
  priorityResult: PriorityResult;
  reasonCode: ReasonCode;
  ruleVersion: string;
  calculatedAt: string;
  student?: StudentInfo;
  followUps?: FollowUpSummary[];
}

export interface ScreeningResultDetail extends ScreeningResult {
  rawResponses: {
    srqAnswers: number[];
    indicators: { f1: number; f2: number; c1: number; s1: number; h1: number };
    safetyFlag: boolean;
    m1: string[];
  };
}

export interface ScreeningResultListData {
  results: ScreeningResult[];
  pagination?: Pagination;
}

export interface ScreeningResultQueryParams {
  page?: number;
  limit?: number;
  priorityResult?: PriorityResult | "";
  scheduleId?: string;
  search?: string;
}
