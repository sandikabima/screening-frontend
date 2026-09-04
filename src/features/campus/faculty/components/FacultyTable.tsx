import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { Pagination } from "@/shared/components/ui/Pagination";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";
import { Faculty } from "../types/faculty.types";
import { HasPermission } from "@/features/auth/components/HasPermission";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";

interface FacultyTableProps {
  faculties: Faculty[];
  loading: boolean;
  deletingId: string | null;
  togglingId: string | null;
  pagination: any;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  onEdit: (faculty: Faculty) => void;
  onToggleStatus: (faculty: Faculty) => void;
  onDelete: (faculty: Faculty) => void;
}

export const FacultyTable: React.FC<FacultyTableProps> = ({
  faculties,
  loading,
  deletingId,
  togglingId,
  pagination,
  setPage,
  setLimit,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  // 1. Ambil fungsi check permission dari useAuthStore
  const hasPermission = useAuthStore((state) => state.hasPermission);

  // 2. Evaluasi permission
  const canUpdate = hasPermission("FACULTY_UPDATE");
  const canDelete = hasPermission("FACULTY_DELETE");
  const canPerformAction = canUpdate || canDelete;

  // 3. SKELETON COLUMNS DINAMIS (Mengikuti status permission)
  const baseSkeletonColumns: ColumnSkeletonConfig[] = [
    { width: "w-48" },
    { width: "w-32" },
    { width: "w-24" },
  ];

  const skeletonColumns: ColumnSkeletonConfig[] = canPerformAction
    ? [
        ...baseSkeletonColumns,
        { width: "w-48", align: "right", isAction: true },
      ]
    : baseSkeletonColumns;

  // 4. Hitung colSpan secara konsisten
  const colSpanCount = canPerformAction ? 4 : 3;

  return (
    <div className="space-y-4 font-mono select-none">
      <div className="border border-zinc-900 rounded-xl overflow-x-auto bg-black font-mono shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950/80 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <th className="p-4">IDENTITAS FAKULTAS</th>
              <th className="p-4">KODE RESMI</th>
              <th className="p-4">STATUS FAKULTAS</th>
              {canPerformAction && (
                <th className="p-4 text-right">TINDAKAN OTORITAS</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/80 text-xs">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRowSkeleton key={idx} columns={skeletonColumns} />
              ))
            ) : faculties.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpanCount}
                  className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
                >
                  BELUM ADA DATA FAKULTAS TERDAFTAR.
                </td>
              </tr>
            ) : (
              faculties.map((f) => {
                const safeId = f.id || "";
                const isDeleting = deletingId === safeId;
                const isToggling = togglingId === safeId;

                return (
                  <tr
                    key={safeId}
                    className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <div>
                        <div className="font-bold text-white text-sm">
                          {f.name}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          ID: {f.id}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-zinc-900 text-zinc-300 border border-zinc-800 rounded uppercase tracking-wider">
                        {f.code}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <Tooltip
                        text={
                          f.isActive
                            ? "Klik untuk menonaktifkan fakultas"
                            : "Klik untuk mengaktifkan fakultas"
                        }
                      >
                        <button
                          onClick={() => onToggleStatus(f)}
                          disabled={isToggling || isDeleting}
                          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                          {f.isActive ? (
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

                    {/* CELL KONTEN HANYA RENDER JIKA USER BERHAK */}
                    {canPerformAction && (
                      <td className="p-4 text-right whitespace-nowrap space-x-2">
                        <HasPermission permission="FACULTY_UPDATE">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEdit(f)}
                            disabled={isDeleting || isToggling}
                            className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                          >
                            EDIT FAKULTAS
                          </Button>
                        </HasPermission>

                        <HasPermission permission="FACULTY_DELETE">
                          <Button
                            variant="danger"
                            size="sm"
                            loading={isDeleting}
                            disabled={isDeleting || isToggling}
                            onClick={() => onDelete(f)}
                            className="bg-red-950/40 text-red-500 border-red-900/60 hover:bg-red-900/60"
                          >
                            HAPUS
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

export default FacultyTable;
