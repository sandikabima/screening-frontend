import { Pagination } from "@/shared/types/api";

export interface Faculty {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacultyPayload {
  code: string;
  name: string;
  isActive?: boolean;
}

export interface FacultyListData {
  faculties: Faculty[];
  pagination?: Pagination;
}
