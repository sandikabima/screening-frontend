import { Pagination } from "@/shared/types/api";

export interface StudentUserRel {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  isActive: boolean;
}

export interface StudentFacultyRel {
  id: string;
  code: string;
  name: string;
}

export interface StudentStudyProgramRel {
  id: string;
  facultyId: string;
  code: string;
  name: string;
  degree: string;
  faculty?: StudentFacultyRel;
}

export interface StudentCohortRel {
  id: string;
  year: number;
  name: string;
}

export interface StudentClassRel {
  id: string;
  code: string;
  name: string;
}

export interface Student {
  id: string;
  userId: string;
  nim: string;
  gender: "L" | "P";
  phoneNumber: string;
  studyProgramId: string;
  cohortId: string;
  classId?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: StudentUserRel;
  studyProgram?: StudentStudyProgramRel;
  study_program?: StudentStudyProgramRel;
  cohort?: StudentCohortRel;
  class?: StudentClassRel | null;
}

export interface CreateStudentPayload {
  nim: string;
  name: string;
  email: string;
  password?: string;
  gender: "L" | "P";
  phoneNumber: string;
  studyProgramId: string;
  cohortId: string;
  classId?: string;
}

export interface UpdateStudentPayload {
  name?: string;
  gender?: "L" | "P";
  phoneNumber?: string;
  studyProgramId?: string;
  cohortId?: string;
  classId?: string | null;
}

export interface StudentListData {
  students: Student[];
  pagination?: Pagination;
}
