import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { sessionCache } from "@/shared/lib/cacheEngine";
import { sessionService } from "../api/sessionService";
import { Session, SessionStatusFilter } from "../types/session.types";

const MIN_TABLE_LOADING = 600;

export const useSessions = (isTabActive: boolean = false) => {
  const { notify } = useNotificationStore();
  const [statusFilter, setStatusFilter] = useState<SessionStatusFilter>("all");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const cacheKey = `sessions_p${page}_l${limit}_s${statusFilter}`;
  const cached = sessionCache.get<{
    sessions: Session[];
    pagination: Pagination;
  }>(cacheKey);

  const [sessions, setSessions] = useState<Session[]>(cached?.sessions || []);
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokingOthers, setRevokingOthers] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSessions = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetStatus = statusFilter,
      force = false,
    ) => {
      // 1. Abort request sebelumnya jika ada request baru
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `sessions_p${targetPage}_l${targetLimit}_s${targetStatus}`;
      const currentCached = sessionCache.get<{
        sessions: Session[];
        pagination: Pagination;
      }>(currentKey);

      // 2. Cache Hit -> Langsung tampilkan dari sessionCache
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
          sessionService.getSessions(
            { page: targetPage, limit: targetLimit, status: targetStatus },
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list =
          // response.data?.sessions ||
          Array.isArray(response.data) ? response.data : [];

        // Parsing pagination dari response.meta atau response.pagination
        const meta: Pagination = response.meta?.pagination ||
          (response as any).pagination || {
            page: targetPage,
            limit: targetLimit,
            total: list.length,
            totalPages: Math.ceil(list.length / targetLimit) || 1,
          };

        setSessions(list);
        setPagination(meta);
        sessionCache.set(currentKey, { sessions: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat daftar sesi perangkat");
        }
      } finally {
        setLoading(false);
      }
    },
    [page, limit, statusFilter, notify],
  );

  useEffect(() => {
    if (isTabActive) {
      fetchSessions(page, limit, statusFilter);
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchSessions, page, limit, statusFilter]);

  const revokeSession = async (id: string) => {
    setRevokingId(id);
    try {
      const res = await sessionService.revokeSession(id);
      notify.success(res.meta?.message || "Akses perangkat berhasil diputus!");
      sessionCache.invalidate("sessions_");
      await fetchSessions(page, limit, statusFilter, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal memutus akses perangkat");
      return { success: false };
    } finally {
      setRevokingId(null);
    }
  };

  const revokeOtherSessions = async () => {
    setRevokingOthers(true);
    try {
      const res = await sessionService.revokeOtherSessions();
      notify.success(
        res.meta?.message || "Semua perangkat lain berhasil di-logout!",
      );
      sessionCache.invalidate("sessions_");
      await fetchSessions(1, limit, statusFilter, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal memutus sesi perangkat lain");
      return { success: false };
    } finally {
      setRevokingOthers(false);
    }
  };

  const handleSetPage = (newPage: number) => {
    setPage(newPage);
    fetchSessions(newPage, limit, statusFilter);
  };

  const handleSetLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    fetchSessions(1, newLimit, statusFilter);
  };

  const handleSetStatusFilter = (val: SessionStatusFilter) => {
    setStatusFilter(val);
    setPage(1);
    fetchSessions(1, limit, val);
  };

  return {
    sessions,
    loading,
    revokingId,
    revokingOthers,
    statusFilter,
    pagination,
    setStatusFilter: handleSetStatusFilter,
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    refetchSessions: () => fetchSessions(page, limit, statusFilter, true),
    revokeSession,
    revokeOtherSessions,
  };
};

export default useSessions;
