import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { screeningSessionService } from "../api/screeningSessionService";
import { ScreeningSession } from "../types/screeningSession.types";
import { screeningCache } from "@/shared/lib/cacheEngine";

const MIN_TABLE_LOADING = 600;

export const useScreeningSessions = (isTabActive: boolean = true) => {
  const { notify } = useNotificationStore();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [scheduleId, setScheduleId] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const cacheKey = `screening_sessions_p${page}_l${limit}_sc${scheduleId}_st${status}`;
  const cached = screeningCache.get<{
    sessions: ScreeningSession[];
    pagination: Pagination;
  }>(cacheKey);

  const [sessions, setSessions] = useState<ScreeningSession[]>(
    cached?.sessions || [],
  );
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSessions = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSchedule = scheduleId,
      targetStatus = status,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `screening_sessions_p${targetPage}_l${targetLimit}_sc${targetSchedule}_st${targetStatus}`;
      const currentCached = screeningCache.get<{
        sessions: ScreeningSession[];
        pagination: Pagination;
      }>(currentKey);

      if (currentCached && !force) {
        setSessions(currentCached.sessions);
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
          screeningSessionService.getSessions(
            {
              page: targetPage,
              limit: targetLimit,
              scheduleId: targetSchedule || undefined,
              status: targetStatus || undefined,
            },
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list = Array.isArray(response.data) ? response.data : [];
        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setSessions(list);
        setPagination(meta);
        screeningCache.set(currentKey, { sessions: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat sesi screening");
        }
      } finally {
        setLoading(false);
      }
    },
    [page, limit, scheduleId, status, notify],
  );

  useEffect(() => {
    if (isTabActive) {
      fetchSessions();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchSessions]);

  const deleteSession = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await screeningSessionService.deleteSession(id);
      notify.success(res.meta?.message || "Sesi screening berhasil dihapus!");
      screeningCache.invalidate("screening_sessions_");
      await fetchSessions(1, limit, scheduleId, status, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal menghapus sesi");
      return { success: false };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    sessions,
    loading,
    deletingId,
    scheduleId,
    status,
    pagination,
    setScheduleId: (val: string) => {
      setScheduleId(val);
      setPage(1);
    },
    setStatus: (val: string) => {
      setStatus(val);
      setPage(1);
    },
    setPage,
    setLimit: (val: number) => {
      setLimit(val);
      setPage(1);
    },
    refetchSessions: () => fetchSessions(page, limit, scheduleId, status, true),
    deleteSession,
  };
};

export default useScreeningSessions;
