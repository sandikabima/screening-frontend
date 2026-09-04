import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { CreateRolePayload, Role } from "../types/role.types";
import { rbacCache } from "@/shared/lib/cacheEngine";
import { roleService } from "../api/roleService";

const MIN_TABLE_LOADING = 600;

export const useRoles = (isTabActive: boolean = false) => {
  const { notify } = useNotificationStore();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const cacheKey = `roles_p${page}_l${limit}_s${search}`;
  const cached = rbacCache.get<{ roles: Role[]; pagination: Pagination }>(
    cacheKey,
  );

  const [roles, setRoles] = useState<Role[]>(cached?.roles || []);
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRoles = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSearch = search,
      force = false,
    ) => {
      // 1. Abort request sebelumnya jika ada request baru yang berjalan
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `roles_p${targetPage}_l${targetLimit}_s${targetSearch}`;
      const currentCached = rbacCache.get<{
        roles: Role[];
        pagination: Pagination;
      }>(currentKey);

      //  2. HIT DARIPADA CACHE -> Tampil Instan (0ms)
      if (currentCached && !force) {
        setRoles(currentCached.roles);
        setPagination(currentCached.pagination);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 3. HIT KE SERVER BACKEND -> Terapkan Promise.all (API + Minimum Delay)
        const minDelayPromise = new Promise((resolve) =>
          setTimeout(resolve, MIN_TABLE_LOADING),
        );

        const [response] = await Promise.all([
          roleService.getRoles(
            { page: targetPage, limit: targetLimit, search: targetSearch },
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list =
          response.data?.roles ||
          (Array.isArray(response.data) ? response.data : []);

        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setRoles(list);
        setPagination(meta);
        rbacCache.set(currentKey, { roles: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat skema peran");
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
      fetchRoles();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchRoles]);

  const createRole = async (payload: CreateRolePayload) => {
    setSubmitting(true);
    try {
      const res = await roleService.createRole(payload);
      notify.success(
        res.meta?.message || "Peran jabatan baru berhasil dibuat!",
      );
      rbacCache.invalidate("roles_");
      await fetchRoles(1, limit, search, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const updateRole = async (id: string, payload: CreateRolePayload) => {
    setSubmitting(true);
    try {
      const res = await roleService.updateRole(id, payload);
      notify.success(res.meta?.message || "Peran jabatan berhasil diperbarui!");
      rbacCache.invalidate("roles_");
      await fetchRoles(page, limit, search, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRole = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await roleService.deleteRole(id);
      notify.success(res.meta?.message || "Peran jabatan berhasil dihapus!");
      rbacCache.invalidate("roles_");
      await fetchRoles(1, limit, search, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    roles,
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
    refetchRoles: () => fetchRoles(page, limit, search, true),
    createRole,
    updateRole,
    deleteRole,
  };
};

export default useRoles;
