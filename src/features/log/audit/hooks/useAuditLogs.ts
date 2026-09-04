import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { auditCache } from "@/shared/lib/cacheEngine";
import { formatDate } from "@/shared/utils/formatDate";
import { auditService } from "../api/auditService";
import { AuditLogItem, ListAuditLogsParams } from "../types/audit.types";

const MIN_TABLE_LOADING = 600;

// Helper untuk tanggal N hari yang lalu
const getPastDateIso = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return formatDate(date, { variant: "ISO_DATE" });
};

// Helper untuk tanggal N hari ke depan (+1 hari untuk mengompensasi offset UTC+7)
const getFutureDateIso = (daysAhead: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return formatDate(date, { variant: "ISO_DATE" });
};

export const useAuditLogs = (isTabActive: boolean = true) => {
  const { notify } = useNotificationStore();

  // Range Default: 7 Hari lalu s/d Besok (+1 Hari)
  const defaultStartDate = getPastDateIso(7); // 7 hari lalu
  const defaultEndDate = getFutureDateIso(1); // Besok (+1 hari)

  // State Filter & Pagination
  const [search, setSearch] = useState<string>("");
  const [moduleFilter, setModuleFilter] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const cacheKey = `audit_p${page}_l${limit}_s${search}_m${moduleFilter}_a${actionFilter}_sd${startDate}_ed${endDate}_so${sortOrder}`;
  const cached = auditCache.get<{
    auditLogs: AuditLogItem[];
    pagination: Pagination;
  }>(cacheKey);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(
    cached?.auditLogs || [],
  );
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAuditLogs = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSearch = search,
      targetModule = moduleFilter,
      targetAction = actionFilter,
      targetStartDate = startDate,
      targetEndDate = endDate,
      targetSortOrder = sortOrder,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `audit_p${targetPage}_l${targetLimit}_s${targetSearch}_m${targetModule}_a${targetAction}_sd${targetStartDate}_ed${targetEndDate}_so${targetSortOrder}`;
      const currentCached = auditCache.get<{
        auditLogs: AuditLogItem[];
        pagination: Pagination;
      }>(currentKey);

      if (currentCached && !force) {
        setAuditLogs(currentCached.auditLogs);
        setPagination(currentCached.pagination);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const minDelayPromise = new Promise((resolve) =>
          setTimeout(resolve, MIN_TABLE_LOADING),
        );

        const params: ListAuditLogsParams = {
          page: targetPage,
          limit: targetLimit,
          search: targetSearch,
          module: targetModule,
          action: targetAction,
          startDate: targetStartDate,
          endDate: targetEndDate,
          sortOrder: targetSortOrder,
        };

        const [response] = await Promise.all([
          auditService.getAuditLogs(params, abortControllerRef.current.signal),
          minDelayPromise,
        ]);

        const list = Array.isArray(response.data) ? response.data : [];

        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setAuditLogs(list);
        setPagination(meta);
        auditCache.set(currentKey, { auditLogs: list, pagination: meta });
      } catch (err: unknown) {
        const errorObj = err as {
          name?: string;
          code?: string;
          message?: string;
        };
        if (
          errorObj.name !== "CanceledError" &&
          errorObj.code !== "ERR_CANCELED"
        ) {
          notify.error(
            errorObj.message || "Gagal memuat rekam jejak audit sistem",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      limit,
      search,
      moduleFilter,
      actionFilter,
      startDate,
      endDate,
      sortOrder,
      notify,
    ],
  );

  useEffect(() => {
    if (isTabActive) {
      fetchAuditLogs();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [
    isTabActive,
    page,
    limit,
    search,
    moduleFilter,
    actionFilter,
    startDate,
    endDate,
    sortOrder,
    fetchAuditLogs,
  ]);

  const resetFilters = () => {
    setSearch("");
    setModuleFilter("");
    setActionFilter("");
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setSortOrder("desc");
    setPage(1);
    auditCache.invalidate("audit_");
  };

  return {
    auditLogs,
    loading,
    search,
    moduleFilter,
    actionFilter,
    startDate,
    endDate,
    sortOrder,
    pagination,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    setModuleFilter: (val: string) => {
      setModuleFilter(val);
      setPage(1);
    },
    setActionFilter: (val: string) => {
      setActionFilter(val);
      setPage(1);
    },
    setStartDate: (val: string) => {
      setStartDate(val);
      setPage(1);
    },
    setEndDate: (val: string) => {
      setEndDate(val);
      setPage(1);
    },
    setSortOrder: (val: "asc" | "desc") => {
      setSortOrder(val);
      setPage(1);
    },
    setPage,
    setLimit: (val: number) => {
      setLimit(val);
      setPage(1);
    },
    resetFilters,
    refetchAuditLogs: () =>
      fetchAuditLogs(
        page,
        limit,
        search,
        moduleFilter,
        actionFilter,
        startDate,
        endDate,
        sortOrder,
        true,
      ),
  };
};

export default useAuditLogs;
