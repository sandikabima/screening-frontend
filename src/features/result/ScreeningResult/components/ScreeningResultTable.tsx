import React from "react";
import { Button } from "@/shared/components/ui/Button";
import {
  PriorityResult,
  ScreeningResult,
} from "../types/screeningResult.types";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";

interface ScreeningResultTableProps {
  results: ScreeningResult[];
  loading: boolean;
  onInspect: (id: string) => void;
}

const SKELETON_COLUMNS: ColumnSkeletonConfig[] = [
  { width: "w-48" },
  { width: "w-36" },
  { width: "w-20" },
  { width: "w-24" },
  { width: "w-28" },
  { width: "w-32", align: "right", isAction: true },
];

export const ScreeningResultTable: React.FC<ScreeningResultTableProps> = ({
  results,
  loading,
  onInspect,
}) => {
  const renderPriorityBadge = (priority: PriorityResult) => {
    const badgeStyles: Record<PriorityResult, string> = {
      P1: "bg-red-950/50 text-red-400 border-red-900 animate-pulse",
      P2: "bg-orange-950/50 text-orange-400 border-orange-900",
      P3: "bg-amber-950/50 text-amber-400 border-amber-900",
      P4: "bg-emerald-950/50 text-emerald-400 border-emerald-900",
    };

    return (
      <span
        className={`px-2.5 py-1 text-[10px] font-bold border rounded uppercase tracking-wider ${badgeStyles[priority]}`}
      >
        {priority}
      </span>
    );
  };

  return (
    <div className="border border-zinc-900 rounded-lg overflow-x-auto bg-black font-mono select-none w-full shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-900 bg-zinc-950 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            <th className="p-4">MAHASISWA</th>
            <th className="p-4">PRODI / ANGKATAN</th>
            <th className="p-4">SKOR SRQ</th>
            <th className="p-4">PRIORITAS TRIAGE</th>
            <th className="p-4">SAFETY FLAG</th>
            <th className="p-4 text-right">INSPEKSI LOG</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900/80 text-xs">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <TableRowSkeleton key={idx} columns={SKELETON_COLUMNS} />
            ))
          ) : results.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
              >
                BELUM ADA HASIL SCREENING TERDAFTAR.
              </td>
            </tr>
          ) : (
            results.map((r) => {
              const safeId = r.id || "";
              const studentName = r.student?.user?.name || "N/A";
              const nim = r.student?.nim || "-";

              return (
                <tr
                  key={safeId}
                  className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                >
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-bold text-white">{studentName}</div>
                    <div className="text-[10px] text-zinc-500">NIM: {nim}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-zinc-300">
                      {r.student?.studyProgram?.name || "-"}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Angkatan: {r.student?.cohort?.year || "-"}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap font-bold text-amber-400">
                    {r.srqScore} / 20
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {renderPriorityBadge(r.priorityResult)}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {r.safetyFlag ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-900 rounded">
                        YA (RISIKO)
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-[10px]">TIDAK</span>
                    )}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onInspect(safeId)}
                    >
                      LIHAT JAWABAN
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScreeningResultTable;
