import { useCallback, useEffect, useRef, useState } from "react";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { campusCache } from "@/shared/lib/cacheEngine";
import { srqCutOffService } from "../api/srqCutOffService";
import { SrqCutOff, UpdateSrqCutOffPayload } from "../types/srqCutOff.types";

const MIN_FORM_LOADING = 600;
const CACHE_KEY = "srq_cutoff_config";

export const useSrqCutOff = (isTabActive: boolean = true) => {
  const { notify } = useNotificationStore();

  const cached = campusCache.get<SrqCutOff>(CACHE_KEY);

  const [cutOff, setCutOff] = useState<SrqCutOff | null>(cached || null);
  const [loading, setLoading] = useState<boolean>(!cached);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCutOff = useCallback(
    async (force = false) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentCached = campusCache.get<SrqCutOff>(CACHE_KEY);

      if (currentCached && !force) {
        setCutOff(currentCached);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const minDelayPromise = new Promise((resolve) =>
          setTimeout(resolve, MIN_FORM_LOADING),
        );

        const [response] = await Promise.all([
          srqCutOffService.getCutOff(abortControllerRef.current.signal),
          minDelayPromise,
        ]);

        const data = response.data || null;

        setCutOff(data);
        if (data) {
          campusCache.set(CACHE_KEY, data);
        }
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat konfigurasi Cut-Off SRQ");
        }
      } finally {
        setLoading(false);
      }
    },
    [notify],
  );

  useEffect(() => {
    if (isTabActive) {
      fetchCutOff();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchCutOff]);

  const updateCutOff = async (payload: UpdateSrqCutOffPayload) => {
    if (!cutOff?.id) {
      notify.error("Data Cut-Off tidak valid untuk diperbarui");
      return { success: false };
    }

    setSubmitting(true);
    try {
      const res = await srqCutOffService.updateCutOff(cutOff.id, payload);
      notify.success(
        res.meta?.message || "Konfigurasi Cut-Off SRQ berhasil diperbarui!",
      );
      campusCache.invalidate("srq_cutoff_");
      await fetchCutOff(true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal memperbarui Cut-Off SRQ");
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    cutOff,
    loading,
    submitting,
    refetchCutOff: () => fetchCutOff(true),
    updateCutOff,
  };
};

export default useSrqCutOff;
