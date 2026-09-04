import { Pagination } from "@/shared/types/api";
import { Faculty } from "../../faculty/types/faculty.types";

export interface StudyProgram {
  id: string;
  code: string;
  name: string;
  degree: string;
  facultyId: string;
  faculty?: Faculty;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudyProgramPayload {
  code: string;
  name: string;
  degree: string;
  facultyId: string;
  isActive?: boolean;
}

export interface StudyProgramListData {
  studyPrograms: StudyProgram[];
  pagination?: Pagination;
}
