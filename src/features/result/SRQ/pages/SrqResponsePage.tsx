import React, { useState } from "react";
import useScreeningResults from "../../ScreeningResult/hooks/useScreeningResults";

import SrqResponseHeader from "../components/SrqResponseHeader";
import SrqResponseTable from "../components/SrqResponseTable";
import { Pagination } from "@/shared/components/ui/Pagination";
import {
  ScreeningResultDetail,
  PriorityResult,
} from "../../ScreeningResult/types/screeningResult.types";
import useFaculties from "@/features/campus/faculty/hooks/useFaculties";
import useStudyPrograms from "@/features/campus/study/hooks/useStudyPrograms";
import useCohorts from "@/features/campus/cohort/hooks/useCohorts";
import useClasses from "@/features/campus/class/hooks/useClasses";

// 🟢 Import Exporter Excel dan Notification Store

import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { exportScreeningResultsToExcel } from "@/shared/utils/screeningResultExcelExporter";

export const SrqResponsePage: React.FC = () => {
  const { notify } = useNotificationStore();
  const [exportLoading, setExportLoading] = useState(false);

  // 1. Panggil Hook Utama Asli
  const {
    results,
    loading,
    search,
    priorityFilter,
    facultyFilter: activeFaculty,
    studyProgramFilter: activeStudyProgram,
    cohortFilter: activeCohort,
    classFilter: activeClass,
    genderFilter: activeGender,
    pagination,
    applyFilters,
    setPage,
    setLimit,
    refetchResults,
    fetchAllResultsForExport, // 🟢 Fungsi fetch khusus untuk ekspor
  } = useScreeningResults(true);

  // 2. Fetch Data Master untuk Filter Select
  const { faculties = [] } = useFaculties();
  const { studyPrograms = [] } = useStudyPrograms();
  const { cohorts = [] } = useCohorts();
  const { classes = [] } = useClasses();

  // 3. State Form Lokal Khusus Halaman Matriks
  const [tempSearch, setTempSearch] = useState(search);
  const [tempPriority, setTempPriority] = useState<PriorityResult | "">(
    priorityFilter,
  );
  const [facultyFilter, setFacultyFilter] = useState(activeFaculty || "");
  const [studyProgramFilter, setStudyProgramFilter] = useState(
    activeStudyProgram || "",
  );
  const [cohortFilter, setCohortFilter] = useState(activeCohort || "");
  const [classFilter, setClassFilter] = useState(activeClass || "");
  const [genderFilter, setGenderFilter] = useState<"L" | "P" | "">(
    activeGender || "",
  );

  // 4. Eksekusi Tampilkan Data (Panggil API saat tombol diklik)
  const handleApplyFilters = () => {
    applyFilters({
      search: tempSearch,
      priorityFilter: tempPriority,
      facultyId: facultyFilter,
      studyProgramId: studyProgramFilter,
      cohortId: cohortFilter,
      classId: classFilter,
      gender: genderFilter,
    });
  };

  // 5. Reset Semua Filter
  const handleResetFilters = () => {
    setTempSearch("");
    setTempPriority("");
    setFacultyFilter("");
    setStudyProgramFilter("");
    setCohortFilter("");
    setClassFilter("");
    setGenderFilter("");

    applyFilters({
      search: "",
      priorityFilter: "",
      facultyId: "",
      studyProgramId: "",
      cohortId: "",
      classId: "",
      gender: "",
    });
  };

  // 🟢 6. Handler Ekspor Seluruh Data ke Excel
  const handleExportExcel = async () => {
    try {
      setExportLoading(true);
      notify.info("Sedang mengambil seluruh data dari server...");

      // Mengirimkan kombinasi filter yang saat ini terpilih di layar
      const allData = await fetchAllResultsForExport({
        search: tempSearch,
        priorityFilter: tempPriority,
        facultyId: facultyFilter,
        studyProgramId: studyProgramFilter,
        cohortId: cohortFilter,
        classId: classFilter,
        gender: genderFilter,
      });

      if (!allData || allData.length === 0) {
        notify.error("Tidak ada data hasil screening yang ditemukan.");
        return;
      }

      // Ekspor seluruh data ke file Excel
      exportScreeningResultsToExcel(
        allData as ScreeningResultDetail[],
        "Laporan_Matriks_SRQ20_Lengkap",
      );

      notify.success(
        `Berhasil mengunduh seluruh ${allData.length} data ke Excel!`,
      );
    } catch (err: any) {
      notify.error("Gagal mengekspor seluruh data ke Excel.");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      {/* Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            MATRIKS RESPONS SRQ-20 MAHASISWA
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Inspeksi Langsung Sebaran 20 Item Pertanyaan SRQ Seluruh Sesi
            Screening
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-black border border-zinc-900 rounded-lg text-xs">
            <span className="text-zinc-500 uppercase">TOTAL AUDIT: </span>
            <strong className="text-white ml-1">
              {pagination?.total || 0} Mahasiswa
            </strong>
          </div>
        </div>
      </div>

      {/* Control Header */}
      <SrqResponseHeader
        search={tempSearch}
        priorityFilter={tempPriority}
        facultyFilter={facultyFilter}
        studyProgramFilter={studyProgramFilter}
        cohortFilter={cohortFilter}
        classFilter={classFilter}
        genderFilter={genderFilter}
        faculties={faculties}
        studyPrograms={studyPrograms}
        cohorts={cohorts}
        classes={classes}
        loading={loading}
        exportLoading={exportLoading}
        onSearchChange={setTempSearch}
        onPriorityFilterChange={setTempPriority}
        onFacultyFilterChange={setFacultyFilter}
        onStudyProgramFilterChange={setStudyProgramFilter}
        onCohortFilterChange={setCohortFilter}
        onClassFilterChange={setClassFilter}
        onGenderFilterChange={setGenderFilter}
        onApplyFilters={handleApplyFilters}
        onRefresh={refetchResults}
        onResetFilters={handleResetFilters}
        onExportExcel={handleExportExcel}
      />

      {/* Table Matriks */}
      <SrqResponseTable
        results={results as ScreeningResultDetail[]}
        loading={loading}
      />

      {/* Pagination Footer */}
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default SrqResponsePage;
