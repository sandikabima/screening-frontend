import React, { useMemo } from "react";
import { Search, RefreshCw, FilterX, AlertCircle } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { Select, SelectOption } from "@/shared/components/ui/Select";
import { PriorityResult } from "../../ScreeningResult/types/screeningResult.types";

interface SrqResponseHeaderProps {
  search: string;
  priorityFilter: PriorityResult | "";
  loading?: boolean;
  onSearchChange: (val: string) => void;
  onPriorityFilterChange: (val: PriorityResult | "") => void;
  onRefresh: () => void;
  onResetFilters?: () => void;
}

export const SrqResponseHeader: React.FC<SrqResponseHeaderProps> = ({
  search,
  priorityFilter,
  loading = false,
  onSearchChange,
  onPriorityFilterChange,
  onRefresh,
  onResetFilters,
}) => {
  const priorityOptions = useMemo<SelectOption[]>(
    () => [
      { value: "", label: "SEMUA PRIORITAS (P1 - P4)" },
      { value: "P1", label: "P1 - MERAH (EMERGENCY)" },
      { value: "P2", label: "P2 - ORANYE (HIGH RISK)" },
      { value: "P3", label: "P3 - KUNING (MONITORING)" },
      { value: "P4", label: "P4 - HIJAU (NORMAL)" },
    ],
    [],
  );

  return (
    <div className="bg-black/90 p-4 border border-zinc-900 rounded-lg space-y-3 font-mono select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-[240px]">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Cari Nama Mahasiswa atau NIM..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
            />
          </div>

          <div className="w-64">
            <Select
              value={priorityFilter}
              onChange={(e) =>
                onPriorityFilterChange(e.target.value as PriorityResult | "")
              }
              options={priorityOptions}
              leftIcon={<AlertCircle className="h-3.5 w-3.5 text-zinc-400" />}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip text="Muat Ulang Matrix">
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

export default SrqResponseHeader;
