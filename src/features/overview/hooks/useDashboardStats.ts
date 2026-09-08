import { useCallback, useEffect, useRef, useState } from "react";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { campusCache } from "@/shared/lib/cacheEngine";
import { DashboardStats } from "../types/dashboard.types";
import { dashboardService } from "../api/dashboard.service";

const MIN_DASHBOARD_LOADING = 400;
const CACHE_KEY = "dashboard_overview_stats";

export const useDashboardStats = (isTabActive: boolean = true) => {
  const { notify } = useNotificationStore();

  const cached = campusCache.get<DashboardStats>(CACHE_KEY);

  const [data, setData] = useState<DashboardStats | null>(cached || null);
  const [loading, setLoading] = useState<boolean>(!cached);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDashboardStats = useCallback(
    async (force = false) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      if (force) {
        campusCache.invalidate(CACHE_KEY);
      } else {
        const currentCached = campusCache.get<DashboardStats>(CACHE_KEY);
        if (currentCached) {
          setData(currentCached);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      try {
        const minDelayPromise = new Promise((resolve) =>
          setTimeout(resolve, MIN_DASHBOARD_LOADING),
        );

        const [response] = await Promise.all([
          dashboardService.getOverview(abortControllerRef.current.signal),
          minDelayPromise,
        ]);

        // Tangani unwrapping data envelope dari response Axios
        const rawPayload: any = response;
        const statsData: DashboardStats = rawPayload?.data || rawPayload;

        if (statsData) {
          setData(statsData);
          campusCache.set(CACHE_KEY, statsData);
        }
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat statistik dashboard");
        }
      } finally {
        setLoading(false);
      }
    },
    [notify],
  );

  useEffect(() => {
    if (isTabActive) {
      fetchDashboardStats(true);
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchDashboardStats]);

  return {
    data,
    loading,
    refetchStats: () => fetchDashboardStats(true),
  };
};

export default useDashboardStats;
