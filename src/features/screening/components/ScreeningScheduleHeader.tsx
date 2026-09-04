import React from "react";
import { Search, RefreshCw, FilterX, Plus, Activity } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { Select, SelectOption } from "@/shared/components/ui/Select";
import { HasPermission } from "@/features/auth/components/HasPermission";

interface ScreeningScheduleHeaderProps {
  search: string;
  statusBarcodeFilter: string;
  loading?: boolean;
  onSearchChange: (val: string) => void;
  onStatusBarcodeFilterChange: (val: string) => void;
  onRefresh: () => void;
  onResetFilters?: () => void;
  onOpenCreateModal: () => void;
}

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: "", label: "SEMUA STATUS" },
  { value: "ACTIVE", label: "ACTIVE (AKTIF)" },
  { value: "INACTIVE", label: "INACTIVE (NON-AKTIF)" },
  { value: "EXPIRED", label: "EXPIRED (KADALUARSA)" },
];

export const ScreeningScheduleHeader: React.FC<
  ScreeningScheduleHeaderProps
> = ({
  search,
  statusBarcodeFilter,
  loading = false,
  onSearchChange,
  onStatusBarcodeFilterChange,
  onRefresh,
  onResetFilters,
  onOpenCreateModal,
}) => {
  return (
    <div className="bg-black/90 p-4 border border-zinc-900 rounded-lg space-y-3 font-mono select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-[240px]">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Cari nama batch atau barcode..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
            />
          </div>

          <div className="w-56">
            <Select
              value={statusBarcodeFilter}
              onChange={(e) => onStatusBarcodeFilterChange(e.target.value)}
              options={STATUS_FILTER_OPTIONS}
              leftIcon={<Activity className="h-3.5 w-3.5 text-zinc-400" />}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip text="Muat Ulang Data Jadwal">
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

          <HasPermission permission="SCREENING_SCHEDULE_CREATE">
            <Button variant="primary" size="md" onClick={onOpenCreateModal}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>BUAT JADWAL BATCH</span>
            </Button>
          </HasPermission>
        </div>
      </div>
    </div>
  );
};

export default ScreeningScheduleHeader;
