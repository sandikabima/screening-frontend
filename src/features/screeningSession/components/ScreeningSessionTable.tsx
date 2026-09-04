import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { Pagination } from "@/shared/components/ui/Pagination";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";

import { formatDate } from "@/shared/utils/formatDate";
import { HasPermission } from "@/features/auth/components/HasPermission";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";
import { ScreeningSession } from "../types/screeningSession.types";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ScreeningSessionTableProps {
  sessions: ScreeningSession[];
  loading: boolean;
  deletingId: string | null;
  pagination?: PaginationMeta;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  onDelete: (session: ScreeningSession) => void;
}

export const ScreeningSessionTable: React.FC<ScreeningSessionTableProps> = ({
  sessions,
  loading,
  deletingId,
  pagination,
  setPage,
  setLimit,
  onDelete,
}) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const canDelete = hasPermission("SCREENING_SESSION_DELETE");

  const baseSkeletonColumns: ColumnSkeletonConfig[] = [
    { width: "w-48" },
    { width: "w-36" },
    { width: "w-28" },
    { width: "w-28" },
    { width: "w-32" },
  ];

  const skeletonColumns: ColumnSkeletonConfig[] = canDelete
    ? [
        ...baseSkeletonColumns,
        { width: "w-24", align: "right", isAction: true },
      ]
    : baseSkeletonColumns;

  const colSpanCount = canDelete ? 6 : 5;

  return (
    <div className="space-y-4 font-mono select-none">
      <div className="border border-zinc-900 rounded-xl overflow-x-auto bg-black font-mono shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950/80 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <th className="p-4">MAHASISWA (PESERTA)</th>
              <th className="p-4">BATCH JADWAL</th>
              <th className="p-4">STATUS SESI</th>
              <th className="p-4">TANGGAL TES</th>
              <th className="p-4">WAKTU SESI DIBUAT</th>
              {canDelete && <th className="p-4 text-right">OTORITAS</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/80 text-xs">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRowSkeleton key={idx} columns={skeletonColumns} />
              ))
            ) : sessions.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpanCount}
                  className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
                >
                  BELUM ADA AKTIVITAS SESI SCREENING LOGGED.
                </td>
              </tr>
            ) : (
              sessions.map((sess) => {
                const safeId = sess.id || "";
                const isDeleting = deletingId === safeId;

                return (
                  <tr
                    key={safeId}
                    className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                  >
                    {/* MAHASISWA */}
                    <td className="p-4 whitespace-nowrap">
                      <div>
                        <div className="font-bold text-white text-sm">
                          {sess.student?.user?.name || "Mahasiswa"}
                        </div>
                        <div className="text-[10px] text-amber-400 font-bold">
                          NIM: {sess.student?.nim || "-"}
                        </div>
                      </div>
                    </td>

                    {/* BATCH JADWAL */}
                    <td className="p-4 whitespace-nowrap">
                      <div>
                        <div className="font-bold text-zinc-200 text-xs">
                          {sess.schedule?.name || "-"}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {sess.schedule?.jamMulai} -{" "}
                          {sess.schedule?.jamSelesai}
                        </div>
                      </div>
                    </td>

                    {/* STATUS SESI */}
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-black tracking-wider rounded border uppercase ${
                          sess.status === "Completed"
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/80"
                            : "bg-amber-950/40 text-amber-400 border-amber-800/80 animate-pulse"
                        }`}
                      >
                        {sess.status === "In_Progress"
                          ? "IN PROGRESS"
                          : "COMPLETED"}
                      </span>
                    </td>

                    {/* TANGGAL TES */}
                    <td className="p-4 whitespace-nowrap text-zinc-300 font-semibold">
                      {formatDate(sess.schedule?.tanggal, {
                        variant: "MEDIUM_DATE",
                      })}
                    </td>

                    {/* WAKTU DIBUAT */}
                    <td className="p-4 whitespace-nowrap text-zinc-400 text-xs font-semibold">
                      {formatDate(sess.createdAt, { variant: "DATE_TIME" })}
                    </td>

                    {/* ACTION (RESET / DELETE) */}
                    {canDelete && (
                      <td className="p-4 text-right whitespace-nowrap">
                        <HasPermission permission="SCREENING_SESSION_DELETE">
                          <Button
                            variant="danger"
                            size="sm"
                            loading={isDeleting}
                            disabled={isDeleting}
                            onClick={() => onDelete(sess)}
                          >
                            RESET SESI
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

      {pagination && (
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

export default ScreeningSessionTable;
