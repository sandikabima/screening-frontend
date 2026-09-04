import { useState, useCallback, useEffect, useRef } from "react";
import { Pagination } from "@/shared/types/api";
import { rbacCache } from "@/shared/lib/cacheEngine";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { userService } from "../api/userService";
import { CreateUserPayload, User } from "../types/user.types";

const MIN_TABLE_LOADING = 600;

export const useUsers = (isTabActive: boolean = true) => {
  const { notify } = useNotificationStore();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const cacheKey = `users_p${page}_l${limit}_s${search}`;
  const cached = rbacCache.get<{ users: User[]; pagination: Pagination }>(
    cacheKey,
  );

  const [users, setUsers] = useState<User[]>(cached?.users || []);
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchUsers = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSearch = search,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `users_p${targetPage}_l${targetLimit}_s${targetSearch}`;
      const currentCached = rbacCache.get<{
        users: User[];
        pagination: Pagination;
      }>(currentKey);

      if (currentCached && !force) {
        setUsers(currentCached.users);
        setPagination(currentCached.pagination);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const minDelayPromise = new Promise((resolve) =>
          setTimeout(resolve, MIN_TABLE_LOADING),
        );

        const [response] = await Promise.all([
          userService.getUsers(
            { page: targetPage, limit: targetLimit, search: targetSearch },
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list =
          response.data?.users ||
          (Array.isArray(response.data) ? response.data : []);

        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setUsers(list);
        setPagination(meta);
        rbacCache.set(currentKey, { users: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat direktori pengguna");
        }
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, notify],
  );

  useEffect(() => {
    if (isTabActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchUsers();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchUsers]);

  const createUser = async (payload: CreateUserPayload) => {
    setSubmitting(true);
    try {
      const res = await userService.createUser(payload);
      notify.success(
        res.meta?.message || "Pengguna baru berhasil diregistrasi!",
      );
      rbacCache.invalidate("users_");
      await fetchUsers(1, limit, search, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const updateUser = async (
    id: string,
    payload: Partial<CreateUserPayload>,
  ) => {
    setSubmitting(true);
    try {
      const res = await userService.updateUser(id, payload);
      notify.success(res.meta?.message || "Data pengguna berhasil diperbarui!");
      rbacCache.invalidate("users_");
      await fetchUsers(page, limit, search, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: boolean) => {
    try {
      await userService.toggleUserStatus(id, !currentStatus);
      notify.success(
        `Status pengguna berhasil di-${
          !currentStatus ? "aktifkan" : "nonaktifkan"
        }`,
      );
      rbacCache.invalidate("users_");
      await fetchUsers(page, limit, search, true);
    } catch (err: any) {
      notify.error(err.message);
    }
  };

  const deleteUser = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await userService.deleteUser(id);
      notify.success(res.meta?.message || "Pengguna berhasil dihapus!");
      rbacCache.invalidate("users_");
      await fetchUsers(1, limit, search, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    users,
    loading,
    submitting,
    deletingId,
    search,
    pagination,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    setPage,
    setLimit: (val: number) => {
      setLimit(val);
      setPage(1);
    },
    refetchUsers: () => fetchUsers(page, limit, search, true),
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
  };
};

export default useUsers;
