import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { FollowUpItem } from "../types/followUp.types";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";

interface FollowUpTableProps {
  tickets: FollowUpItem[];
  loading: boolean;
  onSelectTicket: (ticket: FollowUpItem) => void;
}

const SKELETON_COLUMNS: ColumnSkeletonConfig[] = [
  { width: "w-44" },
  { width: "w-20" },
  { width: "w-24" },
  { width: "w-32" },
  { width: "w-48" },
  { width: "w-28", align: "right", isAction: true },
];

export const FollowUpTable: React.FC<FollowUpTableProps> = ({
  tickets,
  loading,
  onSelectTicket,
}) => {
  return (
    <div className="border border-zinc-900 rounded-lg overflow-x-auto bg-black font-mono select-none w-full shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-900 bg-zinc-950 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            <th className="p-4">MAHASISWA</th>
            <th className="p-4">PRIORITAS</th>
            <th className="p-4">STATUS TIKET</th>
            <th className="p-4">PENANGAN (STAF/PSIKOLOG)</th>
            <th className="p-4">CATATAN PENANGANAN</th>
            <th className="p-4 text-right">AKSI TIKET</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900 text-xs">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <TableRowSkeleton key={idx} columns={SKELETON_COLUMNS} />
            ))
          ) : tickets.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-12 text-center text-zinc-600 uppercase font-bold tracking-widest"
              >
                TIDAK ADA TIKET INTERVENSI DITEMUKAN.
              </td>
            </tr>
          ) : (
            tickets.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-zinc-900/40 text-zinc-200 transition-colors"
              >
                <td className="p-4 whitespace-nowrap">
                  <div className="font-bold text-white">
                    {t.screeningResult?.student?.user?.name || "N/A"}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    NIM: {t.screeningResult?.student?.nim || "-"}
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-900 rounded uppercase">
                    {t.screeningResult?.priorityResult}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold border rounded uppercase ${
                      t.status === "Belum"
                        ? "bg-red-950/40 text-red-400 border-red-900"
                        : t.status === "Dijadwalkan"
                          ? "bg-amber-950/40 text-amber-400 border-amber-900"
                          : "bg-emerald-950/40 text-emerald-400 border-emerald-900"
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
                <td className="p-4 text-right whitespace-nowrap">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSelectTicket(t)}
                  >
                    UPDATE TIKET
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
