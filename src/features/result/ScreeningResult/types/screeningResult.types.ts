export interface CleanUserResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  isActive: boolean;
}

// Export tipe PriorityResult & ReasonCode agar dapat di-import di Hook, Page, dan Transformer
export type PriorityResult = "P1" | "P2" | "P3" | "P4";
export type ReasonCode = "R01" | "R02" | "R03" | "R04" | "R05";

export interface ScreeningResult {
  id: string;
  sessionId: string;
  studentId: string;
  srqCutOffId?: string | null;
  srqScore: number;
  srqCutOffUsed: number;
  isSrqAboveCutOff: boolean;
  hasHighIndicator: boolean;
  safetyFlag: boolean;
  priorityResult: PriorityResult;
  reasonCode: ReasonCode;
  ruleVersion: string;
  calculatedAt: string | Date;
  session?: {
    id: string;
    status: string;
    schedule?: {
      id: string;
      name: string;
      tanggal: string;
    };
  };
  student?: {
    id: string;
    nim: string;
    gender: string;
    user?: CleanUserResponse;
    studyProgram?: {
      id: string;
      name: string;
      code: string;
      faculty?: { id: string; name: string; code?: string } | null; // Untuk cetak laporan & tabel
    };
    cohort?: { id: string; year: number; name: string };
    class?: { id: string; name: string; code?: string } | null; // Untuk cetak laporan & tabel
    className?: string;
  };
  followUps?: Array<{
    id: string;
    status: string;
    notes: string | null;
    createdAt: string | Date;
  }>;
}

export interface ScreeningResultListData {
  results: ScreeningResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ScreeningResultDetail extends ScreeningResult {
  rawResponses: {
    srqAnswers: number[];
    indicators: {
      f1: number;
      f2: number;
      c1: number;
      s1: number;
      h1: number;
    };
    safetyFlag: boolean;
    m1: string[];
  };
}

// Interface Query Params Lengkap dengan Filter Tambahan
export interface ScreeningResultQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  priorityResult?: PriorityResult | "";
  scheduleId?: string;
  facultyId?: string;
  studyProgramId?: string;
  cohortId?: string;
  classId?: string;
  gender?: "L" | "P" | "";
}
