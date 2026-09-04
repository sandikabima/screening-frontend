import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { FollowUpItem, FollowUpStatus } from "../types/followUp.types";
import { screeningCache } from "@/shared/lib/cacheEngine";
import { followUpService } from "../api/followUp.service";

const MIN_TABLE_LOADING = 600;

export const useFollowUps = (isTabActive: boolean = false) => {
  const { notify } = useNotificationStore();
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const cacheKey = `followups_p${page}_l${limit}_s${search}_st${statusFilter}_pr${priorityFilter}`;
  const cached = screeningCache.get<{
    tickets: FollowUpItem[];
    pagination: Pagination;
  }>(cacheKey);

  const [tickets, setTickets] = useState<FollowUpItem[]>(cached?.tickets || []);
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchFollowUps = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSearch = search,
      targetStatus = statusFilter,
      targetPriority = priorityFilter,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `followups_p${targetPage}_l${targetLimit}_s${targetSearch}_st${targetStatus}_pr${targetPriority}`;
      const currentCached = screeningCache.get<{
        tickets: FollowUpItem[];
        pagination: Pagination;
      }>(currentKey);

      if (currentCached && !force) {
        setTickets(currentCached.tickets);
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
          followUpService.getFollowUps(
            {
              page: targetPage,
              limit: targetLimit,
              search: targetSearch,
              status: targetStatus || undefined,
              priorityResult: targetPriority || undefined,
            },
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list =
          response.data?.tickets ||
          (Array.isArray(response.data) ? response.data : []);

        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setTickets(list);
        setPagination(meta);
        screeningCache.set(currentKey, { tickets: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat tiket follow-up");
        }
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, statusFilter, priorityFilter, notify],
  );

  useEffect(() => {
    if (isTabActive) {
      fetchFollowUps();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchFollowUps]);

  const updateTicket = async (
    id: string,
    status: FollowUpStatus,
    notes: string,
  ) => {
    setSubmitting(true);
    try {
      const res = await followUpService.updateFollowUp(id, { status, notes });
      notify.success(
        res.meta?.message || "Status tiket follow-up berhasil diperbarui!",
      );
      screeningCache.invalidate("followups_");
      await fetchFollowUps(
        page,
        limit,
        search,
        statusFilter,
        priorityFilter,
        true,
      );
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal memperbarui tiket follow-up");
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    tickets,
    loading,
    submitting,
    search,
    statusFilter,
    priorityFilter,
    pagination,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    setStatusFilter: (val: string) => {
      setStatusFilter(val);
      setPage(1);
    },
    setPriorityFilter: (val: string) => {
      setPriorityFilter(val);
      setPage(1);
    },
    setPage,
    setLimit: (val: number) => {
      setLimit(val);
      setPage(1);
    },
    refetchFollowUps: () =>
      fetchFollowUps(page, limit, search, statusFilter, priorityFilter, true),
    updateTicket,
  };
};

export default useFollowUps;
