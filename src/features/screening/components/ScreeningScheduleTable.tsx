import React, { useState } from "react";
import { QrCode } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Pagination } from "@/shared/components/ui/Pagination";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";

import { ScreeningSchedule } from "../types/screeningSchedule.types";
import { formatDate } from "@/shared/utils/formatDate";
import { HasPermission } from "@/features/auth/components/HasPermission";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";
import ScreeningBarcodeModal from "./ScreeningBarcodeModal";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ScreeningScheduleTableProps {
  schedules: ScreeningSchedule[];
  loading: boolean;
  deletingId: string | null;
  pagination?: PaginationMeta;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  onEdit: (sched: ScreeningSchedule) => void;
  onDelete: (sched: ScreeningSchedule) => void;
}

export const ScreeningScheduleTable: React.FC<ScreeningScheduleTableProps> = ({
  schedules,
  loading,
  deletingId,
  pagination,
  setPage,
  setLimit,
  onEdit,
  onDelete,
}) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const canUpdate = hasPermission("SCREENING_SCHEDULE_UPDATE");
  const canDelete = hasPermission("SCREENING_SCHEDULE_DELETE");
  const canPerformAction = canUpdate || canDelete;

  const [activeBarcodeSchedule, setActiveBarcodeSchedule] =
    useState<ScreeningSchedule | null>(null);

  const baseSkeletonColumns: ColumnSkeletonConfig[] = [
    { width: "w-48" },
    { width: "w-32" },
    { width: "w-28" },
    { width: "w-24" },
    { width: "w-36" },
    { width: "w-28" },
  ];

  const skeletonColumns: ColumnSkeletonConfig[] = canPerformAction
    ? [
        ...baseSkeletonColumns,
        { width: "w-48", align: "right", isAction: true },
      ]
    : baseSkeletonColumns;

  const colSpanCount = canPerformAction ? 7 : 6;

  return (
    <div className="space-y-4 font-mono select-none">
      <div className="border border-zinc-900 rounded-xl overflow-x-auto bg-black font-mono shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950/80 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <th className="p-4">NAMA BATCH SCREENING</th>
              <th className="p-4">KODE BARCODE</th>
              <th className="p-4">STATUS BARCODE</th>
              <th className="p-4">TANGGAL TES</th>
              <th className="p-4">WAKTU (JAM)</th>
              <th className="p-4">TESTER PENANGGUNG JAWAB</th>
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
            ) : schedules.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpanCount}
                  className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
                >
                  BELUM ADA JADWAL BATCH SCREENING TERDAFTAR.
                </td>
              </tr>
            ) : (
              schedules.map((sc) => {
                const safeId = sc.id || "";
                const isDeleting = deletingId === safeId;

                return (
                  <tr
                    key={safeId}
                    className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                  >
                    {/* NAMA BATCH */}
                    <td className="p-4 whitespace-nowrap">
                      <div>
                        <div className="font-bold text-white text-sm">
                          {sc.name}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          ID: {safeId}
                        </div>
                      </div>
                    </td>

                    {/* KODE BARCODE */}
                    <td className="p-4 whitespace-nowrap">
                      <Tooltip text="Klik untuk menampilkan QR/Barcode">
                        <button
                          type="button"
                          onClick={() => setActiveBarcodeSchedule(sc)}
                          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-black tracking-wider bg-amber-950/50 text-amber-400 border border-amber-800/80 rounded-md uppercase font-mono shadow-[0_0_10px_rgba(245,158,11,0.1)] hover:bg-amber-900/60 hover:border-amber-500 transition-all cursor-pointer"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          <span>{sc.barcodeValue}</span>
                        </button>
                      </Tooltip>
                    </td>

                    {/* STATUS BARCODE */}
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-black tracking-wider rounded border uppercase ${
                          sc.statusBarcode === "ACTIVE"
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/80"
                            : sc.statusBarcode === "INACTIVE"
                              ? "bg-zinc-900 text-zinc-400 border-zinc-700"
                              : "bg-red-950/40 text-red-400 border-red-800/80"
                        }`}
                      >
                        {sc.statusBarcode}
                      </span>
                    </td>

                    {/* TANGGAL TES */}
                    <td className="p-4 whitespace-nowrap text-zinc-300 font-semibold">
                      {formatDate(sc.tanggal, { variant: "MEDIUM_DATE" })}
                    </td>

                    {/* WAKTU */}
                    <td className="p-4 whitespace-nowrap text-zinc-400 text-xs font-semibold">
                      {sc.jamMulai} - {sc.jamSelesai}
                    </td>

                    {/* TESTER */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-zinc-300 text-xs font-semibold">
                        {sc.tester?.name || sc.testerId || "-"}
                      </span>
                    </td>

                    {/* TINDAKAN OTORITAS */}
                    {canPerformAction && (
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Tooltip text="Tampilkan QR Code / Barcode">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => setActiveBarcodeSchedule(sc)}
                            >
                              <QrCode className="h-3.5 w-3.5" />
                            </Button>
                          </Tooltip>

                          <HasPermission permission="SCREENING_SCHEDULE_UPDATE">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onEdit(sc)}
                              disabled={isDeleting}
                            >
                              EDIT DATA
                            </Button>
                          </HasPermission>

                          <HasPermission permission="SCREENING_SCHEDULE_DELETE">
                            <Button
                              variant="danger"
                              size="sm"
                              loading={isDeleting}
                              disabled={isDeleting}
                              onClick={() => onDelete(sc)}
                            >
                              HAPUS
                            </Button>
                          </HasPermission>
                        </div>
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

      <ScreeningBarcodeModal
        schedule={activeBarcodeSchedule}
        onClose={() => setActiveBarcodeSchedule(null)}
      />
    </div>
  );
};

export default ScreeningScheduleTable;
