import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { campusCache } from "@/shared/lib/cacheEngine";
import { cohortService } from "../api/cohortService";
import { Cohort, CreateCohortPayload } from "../types/cohort.types";

const MIN_TABLE_LOADING = 600;

export const useCohorts = (isTabActive: boolean = true) => {
  const { notify } = useNotificationStore();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [studyProgramFilter, setStudyProgramFilter] = useState<string>("");

  const cacheKey = `cohorts_p${page}_l${limit}_s${search}_sp${studyProgramFilter}`;
  const cached = campusCache.get<{
    cohorts: Cohort[];
    pagination: Pagination;
  }>(cacheKey);

  const [cohorts, setCohorts] = useState<Cohort[]>(cached?.cohorts || []);
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCohorts = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSearch = search,
      targetSP = studyProgramFilter,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `cohorts_p${targetPage}_l${targetLimit}_s${targetSearch}_sp${targetSP}`;
      const currentCached = campusCache.get<{
        cohorts: Cohort[];
        pagination: Pagination;
      }>(currentKey);

      if (currentCached && !force) {
        setCohorts(currentCached.cohorts);
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

        if (targetSP && targetSP.trim() !== "") {
          queryParams.studyProgramId = targetSP;
        }

        const [response] = await Promise.all([
          cohortService.getCohorts(
            queryParams,
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list =
          response.data?.cohorts ||
          (Array.isArray(response.data) ? response.data : []);

        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setCohorts(list);
        setPagination(meta);
        campusCache.set(currentKey, { cohorts: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat data angkatan");
        }
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, studyProgramFilter, notify],
  );

  useEffect(() => {
    if (isTabActive) {
      fetchCohorts();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchCohorts]);

  const createCohort = async (payload: CreateCohortPayload) => {
    setSubmitting(true);
    try {
      const res = await cohortService.createCohort(payload);
      notify.success(res.meta?.message || "Data angkatan berhasil dibuat!");
      campusCache.invalidate("cohorts_");
      await fetchCohorts(1, limit, search, studyProgramFilter, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const updateCohort = async (id: string, payload: CreateCohortPayload) => {
    setSubmitting(true);
    try {
      const res = await cohortService.updateCohort(id, payload);
      notify.success(res.meta?.message || "Data angkatan berhasil diperbarui!");
      campusCache.invalidate("cohorts_");
      await fetchCohorts(page, limit, search, studyProgramFilter, true);
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
      const res = await cohortService.toggleCohortStatus(id, !currentStatus);
      notify.success(res.meta?.message || "Status angkatan berhasil diubah!");
      campusCache.invalidate("cohorts_");
      await fetchCohorts(page, limit, search, studyProgramFilter, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setTogglingId(null);
    }
  };

  const deleteCohort = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await cohortService.deleteCohort(id);
      notify.success(res.meta?.message || "Data angkatan berhasil dihapus!");
      campusCache.invalidate("cohorts_");
      await fetchCohorts(1, limit, search, studyProgramFilter, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    cohorts,
    loading,
    submitting,
    deletingId,
    togglingId,
    search,
    studyProgramFilter,
    pagination,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    setStudyProgramFilter: (val: string) => {
      setStudyProgramFilter(val);
      setPage(1);
    },
    setPage,
    setLimit: (val: number) => {
      setLimit(val);
      setPage(1);
    },
    refetchCohorts: () =>
      fetchCohorts(page, limit, search, studyProgramFilter, true),
    createCohort,
    updateCohort,
    toggleStatus,
    deleteCohort,
  };
};

export default useCohorts;
