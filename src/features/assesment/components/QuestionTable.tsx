import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";
import { Question } from "../types/question.types";
import { HasPermission } from "@/features/auth/components/HasPermission";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";

interface QuestionTableProps {
  questions: Question[];
  loading: boolean;
  togglingId: string | null;
  onEdit: (q: Question) => void;
  onToggleStatus: (q: Question) => void;
}

export const QuestionTable: React.FC<QuestionTableProps> = ({
  questions,
  loading,
  togglingId,
  onEdit,
  onToggleStatus,
}) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const canUpdate =
    hasPermission("QUESTION_UPDATE") || hasPermission("QUESTION_MANAGE");
  const canPerformAction = canUpdate;

  const baseSkeletonColumns: ColumnSkeletonConfig[] = [
    { width: "w-20" },
    { width: "w-80" },
    { width: "w-48" },
    { width: "w-24" },
  ];

  const skeletonColumns: ColumnSkeletonConfig[] = canPerformAction
    ? [
        ...baseSkeletonColumns,
        { width: "w-32", align: "right", isAction: true },
      ]
    : baseSkeletonColumns;
  const colSpanCount = canPerformAction ? 5 : 4;

  return (
    <div className="space-y-4 font-mono select-none">
      <div className="border border-zinc-900 rounded-xl overflow-x-auto bg-black font-mono shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950/80 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <th className="p-4 w-28">KODE SOAL</th>
              <th className="p-4">TEKS PERTANYAAN KUESIONER</th>
              <th className="p-4">OPSI JAWABAN &amp; SKOR</th>
              <th className="p-4">STATUS</th>
              {canPerformAction && (
                <th className="p-4 text-right">TINDAKAN OTORITAS</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/80 text-xs">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRowSkeleton key={idx} columns={skeletonColumns} />
              ))
            ) : questions.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpanCount}
                  className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
                >
                  TIDAK ADA DATA PERTANYAAN TERSEDIA.
                </td>
              </tr>
            ) : (
              questions.map((q) => {
                const isToggling = togglingId === q.id;

                return (
                  <tr
                    key={q.id}
                    className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-bold tracking-widest bg-zinc-900 text-zinc-100 border border-zinc-700/80 rounded-md uppercase font-mono">
                        {q.code}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white text-sm max-w-xl leading-relaxed">
                        {q.questionText}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1">
                        Urutan: #{q.orderNumber} | ID: {q.id}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {q.options?.map((opt) => (
                          <span
                            key={opt.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300"
                          >
                            <span>{opt.optionLabel}</span>
                            <span className="font-bold text-amber-400">
                              ({opt.score} pt)
                            </span>
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <Tooltip
                        text={
                          q.isActive
                            ? "Klik untuk menonaktifkan soal"
                            : "Klik untuk mengaktifkan soal"
                        }
                      >
                        <button
                          onClick={() => onToggleStatus(q)}
                          disabled={isToggling || !canPerformAction}
                          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                          {q.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold bg-emerald-950/30 text-emerald-400 border border-emerald-900/60 hover:border-emerald-700 rounded-full">
                              <span
                                className={`h-1.5 w-1.5 rounded-full bg-emerald-500 ${
                                  isToggling ? "animate-spin" : "animate-pulse"
                                }`}
                              />
                              {isToggling ? "MEMPROSES..." : "AKTIF"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700 rounded-full">
                              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                              {isToggling ? "MEMPROSES..." : "NON-AKTIF"}
                            </span>
                          )}
                        </button>
                      </Tooltip>
                    </td>

                    {canPerformAction && (
                      <td className="p-4 text-right whitespace-nowrap">
                        <HasPermission permission="QUESTION_UPDATE">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEdit(q)}
                            disabled={isToggling}
                            className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                          >
                            EDIT TEKS SOAL
                          </Button>
                        </HasPermission>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionTable;
