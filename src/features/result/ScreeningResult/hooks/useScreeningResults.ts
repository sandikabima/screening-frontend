import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { rbacCache } from "@/shared/lib/cacheEngine";
import {
  PriorityResult,
  ScreeningResult,
  ScreeningResultDetail,
} from "../types/screeningResult.types";
import { screeningResultService } from "../api/screeningResult.service";

const MIN_TABLE_LOADING = 600;

export const useScreeningResults = (isTabActive: boolean = false) => {
  const { notify } = useNotificationStore();
  const [search, setSearch] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityResult | "">("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const cacheKey = `screening_res_p${page}_l${limit}_pr${priorityFilter}_s${search}`;
  const cached = rbacCache.get<{
    results: ScreeningResult[];
    pagination: Pagination;
  }>(cacheKey);

  const [results, setResults] = useState<ScreeningResult[]>(
    cached?.results || [],
  );
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [detailData, setDetailData] = useState<ScreeningResultDetail | null>(
    null,
  );
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const detailAbortRef = useRef<AbortController | null>(null);

  const fetchResults = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetPriority = priorityFilter,
      targetSearch = search,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `screening_res_p${targetPage}_l${targetLimit}_pr${targetPriority}_s${targetSearch}`;
      const currentCached = rbacCache.get<{
        results: ScreeningResult[];
        pagination: Pagination;
      }>(currentKey);

      if (currentCached && !force) {
        setResults(currentCached.results);
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
          screeningResultService.getResults(
            {
              page: targetPage,
              limit: targetLimit,
              priorityResult: targetPriority,
              search: targetSearch,
            },
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list =
          response.data?.results ||
          (Array.isArray(response.data) ? response.data : []);
        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setResults(list);
        setPagination(meta);
        rbacCache.set(currentKey, { results: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat data hasil screening");
        }
      } finally {
        setLoading(false);
      }
    },
    [page, limit, priorityFilter, search, notify],
  );

  useEffect(() => {
    if (isTabActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchResults();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchResults]);

  const fetchResultDetail = async (id: string) => {
    if (detailAbortRef.current) detailAbortRef.current.abort();
    detailAbortRef.current = new AbortController();

    setLoadingDetail(true);
    setDetailData(null);
    try {
      const response = await screeningResultService.getResultById(
        id,
        detailAbortRef.current.signal,
      );
      setDetailData(response.data);
    } catch (err: any) {
      if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
        notify.error(
          err.message || "Gagal mengambil rincian jawaban mahasiswa",
        );
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  return {
    results,
    loading,
    detailData,
    loadingDetail,
    search,
    priorityFilter,
    pagination,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    setPriorityFilter: (val: PriorityResult | "") => {
      setPriorityFilter(val);
      setPage(1);
    },
    setPage,
    setLimit: (val: number) => {
      setLimit(val);
      setPage(1);
    },
    refetchResults: () =>
      fetchResults(page, limit, priorityFilter, search, true),
    fetchResultDetail,
    clearDetail: () => setDetailData(null),
  };
};

export default useScreeningResults;
