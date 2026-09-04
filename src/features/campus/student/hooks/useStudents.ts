import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/shared/types/api";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { campusCache } from "@/shared/lib/cacheEngine";
import { studentService } from "../api/studentService";
import {
  CreateStudentPayload,
  Student,
  UpdateStudentPayload,
} from "../types/student.types";

const MIN_TABLE_LOADING = 600;

export const useStudents = (isTabActive: boolean = true) => {
  const { notify } = useNotificationStore();

  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [facultyFilter, setFacultyFilter] = useState<string>("");
  const [studyProgramFilter, setStudyProgramFilter] = useState<string>("");
  const [cohortFilter, setCohortFilter] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<"L" | "P" | "">("");

  const cacheKey = `students_p${page}_l${limit}_s${search}_f${facultyFilter}_sp${studyProgramFilter}_c${cohortFilter}_cl${classFilter}_g${genderFilter}`;
  const cached = campusCache.get<{
    students: Student[];
    pagination: Pagination;
  }>(cacheKey);

  const [students, setStudents] = useState<Student[]>(cached?.students || []);
  const [pagination, setPagination] = useState<Pagination>(
    cached?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStudents = useCallback(
    async (
      targetPage = page,
      targetLimit = limit,
      targetSearch = search,
      targetFaculty = facultyFilter,
      targetSP = studyProgramFilter,
      targetCohort = cohortFilter,
      targetClass = classFilter,
      targetGender = genderFilter,
      force = false,
    ) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const currentKey = `students_p${targetPage}_l${targetLimit}_s${targetSearch}_f${targetFaculty}_sp${targetSP}_c${targetCohort}_cl${targetClass}_g${targetGender}`;
      const currentCached = campusCache.get<{
        students: Student[];
        pagination: Pagination;
      }>(currentKey);

      if (currentCached && !force) {
        setStudents(currentCached.students);
        setPagination(currentCached.pagination);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const minDelayPromise = new Promise((resolve) =>
          setTimeout(resolve, MIN_TABLE_LOADING),
        );

        const queryParams: any = {
          page: targetPage,
          limit: targetLimit,
          search: targetSearch,
        };

        if (targetFaculty?.trim()) queryParams.facultyId = targetFaculty;
        if (targetSP?.trim()) queryParams.studyProgramId = targetSP;
        if (targetCohort?.trim()) queryParams.cohortId = targetCohort;
        if (targetClass?.trim()) queryParams.classId = targetClass;
        if (targetGender) queryParams.gender = targetGender;

        const [response] = await Promise.all([
          studentService.getStudents(
            queryParams,
            abortControllerRef.current.signal,
          ),
          minDelayPromise,
        ]);

        const list =
          (response.data as any)?.students ||
          (Array.isArray(response.data) ? response.data : []);

        const meta = response.meta?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: list.length,
          totalPages: 1,
        };

        setStudents(list);
        setPagination(meta);
        campusCache.set(currentKey, { students: list, pagination: meta });
      } catch (err: any) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          notify.error(err.message || "Gagal memuat data mahasiswa");
        }
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      limit,
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
      fetchStudents();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [isTabActive, fetchStudents]);

  const createStudent = async (payload: CreateStudentPayload) => {
    setSubmitting(true);
    try {
      const res = await studentService.registerStudent(payload);
      notify.success(res.meta?.message || "Mahasiswa baru berhasil terdaftar!");
      campusCache.invalidate("students_");
      await fetchStudents(
        1,
        limit,
        search,
        facultyFilter,
        studyProgramFilter,
        cohortFilter,
        classFilter,
        genderFilter,
        true,
      );
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal mendaftarkan mahasiswa");
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const updateStudent = async (id: string, payload: UpdateStudentPayload) => {
    setSubmitting(true);
    try {
      const res = await studentService.updateStudent(id, payload);
      notify.success(
        res.meta?.message || "Data mahasiswa berhasil diperbarui!",
      );
      campusCache.invalidate("students_");
      await fetchStudents(
        page,
        limit,
        search,
        facultyFilter,
        studyProgramFilter,
        cohortFilter,
        classFilter,
        genderFilter,
        true,
      );
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal memperbarui data mahasiswa");
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStudent = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await studentService.deleteStudent(id);
      notify.success(res.meta?.message || "Data mahasiswa berhasil dihapus!");
      campusCache.invalidate("students_");
      await fetchStudents(
        1,
        limit,
        search,
        facultyFilter,
        studyProgramFilter,
        cohortFilter,
        classFilter,
        genderFilter,
        true,
      );
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal menghapus data mahasiswa");
      return { success: false };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    students,
    loading,
    submitting,
    deletingId,
    search,
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
    setFacultyFilter: (val: string) => {
      setFacultyFilter(val);
      setPage(1);
    },
    setStudyProgramFilter: (val: string) => {
      setStudyProgramFilter(val);
      setPage(1);
    },
    setCohortFilter: (val: string) => {
      setCohortFilter(val);
      setPage(1);
    },
    setClassFilter: (val: string) => {
      setClassFilter(val);
      setPage(1);
    },
    setGenderFilter: (val: "L" | "P" | "") => {
      setGenderFilter(val);
      setPage(1);
    },
    setPage,
    setLimit: (val: number) => {
      setLimit(val);
      setPage(1);
    },
    refetchStudents: () =>
      fetchStudents(
        page,
        limit,
        search,
        facultyFilter,
        studyProgramFilter,
        cohortFilter,
        classFilter,
        genderFilter,
        true,
      ),
    createStudent,
    updateStudent,
    deleteStudent,
  };
};

export default useStudents;
