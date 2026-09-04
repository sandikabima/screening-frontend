import React, { useMemo } from "react";
import {
  Search,
  RefreshCw,
  FilterX,
  Plus,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { Select, SelectOption } from "@/shared/components/ui/Select";
import { StudyProgram } from "../../study/types/studyProgram.types";
import { Cohort } from "../../cohort/types/cohort.types";
import { HasPermission } from "@/features/auth/components/HasPermission";

interface ClassHeaderProps {
  search: string;
  studyProgramFilter: string;
  cohortFilter: string;
  studyPrograms: StudyProgram[];
  cohorts: Cohort[];
  loading?: boolean;
  onSearchChange: (val: string) => void;
  onStudyProgramFilterChange: (val: string) => void;
  onCohortFilterChange: (val: string) => void;
  onRefresh: () => void;
  onResetFilters?: () => void;
  onOpenCreateModal: () => void;
}

export const ClassHeader: React.FC<ClassHeaderProps> = ({
  search,
  studyProgramFilter,
  cohortFilter,
  studyPrograms,
  cohorts,
  loading = false,
  onSearchChange,
  onStudyProgramFilterChange,
  onCohortFilterChange,
  onRefresh,
  onResetFilters,
  onOpenCreateModal,
}) => {
  const spOptions = useMemo<SelectOption[]>(() => {
    const options = studyPrograms.map((sp) => ({
      value: sp.id,
      label: `[${sp.degree || "S1"}-${sp.code}] ${sp.name}`,
    }));
    return [{ value: "", label: "SEMUA PRODI" }, ...options];
  }, [studyPrograms]);

  const cohortOptions = useMemo<SelectOption[]>(() => {
    const options = cohorts.map((c) => ({
      value: c.id,
      label: `${c.name} (${c.year})`,
    }));
    return [{ value: "", label: "SEMUA ANGKATAN" }, ...options];
  }, [cohorts]);

  return (
    <div className="bg-black/90 p-4 border border-zinc-900 rounded-lg space-y-3 font-mono select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-[240px]">
          <div className="flex-1 min-w-[180px]">
            <Input
              type="text"
              placeholder="Cari kode atau nama kelas..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
            />
          </div>

          <div className="w-56">
            <Select
              value={studyProgramFilter}
              onChange={(e) => onStudyProgramFilterChange(e.target.value)}
              options={spOptions}
              leftIcon={<GraduationCap className="h-3.5 w-3.5 text-zinc-400" />}
            />
          </div>

          <div className="w-52">
            <Select
              value={cohortFilter}
              onChange={(e) => onCohortFilterChange(e.target.value)}
              options={cohortOptions}
              leftIcon={<Calendar className="h-3.5 w-3.5 text-zinc-400" />}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip text="Muat Ulang Data Kelas">
            <Button
              variant="secondary"
              size="md"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  loading ? "animate-spin text-red-500" : ""
                }`}
              />
            </Button>
          </Tooltip>

          {onResetFilters && (
            <Tooltip text="Bersihkan Filter">
              <Button variant="secondary" size="md" onClick={onResetFilters}>
                <FilterX className="h-3.5 w-3.5 text-zinc-400 hover:text-red-400" />
              </Button>
            </Tooltip>
          )}

          <HasPermission permission="CLASS_CREATE">
            <Button variant="primary" size="md" onClick={onOpenCreateModal}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>REGISTRASI KELAS BARU</span>
            </Button>
          </HasPermission>
        </div>
      </div>
    </div>
  );
};

export default ClassHeader;
