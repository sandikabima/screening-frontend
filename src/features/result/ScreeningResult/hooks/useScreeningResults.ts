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

export interface FilterParams {
  search?: string;
  priorityFilter?: PriorityResult | "";
  facultyId?: string;
  studyProgramId?: string;
  cohortId?: string;
  classId?: string;
  gender?: "L" | "P" | "";
}

export const useScreeningResults = (isTabActive: boolean = false) => {
  const { notify } = useNotificationStore();
  const [search, setSearch] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityResult | "">("");

  // State Filter Tambahan
  const [facultyFilter, setFacultyFilter] = useState<string>("");
  const [studyProgramFilter, setStudyProgramFilter] = useState<string>("");
  const [cohortFilter, setCohortFilter] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<"L" | "P" | "">("");

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Cache Key Unik Berdasarkan Seluruh Kombinasi Filter
  const cacheKey = `screening_res_p${page}_l${limit}_pr${priorityFilter}_s${search}_f${facultyFilter}_sp${studyProgramFilter}_ch${cohortFilter}_cl${classFilter}_g${genderFilter}`;
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
      targetFaculty = facultyFilter,
      targetStudyProgram = studyProgramFilter,
      targetCohort = cohortFilter,
      targetClass = classFilter,
      targetGender = genderFilter,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `screening_res_p${targetPage}_l${targetLimit}_pr${targetPriority}_s${targetSearch}_f${targetFaculty}_sp${targetStudyProgram}_ch${targetCohort}_cl${targetClass}_g${targetGender}`;
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
              priorityResult: targetPriority || undefined,
              search: targetSearch || undefined,
              facultyId: targetFaculty || undefined,
              studyProgramId: targetStudyProgram || undefined,
              cohortId: targetCohort || undefined,
              classId: targetClass || undefined,
              gender: targetGender || undefined,
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
    [
      page,
      limit,
      priorityFilter,
      search,
      facultyFilter,
      studyProgramFilter,
      cohortFilter,
      classFilter,
      genderFilter,
      notify,
    ],
  );

  useEffect(() => {
    if (isTabActive) {
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

  // 🟢 FUNGSI KHUSUS EKSPOR: Mengambil SELURUH DATA dari server tanpa terpotong pagination
  const fetchAllResultsForExport = async (overrideFilters?: FilterParams) => {
    try {
      const activeSearch =
        overrideFilters?.search !== undefined ? overrideFilters.search : search;
      const activePriority =
        overrideFilters?.priorityFilter !== undefined
          ? overrideFilters.priorityFilter
          : priorityFilter;
      const activeFaculty =
        overrideFilters?.facultyId !== undefined
          ? overrideFilters.facultyId
          : facultyFilter;
      const activeStudyProgram =
        overrideFilters?.studyProgramId !== undefined
          ? overrideFilters.studyProgramId
          : studyProgramFilter;
      const activeCohort =
        overrideFilters?.cohortId !== undefined
          ? overrideFilters.cohortId
          : cohortFilter;
      const activeClass =
        overrideFilters?.classId !== undefined
          ? overrideFilters.classId
          : classFilter;
      const activeGender =
        overrideFilters?.gender !== undefined
          ? overrideFilters.gender
          : genderFilter;

      // 1. Tembak API ringan (limit 1) untuk mendapatkan info TOTAL record aktual dari server
      const checkTotalResponse = await screeningResultService.getResults({
        page: 1,
        limit: 1,
        priorityResult: activePriority || undefined,
        search: activeSearch || undefined,
        facultyId: activeFaculty || undefined,
        studyProgramId: activeStudyProgram || undefined,
        cohortId: activeCohort || undefined,
        classId: activeClass || undefined,
        gender: activeGender || undefined,
      });

      const totalActualRecords =
        checkTotalResponse.meta?.pagination?.total || 9999;

      // 2. Tembak API utama dengan limit sama dengan total data
      const fullResponse = await screeningResultService.getResults({
        page: 1,
        limit: totalActualRecords > 0 ? totalActualRecords : 9999,
        priorityResult: activePriority || undefined,
        search: activeSearch || undefined,
        facultyId: activeFaculty || undefined,
        studyProgramId: activeStudyProgram || undefined,
        cohortId: activeCohort || undefined,
        classId: activeClass || undefined,
        gender: activeGender || undefined,
      });

      const list =
        fullResponse.data?.results ||
        (Array.isArray(fullResponse.data) ? fullResponse.data : []);

      return list;
    } catch (err: any) {
      throw err;
    }
  };

  const applyFilters = (filters: FilterParams) => {
    if (filters.search !== undefined) setSearch(filters.search);
    if (filters.priorityFilter !== undefined)
      setPriorityFilter(filters.priorityFilter);
    if (filters.facultyId !== undefined) setFacultyFilter(filters.facultyId);
    if (filters.studyProgramId !== undefined)
      setStudyProgramFilter(filters.studyProgramId);
    if (filters.cohortId !== undefined) setCohortFilter(filters.cohortId);
    if (filters.classId !== undefined) setClassFilter(filters.classId);
    if (filters.gender !== undefined) setGenderFilter(filters.gender);
    setPage(1);
  };

  return {
    results,
    loading,
    detailData,
    loadingDetail,
    search,
    priorityFilter,
    facultyFilter,
    studyProgramFilter,
    cohortFilter,
    classFilter,
    genderFilter,
    pagination,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    setPriorityFilter: (val: PriorityResult | "") => {
      setPriorityFilter(val);
      setPage(1);
    },
    setFacultyFilter,
    setStudyProgramFilter,
    setCohortFilter,
    setClassFilter,
    setGenderFilter,
    applyFilters,
    setPage,
    setLimit: (val: number) => {
      setLimit(val);
      setPage(1);
    },
    refetchResults: () =>
      fetchResults(
        page,
        limit,
        priorityFilter,
        search,
        facultyFilter,
        studyProgramFilter,
        cohortFilter,
        classFilter,
        genderFilter,
        true,
      ),
    fetchResultDetail,
    fetchAllResultsForExport, // 🟢 Export fungsi baru
    clearDetail: () => setDetailData(null),
  };
};

export default useScreeningResults;
