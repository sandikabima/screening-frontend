import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { Pagination } from "@/shared/components/ui/Pagination";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";

import { Student } from "../types/student.types";
import { formatDate } from "@/shared/utils/formatDate";
import { HasPermission } from "@/features/auth/components/HasPermission";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  deletingId: string | null;
  pagination?: PaginationMeta;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  onEdit: (st: Student) => void;
  onDelete: (st: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  loading,
  deletingId,
  pagination,
  setPage,
  setLimit,
  onEdit,
  onDelete,
}) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const canUpdate = hasPermission("STUDENT_UPDATE");
  const canDelete = hasPermission("STUDENT_DELETE");
  const canPerformAction = canUpdate || canDelete;

  const baseSkeletonColumns: ColumnSkeletonConfig[] = [
    { width: "w-48" },
    { width: "w-28" },
    { width: "w-16" },
    { width: "w-36" },
    { width: "w-24" },
    { width: "w-20" },
    { width: "w-28" },
  ];

  const skeletonColumns: ColumnSkeletonConfig[] = canPerformAction
    ? [
        ...baseSkeletonColumns,
        { width: "w-48", align: "right", isAction: true },
      ]
    : baseSkeletonColumns;

  const colSpanCount = canPerformAction ? 8 : 7;

  return (
    <div className="space-y-4 font-mono select-none">
      <div className="border border-zinc-900 rounded-xl overflow-x-auto bg-black font-mono shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950/80 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <th className="p-4">NAMA & EMAIL MAHASISWA</th>
              <th className="p-4">NIM</th>
              <th className="p-4">GENDER</th>
              <th className="p-4">PROGRAM STUDI</th>
              <th className="p-4">ANGKATAN</th>
              <th className="p-4">KELAS</th>
              <th className="p-4">TERDAFTAR PADA</th>
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
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpanCount}
                  className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
                >
                  BELUM ADA DATA MAHASISWA TERDAFTAR.
                </td>
              </tr>
            ) : (
              students.map((st) => {
                const safeId = st.id || "";
                const isDeleting = deletingId === safeId;

                const sp = st.studyProgram || st.study_program;
                const cohort = st.cohort;
                const cls = st.class;

                return (
                  <tr
                    key={safeId}
                    className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <div>
                        <div className="font-bold text-white text-sm">
                          {st.user?.name || "N/A"}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {st.user?.email || "-"} • Telp:{" "}
                          {st.phoneNumber || "-"}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-bold tracking-widest bg-zinc-900 text-zinc-100 border border-zinc-700/80 rounded-md uppercase font-mono">
                        {st.nim}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-black tracking-wider rounded border uppercase ${
                          st.gender === "L"
                            ? "bg-cyan-950/40 text-cyan-400 border-cyan-800/80"
                            : "bg-pink-950/40 text-pink-400 border-pink-800/80"
                        }`}
                      >
                        {st.gender === "L" ? "LAKI-LAKI" : "PEREMPUAN"}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="text-zinc-400 text-xs font-semibold">
                        {sp?.name ? (
                          <>
                            [{sp.degree || "S1"}-{sp.code}] {sp.name}
                          </>
                        ) : (
                          st.studyProgramId || "-"
                        )}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-black tracking-wider bg-amber-950/50 text-amber-400 border border-amber-800/80 rounded-md uppercase font-mono shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                        {cohort?.name || cohort?.year || st.cohortId || "-"}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-bold tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-md uppercase font-mono">
                        {cls?.name ? `[${cls.code}] ${cls.name}` : "-"}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap text-zinc-400 text-[11px] font-semibold">
                      {formatDate(st.createdAt, { variant: "DATE_TIME" })}
                    </td>

                    {canPerformAction && (
                      <td className="p-4 text-right whitespace-nowrap space-x-2">
                        <HasPermission permission="STUDENT_UPDATE">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEdit(st)}
                            disabled={isDeleting}
                            className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                          >
                            EDIT DATA
                          </Button>
                        </HasPermission>
                        <HasPermission permission="STUDENT_DELETE">
                          <Button
                            variant="danger"
                            size="sm"
                            loading={isDeleting}
                            disabled={isDeleting}
                            onClick={() => onDelete(st)}
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

export default StudentTable;
