import { Pagination } from "@/shared/types/api";

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRolePayload {
  name: string;
  displayName: string;
  description?: string;
}

export interface RoleListData {
  roles: Role[];
  pagination?: Pagination;
}
