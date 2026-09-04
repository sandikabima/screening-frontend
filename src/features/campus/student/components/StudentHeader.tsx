import React, { useMemo } from "react";
import {
  Search,
  RefreshCw,
  FilterX,
  UserPlus,
  Filter,
  Building2,
  GraduationCap,
  Calendar,
  Users,
  UserCheck,
} from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { Select, SelectOption } from "@/shared/components/ui/Select";
import { Faculty } from "../../faculty/types/faculty.types";
import { StudyProgram } from "../../study/types/studyProgram.types";
import { ClassEntity } from "../../class/types/class.types";
import { Cohort } from "../../cohort/types/cohort.types";
import { HasPermission } from "@/features/auth/components/HasPermission";

interface StudentHeaderProps {
  search: string;
  facultyFilter: string;
  studyProgramFilter: string;
  cohortFilter: string;
  classFilter: string;
  genderFilter: "L" | "P" | "";
  faculties: Faculty[];
  studyPrograms: StudyProgram[];
  cohorts: Cohort[];
  classes?: ClassEntity[];
  loading?: boolean;
  onSearchChange: (val: string) => void;
  onFacultyFilterChange: (val: string) => void;
  onStudyProgramFilterChange: (val: string) => void;
  onCohortFilterChange: (val: string) => void;
  onClassFilterChange: (val: string) => void;
  onGenderFilterChange: (val: "L" | "P" | "") => void;
  onRefresh: () => void;
  onResetFilters?: () => void;
  onOpenCreateModal: () => void;
}

const GENDER_FILTER_OPTIONS: SelectOption[] = [
  { value: "", label: "SEMUA GENDER" },
  { value: "L", label: "LAKI-LAKI (L)" },
  { value: "P", label: "PEREMPUAN (P)" },
];

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  search,
  facultyFilter,
  studyProgramFilter,
  cohortFilter,
  classFilter,
  genderFilter,
  faculties,
  studyPrograms,
  cohorts,
  classes = [],
  loading = false,
  onSearchChange,
  onFacultyFilterChange,
  onStudyProgramFilterChange,
  onCohortFilterChange,
  onClassFilterChange,
  onGenderFilterChange,
  onRefresh,
  onResetFilters,
  onOpenCreateModal,
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
    search,
  );

  return (
    <div className="bg-black/90 p-4 border border-zinc-900 rounded-lg space-y-3 font-mono select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px]">
          <Input
            type="text"
            placeholder="Ketik NIM, Nama, atau Email Mahasiswa..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-zinc-500" />}
          />
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Tooltip text="Muat Ulang Data Mahasiswa">
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
          <HasPermission permission="STUDENT_CREATE">
            <Button variant="primary" size="md" onClick={onOpenCreateModal}>
              <UserPlus className="h-4 w-4 mr-1.5" />
              <span>REGISTRASI MAHASISWA</span>
            </Button>
          </HasPermission>
        </div>
      </div>

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

export default StudentHeader;
