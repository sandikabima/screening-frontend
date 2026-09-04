import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { campusCache } from "@/shared/lib/cacheEngine";
import { facultyService } from "../api/facultyService";
import { CreateFacultyPayload, Faculty } from "../types/faculty.types";

const MIN_TABLE_LOADING = 600;

export const useFaculties = (isTabActive: boolean = true) => {
  const { notify } = useNotificationStore();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const cacheKey = `faculties_p${page}_l${limit}_s${search}`;
  const cached = campusCache.get<{
    faculties: Faculty[];
    pagination: Pagination;
  }>(cacheKey);

  const [faculties, setFaculties] = useState<Faculty[]>(
    cached?.faculties || [],
  );
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchFaculties = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSearch = search,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `faculties_p${targetPage}_l${targetLimit}_s${targetSearch}`;
      const currentCached = campusCache.get<{
        faculties: Faculty[];
        pagination: Pagination;
      }>(currentKey);

      if (currentCached && !force) {
        setFaculties(currentCached.faculties);
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
          facultyService.getFaculties(
            { page: targetPage, limit: targetLimit, search: targetSearch },
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list =
          response.data?.faculties ||
          (Array.isArray(response.data) ? response.data : []);

        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setFaculties(list);
        setPagination(meta);
        campusCache.set(currentKey, { faculties: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat data fakultas");
        }
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, notify],
  );

  useEffect(() => {
    if (isTabActive) {
      fetchFaculties();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchFaculties]);

  const createFaculty = async (payload: CreateFacultyPayload) => {
    setSubmitting(true);
    try {
      const res = await facultyService.createFaculty(payload);
      notify.success(res.meta?.message || "Fakultas baru berhasil dibuat!");
      campusCache.invalidate("faculties_");
      await fetchFaculties(1, limit, search, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const updateFaculty = async (id: string, payload: CreateFacultyPayload) => {
    setSubmitting(true);
    try {
      const res = await facultyService.updateFaculty(id, payload);
      notify.success(res.meta?.message || "Data fakultas berhasil diperbarui!");
      campusCache.invalidate("faculties_");
      await fetchFaculties(page, limit, search, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      const res = await facultyService.toggleFacultyStatus(id, !currentStatus);
      notify.success(res.meta?.message || "Status fakultas berhasil diubah!");
      campusCache.invalidate("faculties_");
      await fetchFaculties(page, limit, search, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setTogglingId(null);
    }
  };

  const deleteFaculty = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await facultyService.deleteFaculty(id);
      notify.success(res.meta?.message || "Data fakultas berhasil dihapus!");
      campusCache.invalidate("faculties_");
      await fetchFaculties(1, limit, search, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    faculties,
    loading,
    submitting,
    deletingId,
    togglingId,
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
    refetchFaculties: () => fetchFaculties(page, limit, search, true),
    createFaculty,
    updateFaculty,
    toggleStatus,
    deleteFaculty,
  };
};

export default useFaculties;
