import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { Pagination } from "@/shared/components/ui/Pagination";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";
import { ClassEntity } from "../types/class.types";
import { HasPermission } from "@/features/auth/components/HasPermission";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";

interface ClassTableProps {
  classes: ClassEntity[];
  loading: boolean;
  deletingId: string | null;
  togglingId: string | null;
  pagination: any;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  onEdit: (cls: ClassEntity) => void;
  onToggleStatus: (cls: ClassEntity) => void;
  onDelete: (cls: ClassEntity) => void;
}

export const ClassTable: React.FC<ClassTableProps> = ({
  classes,
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
  // 1. Ambil helper permission dari useAuthStore
  const hasPermission = useAuthStore((state) => state.hasPermission);

  // 2. Evaluasi permission
  const canUpdate = hasPermission("CLASS_UPDATE");
  const canDelete = hasPermission("CLASS_DELETE");
  const canPerformAction = canUpdate || canDelete;

  // 3. SKELETON COLUMNS DINAMIS
  const baseSkeletonColumns: ColumnSkeletonConfig[] = [
    { width: "w-40" },
    { width: "w-24" },
    { width: "w-36" },
    { width: "w-28" },
    { width: "w-24" },
  ];

  const skeletonColumns: ColumnSkeletonConfig[] = canPerformAction
    ? [
        ...baseSkeletonColumns,
        { width: "w-48", align: "right", isAction: true },
      ]
    : baseSkeletonColumns;

  // 4. Hitung colSpan secara konsisten (6 kolom default, 5 jika tanpa aksi)
  const colSpanCount = canPerformAction ? 6 : 5;

  return (
    <div className="space-y-4 font-mono select-none">
      <div className="border border-zinc-900 rounded-xl overflow-x-auto bg-black font-mono shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950/80 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <th className="p-4">NAMA KELAS</th>
              <th className="p-4">KODE</th>
              <th className="p-4">PROGRAM STUDI</th>
              <th className="p-4">ANGKATAN</th>
              <th className="p-4">STATUS</th>
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
            ) : classes.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpanCount}
                  className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
                >
                  BELUM ADA DATA KELAS TERDAFTAR.
                </td>
              </tr>
            ) : (
              classes.map((cls) => {
                const safeId = cls.id || "";
                const isDeleting = deletingId === safeId;
                const isToggling = togglingId === safeId;

                const sp = cls.studyProgram || (cls as any).study_program;
                const cohort = cls.cohort;

                return (
                  <tr
                    key={safeId}
                    className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <div>
                        <div className="font-bold text-white text-sm">
                          {cls.name}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          ID: {cls.id}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-bold tracking-widest bg-zinc-900 text-zinc-100 border border-zinc-700/80 rounded-md uppercase font-mono">
                        {cls.code}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="text-zinc-400 text-xs font-semibold">
                        {sp?.name ? (
                          <>
                            [{sp.degree || "S1"}-{sp.code}] {sp.name}
                          </>
                        ) : (
                          cls.studyProgramId || "-"
                        )}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-black tracking-wider bg-amber-950/50 text-amber-400 border border-amber-800/80 rounded-md uppercase font-mono shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                        {cohort?.name || cohort?.year || cls.cohortId || "-"}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <Tooltip
                        text={
                          cls.isActive
                            ? "Klik untuk menonaktifkan kelas"
                            : "Klik untuk mengaktifkan kelas"
                        }
                      >
                        <button
                          onClick={() => onToggleStatus(cls)}
                          disabled={isToggling || isDeleting}
                          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                          {cls.isActive ? (
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

                    {/* CELL KONTEN AKSI HANYA DITAMPILKAN JIKA USER MEMILIKI AKSES */}
                    {canPerformAction && (
                      <td className="p-4 text-right whitespace-nowrap space-x-2">
                        <HasPermission permission="CLASS_UPDATE">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEdit(cls)}
                            disabled={isDeleting || isToggling}
                            className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                          >
                            EDIT KELAS
                          </Button>
                        </HasPermission>
                        <HasPermission permission="CLASS_DELETE">
                          <Button
                            variant="danger"
                            size="sm"
                            loading={isDeleting}
                            disabled={isDeleting || isToggling}
                            onClick={() => onDelete(cls)}
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

export default ClassTable;
