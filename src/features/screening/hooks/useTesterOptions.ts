import { useState, useEffect } from "react";
import { rbacCache } from "@/shared/lib/cacheEngine";
import { userService } from "@/features/rbac/user/api/userService";
import { User } from "@/features/rbac/user/types/user.types";

const TESTER_CACHE_KEY = "testers_options_list";

export const useTesterOptions = (shouldFetch: boolean = true) => {
  // 1. Cek rbacCache saat inisialisasi awal
  const cached = rbacCache.get<User[]>(TESTER_CACHE_KEY);

  const [testers, setTesters] = useState<User[]>(cached || []);
  const [loading, setLoading] = useState<boolean>(!cached);

  useEffect(() => {
    // Jika tidak diizinkan fetch (misal modal sedang tertutup), skip
    if (!shouldFetch) return;

    // 2. Jika data sudah ada di cache, gunakan data cache tanpa hit network
    const currentCached = rbacCache.get<User[]>(TESTER_CACHE_KEY);
    if (currentCached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTesters(currentCached);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchTesters = async () => {
      setLoading(true);
      try {
        // Ambil list user dengan limit cukup besar (misal 100) khusus role TESTER
        const response = await userService.getUsers(
          { page: 1, limit: 100, search: "" },
          controller.signal,
        );

        const rawList =
          response.data?.users ||
          (Array.isArray(response.data) ? response.data : []);

        // Filter murni user yang memiliki role "TESTER"
        const filteredTesters = rawList.filter(
          (u) =>
            u.role?.toUpperCase() === "TESTER" || u.roleId?.includes("TESTER"),
        );

        setTesters(filteredTesters);

        // Simpan ke rbacCache agar saat modal dibuka lagi tidak fetch ulang
        rbacCache.set(TESTER_CACHE_KEY, filteredTesters);
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          console.error("Gagal memuat opsi tester:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTesters();

    return () => {
      controller.abort();
    };
  }, [shouldFetch]);

  return {
    testers,
    loadingTesters: loading,
    refetchTesters: () => {
      rbacCache.invalidate(TESTER_CACHE_KEY);
      const currentCached = rbacCache.get<User[]>(TESTER_CACHE_KEY);
      if (!currentCached) setLoading(true);
    },
  };
};

export default useTesterOptions;
