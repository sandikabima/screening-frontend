import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope, QueryParams } from "@/shared/types/api";
import { CreateRolePayload, Role, RoleListData } from "../types/role.types";

export const roleService = {
  getRoles: async (
    params?: QueryParams,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<RoleListData>> => {
    const res = await api.get<BackendResponseEnvelope<RoleListData>>("/role", {
      signal,
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        search: params?.search || "",
      },
    });
    return res.data;
  },

  createRole: async (
    payload: CreateRolePayload,
  ): Promise<BackendResponseEnvelope<Role>> => {
    const res = await api.post<BackendResponseEnvelope<Role>>("/role", payload);
    return res.data;
  },

  updateRole: async (
    id: string,
    payload: CreateRolePayload,
  ): Promise<BackendResponseEnvelope<Role>> => {
    const res = await api.put<BackendResponseEnvelope<Role>>(
      `/role/${id}`,
      payload,
    );
    return res.data;
  },

  deleteRole: async (id: string): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(`/role/${id}`);
    return res.data;
  },
};
