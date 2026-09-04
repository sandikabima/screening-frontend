import { Pagination } from "@/shared/types/api";

export interface User {
  id: string;
  email: string;
  name: string;
  roleId: string;
  role?: string;
  roleDisplayName?: string;
  displayName?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  email: string;
  name: string;
  roleId: string;
  password?: string;
}

export interface UserListData {
  users: User[];
  pagination?: Pagination;
}
