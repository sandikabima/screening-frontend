import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { campusCache } from "@/shared/lib/cacheEngine";
import { classService } from "../api/classService";
import { ClassEntity, CreateClassPayload } from "../types/class.types";

const MIN_TABLE_LOADING = 600;

export const useClasses = (isTabActive: boolean = true) => {
  const { notify } = useNotificationStore();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [studyProgramFilter, setStudyProgramFilter] = useState<string>("");
  const [cohortFilter, setCohortFilter] = useState<string>("");

  const cacheKey = `classes_p${page}_l${limit}_s${search}_sp${studyProgramFilter}_c${cohortFilter}`;
  const cached = campusCache.get<{
    classes: ClassEntity[];
    pagination: Pagination;
  }>(cacheKey);

  const [classes, setClasses] = useState<ClassEntity[]>(cached?.classes || []);
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchClasses = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSearch = search,
      targetSP = studyProgramFilter,
      targetCohort = cohortFilter,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `classes_p${targetPage}_l${targetLimit}_s${targetSearch}_sp${targetSP}_c${targetCohort}`;
      const currentCached = campusCache.get<{
        classes: ClassEntity[];
        pagination: Pagination;
      }>(currentKey);

      if (currentCached && !force) {
        setClasses(currentCached.classes);
        setPagination(currentCached.pagination);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const minDelayPromise = new Promise((resolve) =>
          setTimeout(resolve, MIN_TABLE_LOADING),
        );

        const queryParams: any = {
          page: targetPage,
          limit: targetLimit,
          search: targetSearch,
        };

        if (targetSP && targetSP.trim() !== "")
          queryParams.studyProgramId = targetSP;
        if (targetCohort && targetCohort.trim() !== "")
          queryParams.cohortId = targetCohort;

        const [response] = await Promise.all([
          classService.getClasses(
            queryParams,
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list =
          (response.data as any)?.classes ||
          (Array.isArray(response.data) ? response.data : []);

        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setClasses(list);
        setPagination(meta);
        campusCache.set(currentKey, { classes: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat data kelas");
        }
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, studyProgramFilter, cohortFilter, notify],
  );

  useEffect(() => {
    if (isTabActive) {
      fetchClasses();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchClasses]);

  const createClass = async (payload: CreateClassPayload) => {
    setSubmitting(true);
    try {
      const res = await classService.createClass(payload);
      notify.success(res.meta?.message || "Kelas baru berhasil dibuat!");
      campusCache.invalidate("classes_");
      await fetchClasses(
        1,
        limit,
        search,
        studyProgramFilter,
        cohortFilter,
        true,
      );
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const updateClass = async (id: string, payload: CreateClassPayload) => {
    setSubmitting(true);
    try {
      const res = await classService.updateClass(id, payload);
      notify.success(res.meta?.message || "Data kelas berhasil diperbarui!");
      campusCache.invalidate("classes_");
      await fetchClasses(
        page,
        limit,
        search,
        studyProgramFilter,
        cohortFilter,
        true,
      );
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
      const res = await classService.toggleClassStatus(id, !currentStatus);
      notify.success(res.meta?.message || "Status kelas berhasil diubah!");
      campusCache.invalidate("classes_");
      await fetchClasses(
        page,
        limit,
        search,
        studyProgramFilter,
        cohortFilter,
        true,
      );
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setTogglingId(null);
    }
  };

  const deleteClass = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await classService.deleteClass(id);
      notify.success(res.meta?.message || "Data kelas berhasil dihapus!");
      campusCache.invalidate("classes_");
      await fetchClasses(
        1,
        limit,
        search,
        studyProgramFilter,
        cohortFilter,
        true,
      );
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    classes,
    loading,
    submitting,
    deletingId,
    togglingId,
    search,
    studyProgramFilter,
    cohortFilter,
    pagination,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    setStudyProgramFilter: (val: string) => {
      setStudyProgramFilter(val);
      setPage(1);
    },
    setCohortFilter: (val: string) => {
      setCohortFilter(val);
      setPage(1);
    },
    setPage,
    setLimit: (val: number) => {
      setLimit(val);
      setPage(1);
    },
    refetchClasses: () =>
      fetchClasses(page, limit, search, studyProgramFilter, cohortFilter, true),
    createClass,
    updateClass,
    toggleStatus,
    deleteClass,
  };
};

export default useClasses;
