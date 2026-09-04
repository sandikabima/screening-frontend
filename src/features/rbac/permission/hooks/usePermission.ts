import { useState, useCallback, useEffect, useRef } from "react";
import {
  Permission,
  CreatePermissionPayload,
  AssignPermissionPayload,
} from "../types/permission.types";
import { permissionService } from "../api/permissionService";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { rbacCache } from "@/shared/lib/cacheEngine";

const MIN_LOADING_DELAY = 600;

export const usePermissions = (enabled: boolean = false) => {
  const { notify } = useNotificationStore();

  const cacheKey = "master_permissions_catalog";
  const cached = rbacCache.get<Permission[]>(cacheKey);

  const [masterPermissions, setMasterPermissions] = useState<Permission[]>(
    cached || [],
  );
  const [loadingPermissions, setLoadingPermissions] = useState<boolean>(
    enabled && !cached,
  );
  const [submittingAssign, setSubmittingAssign] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMasterPermissions = useCallback(
    async (force = false) => {
      if (!enabled) return;

      const currentCached = rbacCache.get<Permission[]>(cacheKey);
      if (currentCached && !force) {
        setMasterPermissions(currentCached);
        setLoadingPermissions(false);
        return;
      }

      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      setLoadingPermissions(true);
      try {
        const minDelayPromise = new Promise((res) =>
          setTimeout(res, MIN_LOADING_DELAY),
        );

        const [res] = await Promise.all([
          permissionService.getPermissions(abortControllerRef.current.signal),
          minDelayPromise,
        ]);

        const rawData = res.data;
        const list: Permission[] = Array.isArray(rawData)
          ? rawData
          : (rawData as any)?.permissions || [];

        setMasterPermissions(list);
        rbacCache.set(cacheKey, list);
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(
            err?.response?.data?.message ||
              err?.message ||
              "Gagal memuat master permission.",
          );
        }
      } finally {
        setLoadingPermissions(false);
      }
    },
    [enabled, notify],
  );

  useEffect(() => {
    if (enabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMasterPermissions();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [enabled, fetchMasterPermissions]);

  const fetchRolePermissions = useCallback(
    async (roleId: string) => {
      try {
        const res = await permissionService.getRolePermissions(roleId);
        return res.data || [];
      } catch (err: any) {
        notify.error("Gagal mengambil permission role.");
        return [];
      }
    },
    [notify],
  );

  const createPermission = async (payload: CreatePermissionPayload) => {
    setSubmittingAssign(true);
    try {
      const res = await permissionService.createPermission(payload);
      notify.success(
        res?.meta?.message || "Master Permission berhasil dibuat.",
      );
      rbacCache.invalidate("master_permissions_");
      await fetchMasterPermissions(true);
      return { success: true };
    } catch (err: any) {
      notify.error(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal membuat permission.",
      );
      return { success: false };
    } finally {
      setSubmittingAssign(false);
    }
  };

  const updatePermission = async (
    id: string,
    payload: CreatePermissionPayload,
  ) => {
    setSubmittingAssign(true);
    try {
      const res = await permissionService.updatePermission(id, payload);
      notify.success(
        res?.meta?.message || "Master Permission berhasil diperbarui.",
      );
      rbacCache.invalidate("master_permissions_");
      await fetchMasterPermissions(true);
      return { success: true };
    } catch (err: any) {
      notify.error(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal mengedit permission.",
      );
      return { success: false };
    } finally {
      setSubmittingAssign(false);
    }
  };

  const deletePermission = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await permissionService.deletePermission(id);
      notify.success(
        res?.meta?.message || "Master Permission berhasil dihapus.",
      );
      rbacCache.invalidate("master_permissions_");
      await fetchMasterPermissions(true);
      return { success: true };
    } catch (err: any) {
      notify.error(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal menghapus permission.",
      );
      return { success: false };
    } finally {
      setDeletingId(null);
    }
  };

  const assignPermissions = async (payload: AssignPermissionPayload) => {
    setSubmittingAssign(true);
    try {
      const res = await permissionService.assignPermissions(payload);
      notify.success(
        res?.meta?.message || "Hak akses role berhasil diperbarui.",
      );
      rbacCache.invalidate("roles_");
      return { success: true };
    } catch (err: any) {
      notify.error(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal menyimpan hak akses.",
      );
      return { success: false };
    } finally {
      setSubmittingAssign(false);
    }
  };

  return {
    masterPermissions,
    loadingPermissions,
    submittingAssign,
    deletingId,
    fetchRolePermissions,
    createPermission,
    updatePermission,
    deletePermission,
    assignPermissions,
    refetchMasterPermissions: () => fetchMasterPermissions(true),
  };
};

export default usePermissions;
