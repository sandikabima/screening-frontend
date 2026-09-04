import React from "react";
import { Search, RefreshCw, FilterX, Plus } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { HasPermission } from "@/features/auth/components/HasPermission";

interface FacultyHeaderProps {
  search: string;
  loading?: boolean;
  onSearchChange: (val: string) => void;
  onRefresh: () => void;
  onResetFilters?: () => void;
  onOpenCreateModal: () => void;
}

export const FacultyHeader: React.FC<FacultyHeaderProps> = ({
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
            placeholder="Cari kode atau nama fakultas..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <Tooltip text="Muat Ulang Data Fakultas">
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
            <Tooltip text="Bersihkan Pencarian">
              <Button variant="secondary" size="md" onClick={onResetFilters}>
                <FilterX className="h-3.5 w-3.5 text-zinc-400 hover:text-red-400" />
              </Button>
            </Tooltip>
          )}
          <HasPermission permission="FACULTY_CREATE">
            <Button variant="primary" size="md" onClick={onOpenCreateModal}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>REGISTRASI FAKULTAS BARU</span>
            </Button>
          </HasPermission>
        </div>
      </div>
    </div>
  );
};

export default FacultyHeader;
