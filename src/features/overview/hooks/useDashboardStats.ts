import { useCallback, useEffect, useRef, useState } from "react";
import { DashboardStats } from "../types/dashboard.types";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { screeningCache } from "@/shared/lib/cacheEngine";
import { dashboardService } from "../api/dashboard.service";

const MIN_TABLE_LOADING = 600;

export const useDashboardStats = (isTabActive: boolean = true) => {
  const { notify } = useNotificationStore();
  const cacheKey = "dashboard_overview_stats";
  const cached = screeningCache.get<DashboardStats>(cacheKey);

  const [stats, setStats] = useState<DashboardStats | null>(cached || null);
  const [loading, setLoading] = useState<boolean>(!cached);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStats = useCallback(
    async (force = false) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentCached = screeningCache.get<DashboardStats>(cacheKey);
      if (currentCached && !force) {
        setStats(currentCached);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const minDelayPromise = new Promise((resolve) =>
          setTimeout(resolve, MIN_TABLE_LOADING),
        );

        const [response] = await Promise.all([
          dashboardService.getOverview(abortControllerRef.current.signal),
          minDelayPromise,
        ]);

        if (response.data) {
          setStats(response.data);
          screeningCache.set(cacheKey, response.data);
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
      fetchStats();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchStats]);

  return {
    stats,
    loading,
    refetchStats: () => fetchStats(true),
  };
};

export default useDashboardStats;
