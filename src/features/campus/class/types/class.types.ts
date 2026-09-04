import { Pagination } from "@/shared/types/api";
import { Cohort } from "../../cohort/types/cohort.types";
import { StudyProgram } from "../../study/types/studyProgram.types";

export interface ClassEntity {
  id: string;
  name: string;
  code: string;
  studyProgramId: string;
  studyProgram?: StudyProgram;
  cohortId: string;
  cohort?: Cohort;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassPayload {
  name: string;
  code: string;
  studyProgramId: string;
  cohortId: string;
  isActive?: boolean;
}

export interface ClassListData {
  classes: ClassEntity[];
  pagination?: Pagination;
}
