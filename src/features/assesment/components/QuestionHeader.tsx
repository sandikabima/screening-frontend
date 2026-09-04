import React from "react";
import { Search, RefreshCw, FilterX } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";

interface QuestionHeaderProps {
  search: string;
  loading?: boolean;
  onSearchChange: (val: string) => void;
  onRefresh: () => void;
  onResetFilters?: () => void;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  search,
  loading = false,
  onSearchChange,
  onRefresh,
  onResetFilters,
}) => {
  return (
    <div className="bg-black/90 p-4 border border-zinc-900 rounded-lg space-y-3 font-mono select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px]">
          <Input
            type="text"
            placeholder="Cari kode (e.g. SRQ-01, INTI-F1) atau kata kunci pertanyaan..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-zinc-500" />}
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Tooltip text="Muat Ulang Bank Soal">
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

          {onResetFilters && (
            <Tooltip text="Reset / Bersihkan Pencarian & Filter">
              <Button
                variant="secondary"
                size="md"
                onClick={onResetFilters}
                disabled={loading}
                className="bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-red-400"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
