import React, { useMemo } from "react";
import { Search, RefreshCw, FilterX, Plus, Building2 } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { Select, SelectOption } from "@/shared/components/ui/Select";
import { Faculty } from "../../faculty/types/faculty.types";
import { HasPermission } from "@/features/auth/components/HasPermission";

interface StudyProgramHeaderProps {
  search: string;
  facultyFilter: string;
  faculties: Faculty[];
  loading?: boolean;
  onSearchChange: (val: string) => void;
  onFacultyFilterChange: (val: string) => void;
  onRefresh: () => void;
  onResetFilters?: () => void;
  onOpenCreateModal: () => void;
}

export const StudyProgramHeader: React.FC<StudyProgramHeaderProps> = ({
  search,
  facultyFilter,
  faculties,
  loading = false,
  onSearchChange,
  onFacultyFilterChange,
  onRefresh,
  onResetFilters,
  onOpenCreateModal,
}) => {
  const facultyOptions = useMemo<SelectOption[]>(() => {
    const options = faculties.map((f) => ({
      value: f.id,
      label: `[${f.code}] ${f.name}`,
    }));

    return [{ value: "", label: "SEMUA FAKULTAS" }, ...options];
  }, [faculties]);

  return (
    <div className="bg-black/90 p-4 border border-zinc-900 rounded-lg space-y-3 font-mono select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-[240px]">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Cari kode atau nama prodi..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
            />
          </div>

          <div className="w-60">
            <Select
              value={facultyFilter}
              onChange={(e) => onFacultyFilterChange(e.target.value)}
              options={facultyOptions}
              leftIcon={<Building2 className="h-3.5 w-3.5 text-zinc-400" />}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip text="Muat Ulang Data Prodi">
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

          <HasPermission permission="STUDY_PROGRAM_CREATE">
            <Button variant="primary" size="md" onClick={onOpenCreateModal}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>REGISTRASI PRODI BARU</span>
            </Button>
          </HasPermission>
        </div>
      </div>
    </div>
  );
};

export default StudyProgramHeader;
