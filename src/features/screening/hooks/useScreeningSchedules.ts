import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { screeningScheduleService } from "../api/screeningScheduleService";
import {
  CreateSchedulePayload,
  ScreeningSchedule,
  UpdateSchedulePayload,
} from "../types/screeningSchedule.types";
import { screeningCache } from "@/shared/lib/cacheEngine";

const MIN_TABLE_LOADING = 600;

export const useScreeningSchedules = (isTabActive: boolean = false) => {
  const { notify } = useNotificationStore();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [statusBarcode, setStatusBarcode] = useState<string>("");

  const cacheKey = `schedules_p${page}_l${limit}_s${search}_st${statusBarcode}`;
  const cached = screeningCache.get<{
    schedules: ScreeningSchedule[];
    pagination: Pagination;
  }>(cacheKey);

  const [schedules, setSchedules] = useState<ScreeningSchedule[]>(
    cached?.schedules || [],
  );
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSchedules = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSearch = search,
      targetStatus = statusBarcode,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `schedules_p${targetPage}_l${targetLimit}_s${targetSearch}_st${targetStatus}`;
      const currentCached = screeningCache.get<{
        schedules: ScreeningSchedule[];
        pagination: Pagination;
      }>(currentKey);

      if (currentCached && !force) {
        setSchedules(currentCached.schedules);
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
          screeningScheduleService.getSchedules(
            {
              page: targetPage,
              limit: targetLimit,
              search: targetSearch,
              statusBarcode: targetStatus || undefined,
            },
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list =
          response.data?.schedules ||
          (Array.isArray(response.data) ? response.data : []);

        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setSchedules(list);
        setPagination(meta);
        screeningCache.set(currentKey, { schedules: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat jadwal screening");
        }
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, statusBarcode, notify],
  );

  useEffect(() => {
    if (isTabActive) {
      fetchSchedules();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchSchedules]);

  const createSchedule = async (payload: CreateSchedulePayload) => {
    setSubmitting(true);
    try {
      const res = await screeningScheduleService.createSchedule(payload);
      notify.success(
        res.meta?.message || "Jadwal batch screening berhasil dibuat!",
      );
      screeningCache.invalidate("schedules_");
      await fetchSchedules(1, limit, search, statusBarcode, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal membuat jadwal screening");
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const updateSchedule = async (id: string, payload: UpdateSchedulePayload) => {
    setSubmitting(true);
    try {
      const res = await screeningScheduleService.updateSchedule(id, payload);
      notify.success(
        res.meta?.message || "Jadwal batch screening berhasil diperbarui!",
      );
      screeningCache.invalidate("schedules_");
      await fetchSchedules(page, limit, search, statusBarcode, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal memperbarui jadwal");
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSchedule = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await screeningScheduleService.deleteSchedule(id);
      notify.success(
        res.meta?.message || "Jadwal batch screening berhasil dihapus!",
      );
      screeningCache.invalidate("schedules_");
      await fetchSchedules(1, limit, search, statusBarcode, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal menghapus jadwal");
      return { success: false };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    schedules,
    loading,
    submitting,
    deletingId,
    search,
    statusBarcode,
    pagination,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    setStatusBarcode: (val: string) => {
      setStatusBarcode(val);
      setPage(1);
    },
    setPage,
    setLimit: (val: number) => {
      setLimit(val);
      setPage(1);
    },
    refetchSchedules: () =>
      fetchSchedules(page, limit, search, statusBarcode, true),
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
};

export default useScreeningSchedules;
