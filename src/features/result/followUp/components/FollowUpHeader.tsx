import React, { useMemo } from "react";
import { Search, RefreshCw, FilterX, AlertTriangle, Tag } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { Select, SelectOption } from "@/shared/components/ui/Select";

interface FollowUpHeaderProps {
  search: string;
  statusFilter: string;
  priorityFilter: string;
  loading?: boolean;
  onSearchChange: (val: string) => void;
  onStatusFilterChange: (val: string) => void;
  onPriorityFilterChange: (val: string) => void;
  onRefresh: () => void;
  onResetFilters?: () => void;
}

export const FollowUpHeader: React.FC<FollowUpHeaderProps> = ({
  search,
  statusFilter,
  priorityFilter,
  loading = false,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onRefresh,
  onResetFilters,
}) => {
  const statusOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "SEMUA STATUS TIKET" },
      { value: "Belum", label: "STATUS: BELUM DITANGANI" },
      { value: "Dijadwalkan", label: "STATUS: DIJADWALKAN" },
      { value: "Selesai", label: "STATUS: SELESAI" },
    ],
    [],
  );

  const priorityOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "SEMUA PRIORITAS (P1 - P3)" },
      { value: "P1", label: "P1 - MERAH (EMERGENCY)" },
      { value: "P2", label: "P2 - ORANYE (HIGH RISK)" },
      { value: "P3", label: "P3 - KUNING (MONITORING)" },
    ],
    [],
  );

  return (
    <div className="bg-black/90 p-4 border border-zinc-900 rounded-lg space-y-3 font-mono select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-[240px]">
          {/* Input Search */}
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Cari Nama / NIM / Catatan..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
            />
          </div>

          {/* Select Status Filter */}
          <div className="w-56">
            <Select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              options={statusOptions}
              leftIcon={<Tag className="h-3.5 w-3.5 text-zinc-400" />}
            />
          </div>

          {/* Select Priority Filter */}
          <div className="w-60">
            <Select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              options={priorityOptions}
              leftIcon={
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              }
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Tooltip text="Muat Ulang Tiket">
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
        </div>
      </div>
    </div>
  );
};

export default FollowUpHeader;
