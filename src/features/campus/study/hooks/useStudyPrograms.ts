import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { campusCache } from "@/shared/lib/cacheEngine";
import { studyProgramService } from "../api/studyProgramService";
import {
  CreateStudyProgramPayload,
  StudyProgram,
} from "../types/studyProgram.types";

const MIN_TABLE_LOADING = 600;

export const useStudyPrograms = (isTabActive: boolean = true) => {
  const { notify } = useNotificationStore();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [facultyFilter, setFacultyFilter] = useState<string>("");

  const cacheKey = `study_programs_p${page}_l${limit}_s${search}_f${facultyFilter}`;
  const cached = campusCache.get<{
    studyPrograms: StudyProgram[];
    pagination: Pagination;
  }>(cacheKey);

  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>(
    cached?.studyPrograms || [],
  );
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStudyPrograms = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSearch = search,
      targetFaculty = facultyFilter,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `study_programs_p${targetPage}_l${targetLimit}_s${targetSearch}_f${targetFaculty}`;
      const currentCached = campusCache.get<{
        studyPrograms: StudyProgram[];
        pagination: Pagination;
      }>(currentKey);

      if (currentCached && !force) {
        setStudyPrograms(currentCached.studyPrograms);
        setPagination(currentCached.pagination);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const minDelayPromise = new Promise((resolve) =>
          setTimeout(resolve, MIN_TABLE_LOADING),
        );

        // Hanya sertakan facultyId jika tidak kosong
        const queryParams: any = {
          page: targetPage,
          limit: targetLimit,
          search: targetSearch,
        };

        if (targetFaculty && targetFaculty.trim() !== "") {
          queryParams.facultyId = targetFaculty;
        }

        const [response] = await Promise.all([
          studyProgramService.getStudyPrograms(
            queryParams,
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list =
          response.data?.studyPrograms ||
          (Array.isArray(response.data) ? response.data : []);

        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setStudyPrograms(list);
        setPagination(meta);
        campusCache.set(currentKey, { studyPrograms: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat data program studi");
        }
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, facultyFilter, notify],
  );

  useEffect(() => {
    if (isTabActive) {
      fetchStudyPrograms();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchStudyPrograms]);

  const createStudyProgram = async (payload: CreateStudyProgramPayload) => {
    setSubmitting(true);
    try {
      const res = await studyProgramService.createStudyProgram(payload);
      notify.success(
        res.meta?.message || "Program studi baru berhasil dibuat!",
      );
      campusCache.invalidate("study_programs_");
      await fetchStudyPrograms(1, limit, search, facultyFilter, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const updateStudyProgram = async (
    id: string,
    payload: CreateStudyProgramPayload,
  ) => {
    setSubmitting(true);
    try {
      const res = await studyProgramService.updateStudyProgram(id, payload);
      notify.success(
        res.meta?.message || "Data program studi berhasil diperbarui!",
      );
      campusCache.invalidate("study_programs_");
      await fetchStudyPrograms(page, limit, search, facultyFilter, true);
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
      const res = await studyProgramService.toggleStudyProgramStatus(
        id,
        !currentStatus,
      );
      notify.success(
        res.meta?.message || "Status program studi berhasil diubah!",
      );
      campusCache.invalidate("study_programs_");
      await fetchStudyPrograms(page, limit, search, facultyFilter, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setTogglingId(null);
    }
  };

  const deleteStudyProgram = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await studyProgramService.deleteStudyProgram(id);
      notify.success(
        res.meta?.message || "Data program studi berhasil dihapus!",
      );
      campusCache.invalidate("study_programs_");
      await fetchStudyPrograms(1, limit, search, facultyFilter, true);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message);
      return { success: false };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    studyPrograms,
    loading,
    submitting,
    deletingId,
    togglingId,
    search,
    facultyFilter,
    pagination,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    setFacultyFilter: (val: string) => {
      setFacultyFilter(val);
      setPage(1);
    },
    setPage,
    setLimit: (val: number) => {
      setLimit(val);
      setPage(1);
    },
    refetchStudyPrograms: () =>
      fetchStudyPrograms(page, limit, search, facultyFilter, true),
    createStudyProgram,
    updateStudyProgram,
    toggleStatus,
    deleteStudyProgram,
  };
};

export default useStudyPrograms;
