import React, { useMemo } from "react";
import { RefreshCw, FilterX, Activity, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { Select, SelectOption } from "@/shared/components/ui/Select";
import { ScreeningSchedule } from "@/features/screening/types/screeningSchedule.types";

interface ScreeningSessionHeaderProps {
  scheduleFilter: string;
  statusFilter: string;
  schedules: ScreeningSchedule[];
  loading?: boolean;
  onScheduleFilterChange: (val: string) => void;
  onStatusFilterChange: (val: string) => void;
  onRefresh: () => void;
  onResetFilters?: () => void;
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "SEMUA STATUS SESI" },
  { value: "In_Progress", label: "IN PROGRESS (BERLANGSUNG)" },
  { value: "Completed", label: "COMPLETED (SELESAI)" },
];

export const ScreeningSessionHeader: React.FC<ScreeningSessionHeaderProps> = ({
  scheduleFilter,
  statusFilter,
  schedules,
  loading = false,
  onScheduleFilterChange,
  onStatusFilterChange,
  onRefresh,
  onResetFilters,
}) => {
  const scheduleOptions = useMemo<SelectOption[]>(() => {
    const list = schedules.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.barcodeValue})`,
    }));
    return [{ value: "", label: "SEMUA BATCH SCHEDULE" }, ...list];
  }, [schedules]);

  return (
    <div className="bg-black/90 p-4 border border-zinc-900 rounded-lg space-y-3 font-mono select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-[240px]">
          {/* FILTER BATCH SCHEDULE */}
          <div className="flex-1 min-w-[220px]">
            <Select
              value={scheduleFilter}
              onChange={(e) => onScheduleFilterChange(e.target.value)}
              options={scheduleOptions}
              leftIcon={<Calendar className="h-3.5 w-3.5 text-zinc-400" />}
            />
          </div>

          {/* FILTER STATUS SESI */}
          <div className="w-64">
            <Select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              options={STATUS_OPTIONS}
              leftIcon={<Activity className="h-3.5 w-3.5 text-zinc-400" />}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip text="Muat Ulang Data Sesi">
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

export default ScreeningSessionHeader;
