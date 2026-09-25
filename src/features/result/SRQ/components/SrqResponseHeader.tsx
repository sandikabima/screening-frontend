import React, { useMemo } from "react";
import {
  Search,
  RefreshCw,
  FilterX,
  AlertCircle,
  FileSpreadsheet,
  Filter,
  Building2,
  GraduationCap,
  Calendar,
  Users,
  UserCheck,
  Play, // Tambahkan Play icon
} from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { Select, SelectOption } from "@/shared/components/ui/Select";
import { PriorityResult } from "../../ScreeningResult/types/screeningResult.types";
import { Faculty } from "@/features/campus/faculty/types/faculty.types";
import { StudyProgram } from "@/features/campus/study/types/studyProgram.types";
import { Cohort } from "@/features/campus/cohort/types/cohort.types";

interface SrqResponseHeaderProps {
  search: string;
  priorityFilter: PriorityResult | "";
  facultyFilter: string;
  studyProgramFilter: string;
  cohortFilter: string;
  classFilter: string;
  genderFilter: "L" | "P" | "";
  faculties?: Faculty[];
  studyPrograms?: StudyProgram[];
  cohorts?: Cohort[];
  classes?: Faculty[];
  loading?: boolean;
  exportLoading?: boolean;
  onSearchChange: (val: string) => void;
  onPriorityFilterChange: (val: PriorityResult | "") => void;
  onFacultyFilterChange: (val: string) => void;
  onStudyProgramFilterChange: (val: string) => void;
  onCohortFilterChange: (val: string) => void;
  onClassFilterChange: (val: string) => void;
  onGenderFilterChange: (val: "L" | "P" | "") => void;
  onApplyFilters: () => void; // Tombol Tampilkan
  onRefresh: () => void;
  onResetFilters?: () => void;
  onExportExcel?: () => void;
}

const PRIORITY_OPTIONS: SelectOption[] = [
  { value: "", label: "SEMUA PRIORITAS (P1 - P4)" },
  { value: "P1", label: "P1 - MERAH (EMERGENCY)" },
  { value: "P2", label: "P2 - ORANYE (HIGH RISK)" },
  { value: "P3", label: "P3 - KUNING (MONITORING)" },
  { value: "P4", label: "P4 - HIJAU (NORMAL)" },
];

const GENDER_FILTER_OPTIONS: SelectOption[] = [
  { value: "", label: "SEMUA GENDER" },
  { value: "L", label: "LAKI-LAKI (L)" },
  { value: "P", label: "PEREMPUAN (P)" },
];

