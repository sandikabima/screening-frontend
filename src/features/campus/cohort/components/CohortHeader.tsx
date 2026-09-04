import React from "react";
import { Search, RefreshCw, FilterX, Plus } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { StudyProgram } from "../../study/types/studyProgram.types";
import { HasPermission } from "@/features/auth/components/HasPermission";

interface CohortHeaderProps {
  search: string;
  studyProgramFilter?: string;
  studyPrograms?: StudyProgram[];
  loading?: boolean;
  onSearchChange: (val: string) => void;
  onStudyProgramFilterChange: (val: string) => void;
  onRefresh: () => void;
  onResetFilters?: () => void;
  onOpenCreateModal: () => void;
}

export const CohortHeader: React.FC<CohortHeaderProps> = ({
  search,
  loading = false,
  onSearchChange,
  onRefresh,
  onResetFilters,
  onOpenCreateModal,
}) => {
  return (
    <div className="bg-black/90 p-4 border border-zinc-900 rounded-lg space-y-3 font-mono select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px]">
          <Input
            type="text"
            placeholder="Cari tahun atau nama angkatan..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <Tooltip text="Muat Ulang Data Angkatan">
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

          <HasPermission permission="COHORT_CREATE">
            <Button variant="primary" size="md" onClick={onOpenCreateModal}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>REGISTRASI ANGKATAN BARU</span>
            </Button>
          </HasPermission>
        </div>
      </div>
    </div>
  );
};

export default CohortHeader;
