import { useCallback, useEffect, useRef, useState } from "react";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { campusCache } from "@/shared/lib/cacheEngine";
import { questionService } from "../api/questionService";
import { Question, UpdateQuestionTextPayload } from "../types/question.types";

const MIN_TABLE_LOADING = 600;

export const useQuestions = (
  initialCategory: "SRQ" | "INTI" | "" = "",
  isTabActive: boolean = true,
) => {
  const { notify } = useNotificationStore();
  const [search, setSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [codeFilter, setCodeFilter] = useState<string>("");

  const cacheKey = `questions_cat${categoryFilter}_s${search}_c${codeFilter}`;
  const cached = campusCache.get<Question[]>(cacheKey);

  const [questions, setQuestions] = useState<Question[]>(cached || []);
  const [loading, setLoading] = useState<boolean>(!cached);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchQuestions = useCallback(
    async (
      targetSearch = search,
      targetCategory = categoryFilter,
      targetCode = codeFilter,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `questions_cat${targetCategory}_s${targetSearch}_c${targetCode}`;
      const currentCached = campusCache.get<Question[]>(currentKey);

      if (currentCached && !force) {
        setQuestions(currentCached);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const minDelayPromise = new Promise((resolve) =>
          setTimeout(resolve, MIN_TABLE_LOADING),
        );

        const queryParams: any = { search: targetSearch };
        if (targetCategory?.trim()) queryParams.category = targetCategory;
        if (targetCode?.trim()) queryParams.code = targetCode;

        const [response] = await Promise.all([
          questionService.getQuestions(
            queryParams,
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list = Array.isArray(response.data) ? response.data : [];

        setQuestions(list);
        campusCache.set(currentKey, list);
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat data bank soal");
        }
      } finally {
        setLoading(false);
      }
    },
    [search, categoryFilter, codeFilter, notify],
  );

  useEffect(() => {
    if (isTabActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchQuestions();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchQuestions]);

  const updateQuestionText = async (
    id: string,
    payload: UpdateQuestionTextPayload,
  ) => {
    setSubmitting(true);
    try {
      const res = await questionService.updateQuestionText(id, payload);
      notify.success(
        res.meta?.message || "Teks pertanyaan berhasil diperbarui!",
      );
      campusCache.invalidate("questions_");
      await fetchQuestions(search, categoryFilter, codeFilter, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      const res = await questionService.toggleQuestionStatus(
        id,
        !currentStatus,
      );
      notify.success(res.meta?.message || "Status pertanyaan berhasil diubah!");
      campusCache.invalidate("questions_");
      await fetchQuestions(search, categoryFilter, codeFilter, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setTogglingId(null);
    }
  };

  return {
    questions,
    loading,
    submitting,
    togglingId,
    search,
    categoryFilter,
    codeFilter,
    setSearch: (val: string) => setSearch(val),
    setCategoryFilter: (val: string) => setCategoryFilter(val),
    setCodeFilter: (val: string) => setCodeFilter(val),
    refetchQuestions: () =>
      fetchQuestions(search, categoryFilter, codeFilter, true),
    updateQuestionText,
    toggleStatus,
  };
};

export default useQuestions;
