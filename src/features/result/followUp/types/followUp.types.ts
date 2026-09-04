export type FollowUpStatus = "Belum" | "Dijadwalkan" | "Selesai";

export interface HandledByUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface FollowUpItem {
  id: string;
  screeningResultId: string;
  status: FollowUpStatus;
  notes: string | null;
  handledByUserId: string | null;
  createdAt: string;
  updatedAt: string;
  handledBy?: HandledByUser | null;
  screeningResult?: {
    id: string;
    priorityResult: "P1" | "P2" | "P3" | "P4";
    reasonCode: string;
    srqScore: number;
    student?: {
      id: string;
      nim: string;
      user?: {
        name: string;
        email: string;
      };
      studyProgram?: {
        name: string;
        code: string;
      };
      cohort?: {
        year: number;
      };
    };
  };
}

export interface FollowUpListData {
  tickets: FollowUpItem[];
}

export interface GetFollowUpsParams {
  page?: number;
  limit?: number;
  status?: string;
  priorityResult?: string;
  search?: string;
}

export interface UpdateFollowUpPayload {
  status: FollowUpStatus;
  notes?: string;
  assignedStaffId?: string;
}
