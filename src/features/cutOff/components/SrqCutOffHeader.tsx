import React from "react";
import { RefreshCw, Sliders, ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";

interface SrqCutOffHeaderProps {
  loading?: boolean;
  cutoffScore?: number;
  onRefresh: () => void;
  onOpenEditModal: () => void;
}

export const SrqCutOffHeader: React.FC<SrqCutOffHeaderProps> = ({
  loading = false,
  cutoffScore,
  onRefresh,
  onOpenEditModal,
}) => {
  return (
    <div className="bg-black/90 p-4 border border-zinc-900 rounded-xl font-mono select-none shadow-xl">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-red-500">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              AMBANG BATAS SRQ-20 AKTIF
            </div>
            <div className="text-sm font-black text-white flex items-center gap-2">
              <span>SKOR CUT-OFF:</span>
              <span className="text-red-400 font-mono text-base">
                {cutoffScore !== undefined ? `>= ${cutoffScore} PT` : "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Tooltip text="Muat Ulang Konfigurasi">
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

          <Button
            variant="primary"
            size="md"
            onClick={onOpenEditModal}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-500 text-black font-bold border-amber-500"
          >
            <Sliders className="h-4 w-4 mr-2" />
            <span>KONFIGURASI CUT-OFF</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SrqCutOffHeader;
