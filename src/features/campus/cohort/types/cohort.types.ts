import { Pagination } from "@/shared/types/api";

export interface Cohort {
  id: string;
  year: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCohortPayload {
  year: number;
  name: string;
  isActive?: boolean;
}

export interface CohortListData {
  cohorts: Cohort[];
  pagination?: Pagination;
}
