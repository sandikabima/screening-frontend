import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { Pagination } from "@/shared/components/ui/Pagination";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";
import { FollowUpItem } from "../types/followUp.types";
import { HasPermission } from "@/features/auth/components/HasPermission";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";

interface FollowUpTableProps {
  tickets: FollowUpItem[];
  loading: boolean;
  pagination?: any;
  setPage?: (page: number) => void;
  setLimit?: (limit: number) => void;
  onSelectTicket: (ticket: FollowUpItem) => void;
}

export const FollowUpTable: React.FC<FollowUpTableProps> = ({
  tickets,
  loading,
  pagination,
  setPage,
  setLimit,
  onSelectTicket,
}) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const canUpdate = hasPermission("FOLLOW_UP_UPDATE");
  const canPerformAction = canUpdate;

  const baseSkeletonColumns: ColumnSkeletonConfig[] = [
    { width: "w-44" },
    { width: "w-20" },
    { width: "w-24" },
    { width: "w-32" },
    { width: "w-48" },
  ];

  const skeletonColumns: ColumnSkeletonConfig[] = canPerformAction
    ? [
        ...baseSkeletonColumns,
        { width: "w-28", align: "right", isAction: true },
      ]
    : baseSkeletonColumns;

  const colSpanCount = canPerformAction ? 6 : 5;

  return (
    <div className="space-y-4 font-mono select-none">
      <div className="border border-zinc-900 rounded-xl overflow-x-auto bg-black font-mono shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950/80 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <th className="p-4">MAHASISWA</th>
              <th className="p-4">PRIORITAS</th>
              <th className="p-4">STATUS TIKET</th>
              <th className="p-4">PENANGAN (STAF/PSIKOLOG)</th>
              <th className="p-4">CATATAN PENANGANAN</th>
              {canPerformAction && (
                <th className="p-4 text-right">AKSI TIKET</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/80 text-xs">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRowSkeleton key={idx} columns={skeletonColumns} />
              ))
            ) : tickets.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpanCount}
                  className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
                >
                  TIDAK ADA TIKET INTERVENSI DITEMUKAN.
                </td>
              </tr>
            ) : (
              tickets.map((t) => {
                const safeId = t.id || "";

                return (
                  <tr
                    key={safeId}
                    className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-bold text-white text-sm">
                        {t.screeningResult?.student?.user?.name || "N/A"}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        NIM: {t.screeningResult?.student?.nim || "-"}
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-900/80 rounded uppercase shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                        {t.screeningResult?.priorityResult || "-"}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold border rounded-full uppercase ${
                          t.status === "Belum"
                            ? "bg-red-950/40 text-red-400 border-red-900/60"
                            : t.status === "Dijadwalkan"
                              ? "bg-amber-950/40 text-amber-400 border-amber-900/60"
                              : "bg-emerald-950/40 text-emerald-400 border-emerald-900/60"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {t.handledBy?.name ? (
                        <span className="text-xs font-bold text-amber-400">
                          {t.handledBy.name}
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-[10px] italic">
                          Belum diklaim
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-zinc-400 max-w-xs truncate">
                      {t.notes || (
                        <span className="text-zinc-600 italic">
                          Belum ada catatan...
                        </span>
                      )}
                    </td>

                    {canPerformAction && (
                      <td className="p-4 text-right whitespace-nowrap">
                        <HasPermission permission="FOLLOW_UP_UPDATE">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onSelectTicket(t)}
                            className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                          >
                            UPDATE TIKET
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

      {pagination && setPage && setLimit && (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default FollowUpTable;
