import { api } from "@/shared/lib/axios";
import { BackendResponseEnvelope, QueryParams } from "@/shared/types/api";
import { CreateUserPayload, User, UserListData } from "../types/user.types";

export const userService = {
  getUsers: async (
    params?: QueryParams,
    signal?: AbortSignal,
  ): Promise<BackendResponseEnvelope<UserListData>> => {
    const res = await api.get<BackendResponseEnvelope<UserListData>>("/user", {
      signal,
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        search: params?.search || "",
      },
    });
    return res.data;
  },

  createUser: async (
    payload: CreateUserPayload,
  ): Promise<BackendResponseEnvelope<User>> => {
    const res = await api.post<BackendResponseEnvelope<User>>("/user", payload);
    return res.data;
  },

  updateUser: async (
    id: string,
    payload: Partial<CreateUserPayload>,
  ): Promise<BackendResponseEnvelope<User>> => {
    const res = await api.put<BackendResponseEnvelope<User>>(
      `/user/${id}`,
      payload,
    );
    return res.data;
  },

  toggleUserStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<BackendResponseEnvelope<User>> => {
    const res = await api.patch<BackendResponseEnvelope<User>>(
      `/user/${id}/status`,
      { isActive },
    );
    return res.data;
  },

  deleteUser: async (id: string): Promise<BackendResponseEnvelope<null>> => {
    const res = await api.delete<BackendResponseEnvelope<null>>(`/user/${id}`);
    return res.data;
  },
};
