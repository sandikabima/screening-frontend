import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope } from "@/shared/types/api";
import {
  AssignPermissionPayload,
  CreatePermissionPayload,
  Permission,
  RolePermissionAssignment,
} from "../types/permission.types";

export const permissionService = {
  getPermissions: async (
    signal?: AbortSignal,
  ): Promise<
    BackendResponseEnvelope<{ permissions: Permission[] } | Permission[]>
  > => {
    const res = await api.get<
      BackendResponseEnvelope<{ permissions: Permission[] } | Permission[]>
    >("/permission", { signal });
    return res.data;
  },

  getRolePermissions: async (
    roleId: string,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<Permission[]>> => {
    const res = await api.get<BackendResponseEnvelope<Permission[]>>(
      `/permission/role/${roleId}`,
      { signal },
    );
    return res.data;
  },

  createPermission: async (
    payload: CreatePermissionPayload,
  ): Promise<BackendResponseEnvelope<Permission>> => {
    const res = await api.post<BackendResponseEnvelope<Permission>>(
      "/permission",
      payload,
    );
    return res.data;
  },

  updatePermission: async (
    id: string,
    payload: CreatePermissionPayload,
  ): Promise<BackendResponseEnvelope<Permission>> => {
    const res = await api.put<BackendResponseEnvelope<Permission>>(
      `/permission/${id}`,
      payload,
    );
    return res.data;
  },

  deletePermission: async (
    id: string,
  ): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(
      `/permission/${id}`,
    );
    return res.data;
  },

  assignPermissions: async (
    payload: AssignPermissionPayload,
  ): Promise<BackendResponseEnvelope<RolePermissionAssignment>> => {
    const res = await api.post<
      BackendResponseEnvelope<RolePermissionAssignment>
    >("/permission/assign", payload);
    return res.data;
  },
};