export const SrqResponseHeader: React.FC<SrqResponseHeaderProps> = ({
  search,
  priorityFilter,
  facultyFilter,
  studyProgramFilter,
  cohortFilter,
  classFilter,
  genderFilter,
  faculties = [],
  studyPrograms = [],
  cohorts = [],
  classes = [],
  loading = false,
  exportLoading = false,
  onSearchChange,
  onPriorityFilterChange,
  onFacultyFilterChange,
  onStudyProgramFilterChange,
  onCohortFilterChange,
  onClassFilterChange,
  onGenderFilterChange,
  onApplyFilters,
  onRefresh,
  onResetFilters,
  onExportExcel,
}) => {
  const facultyOptions = useMemo<SelectOption[]>(() => {
    const list = faculties.map((f) => ({
      value: f.id,
      label: `[${f.code}] ${f.name}`,
    }));
    return [{ value: "", label: "SEMUA FAKULTAS" }, ...list];
  }, [faculties]);

  const spOptions = useMemo<SelectOption[]>(() => {
    const filtered = facultyFilter
      ? studyPrograms.filter((sp) => sp.facultyId === facultyFilter)
      : studyPrograms;
    const list = filtered.map((sp) => ({
      value: sp.id,
      label: `[${sp.degree || "S1"}-${sp.code}] ${sp.name}`,
    }));
    return [{ value: "", label: "SEMUA PRODI" }, ...list];
  }, [studyPrograms, facultyFilter]);

  const cohortOptions = useMemo<SelectOption[]>(() => {
    const list = cohorts.map((c) => ({
      value: c.id,
      label: `${c.name}`,
    }));
    return [{ value: "", label: "SEMUA ANGKATAN" }, ...list];
  }, [cohorts]);

  const classOptions = useMemo<SelectOption[]>(() => {
    const list = classes.map((cl) => ({
      value: cl.id,
      label: `[${cl.code}] ${cl.name}`,
    }));
    return [{ value: "", label: "SEMUA KELAS" }, ...list];
  }, [classes]);

  const hasActiveFilters = Boolean(
    facultyFilter ||
    studyProgramFilter ||
    cohortFilter ||
    classFilter ||
    genderFilter ||
    priorityFilter ||
    search,
  );

  return (
    <div className="bg-black/90 p-4 border border-zinc-900 rounded-lg space-y-3 font-mono select-none">
      {/* Baris Utama: Search, Priority & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-[240px]">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Cari Nama Mahasiswa atau NIM..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-zinc-500" />}
            />
          </div>

          <div className="w-64">
            <Select
              value={priorityFilter}
              onChange={(e) =>
                onPriorityFilterChange(e.target.value as PriorityResult | "")
              }
              options={PRIORITY_OPTIONS}
              leftIcon={<AlertCircle className="h-3.5 w-3.5 text-zinc-400" />}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          {/* Tombol TAMPILKAN DATA (Trigger Fetch) */}
          <Button
            variant="primary"
            size="md"
            onClick={onApplyFilters}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold tracking-wider"
          >
            <Play className="h-4 w-4 mr-1.5 fill-current" />
            <span>TAMPILKAN</span>
          </Button>

          {/* Tombol Export Excel */}
          <Button
            variant="secondary"
            size="md"
            onClick={onExportExcel}
            disabled={loading || exportLoading}
            className="bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-emerald-400 hover:text-emerald-300"
          >
            <FileSpreadsheet
              className={`h-4 w-4 mr-1.5 ${
                exportLoading
                  ? "animate-pulse text-emerald-500"
                  : "text-emerald-400"
              }`}
            />
            <span>{exportLoading ? "EXPORTING..." : "EXPORT EXCEL"}</span>
          </Button>

          {/* Tombol Refresh Data */}
          <Tooltip text="Muat Ulang Matrix">
            <Button
              variant="secondary"
              size="md"
              onClick={onRefresh}
              disabled={loading}
              className="bg-zinc-900 hover:bg-zinc-800 border-zinc-800"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin text-red-500" : "text-zinc-400"
                }`}
              />
            </Button>
          </Tooltip>

          {/* Tombol Reset Filter */}
          {onResetFilters && hasActiveFilters && (
            <Tooltip text="Bersihkan Semua Filter">
              <Button
                variant="secondary"
                size="md"
                onClick={onResetFilters}
                className="bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-red-400"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Baris Sub-Filter Parameter */}
      <div className="pt-3 border-t border-zinc-900/80">
        <div className="flex items-center gap-2 mb-2 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
          <Filter className="h-3 w-3 text-zinc-400" />
          <span>FILTER PARAMETER:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <Select
            value={facultyFilter}
            onChange={(e) => {
              onFacultyFilterChange(e.target.value);
              onStudyProgramFilterChange("");
            }}
            options={facultyOptions}
            leftIcon={<Building2 className="h-3.5 w-3.5 text-zinc-400" />}
          />

          <Select
            value={studyProgramFilter}
            onChange={(e) => onStudyProgramFilterChange(e.target.value)}
            options={spOptions}
            leftIcon={<GraduationCap className="h-3.5 w-3.5 text-zinc-400" />}
          />

          <Select
            value={cohortFilter}
            onChange={(e) => onCohortFilterChange(e.target.value)}
            options={cohortOptions}
            leftIcon={<Calendar className="h-3.5 w-3.5 text-zinc-400" />}
          />

          <Select
            value={classFilter}
            onChange={(e) => onClassFilterChange(e.target.value)}
            options={classOptions}
            leftIcon={<Users className="h-3.5 w-3.5 text-zinc-400" />}
          />

          <Select
            value={genderFilter}
            onChange={(e) =>
              onGenderFilterChange(e.target.value as "L" | "P" | "")
            }
            options={GENDER_FILTER_OPTIONS}
            leftIcon={<UserCheck className="h-3.5 w-3.5 text-zinc-400" />}
          />
        </div>
      </div>
    </div>
  );
};

export default SrqResponseHeader;
