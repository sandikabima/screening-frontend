import React, { useState } from "react";
import {
  ArrowUpDown,
  Calendar,
  FileCode,
  Filter,
  FilterX,
  Layers,
  RefreshCw,
  Search,
  Terminal,
  X,
} from "lucide-react";
import { Pagination as PaginationType } from "@/shared/types/api";
import { Pagination } from "@/shared/components/ui/Pagination";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";
import { formatDate } from "@/shared/utils/formatDate";
import { AuditLogItem } from "../types/audit.types";
import DateInput from "@/shared/components/ui/DateInput";

interface AuditTableProps {
  auditLogs: AuditLogItem[];
  loading: boolean;
  search: string;
  moduleFilter: string;
  actionFilter: string;
  startDate: string;
  endDate: string;
  sortOrder: "asc" | "desc";
  pagination: PaginationType;
  onSearchChange: (val: string) => void;
  onModuleChange: (val: string) => void;
  onActionChange: (val: string) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onSortOrderChange: (val: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
}

const SKELETON_COLUMNS: ColumnSkeletonConfig[] = [
  { width: "w-32" },
  { width: "w-40" },
  { width: "w-28" },
  { width: "w-32" },
  { width: "w-28" },
  { width: "w-24" },
  { width: "w-24", align: "right", isAction: true },
];

const MODULE_OPTIONS = [
  { value: "", label: " SEMUA MODUL" },
  { value: "USER_MANAGEMENT", label: "USER MANAGEMENT" },
  { value: "SYSTEM_SETTING", label: "SYSTEM SETTING" },
  { value: "SCREENING_SRQ20", label: "SCREENING SRQ-20" },
];

const ACTION_OPTIONS = [
  { value: "", label: "SEMUA AKSI" },
  { value: "USER_CREATE", label: "USER CREATE" },
  { value: "USER_UPDATE", label: "USER UPDATE" },
  { value: "USER_DELETE", label: "USER DELETE" },
  { value: "USER_TOGGLE_STATUS", label: "USER TOGGLE STATUS" },
  { value: "PERMISSION_ASSIGN", label: "PERMISSION ASSIGN" },
  { value: "ROLE_CREATE", label: "ROLE CREATE" },
  { value: "ROLE_DELETE", label: "ROLE DELETE" },
];

const SORT_OPTIONS = [
  { value: "desc", label: "TERBARU DULU" },
  { value: "asc", label: "TERLAMA DULU" },
];

export const AuditTable: React.FC<AuditTableProps> = ({
  auditLogs,
  loading,
  search,
  moduleFilter,
  actionFilter,
  startDate,
  endDate,
  sortOrder,
  pagination,
  onSearchChange,
  onModuleChange,
  onActionChange,
  onStartDateChange,
  onEndDateChange,
  onSortOrderChange,
  onPageChange,
  onLimitChange,
  onResetFilters,
  onRefresh,
}) => {
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const getActionBadge = (action: string) => {
    if (action.includes("CREATE")) {
      return "bg-emerald-950/60 text-emerald-400 border-emerald-800/80";
    }
    if (
      action.includes("UPDATE") ||
      action.includes("ASSIGN") ||
      action.includes("TOGGLE")
    ) {
      return "bg-amber-950/60 text-amber-400 border-amber-800/80";
    }
    if (action.includes("DELETE")) {
      return "bg-red-950/60 text-red-400 border-red-800/80";
    }
    return "bg-zinc-900 text-zinc-400 border-zinc-800";
  };

  return (
    <div className="space-y-4 font-mono select-none w-full">
      {/* FILTER CONSOLE */}
      <div className="bg-black/90 p-4 border border-zinc-900 rounded-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* SEARCH INPUT */}
          <div className="flex-1 min-w-[240px]">
            <Input
              type="text"
              placeholder="Cari email pelaku, aksi, atau entitas target..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
            />
          </div>

          {/* SELECT MODUL */}
          <div className="w-48">
            <Select
              options={MODULE_OPTIONS}
              value={moduleFilter}
              onChange={(e) => onModuleChange(e.target.value)}
              leftIcon={<Layers className="h-3.5 w-3.5" />}
            />
          </div>

          {/* SELECT AKSI */}
          <div className="w-48">
            <Select
              options={ACTION_OPTIONS}
              value={actionFilter}
              onChange={(e) => onActionChange(e.target.value)}
              leftIcon={<Filter className="h-3.5 w-3.5" />}
            />
          </div>

          {/* SELECT SORTING */}
          <div className="w-44">
            <Select
              options={SORT_OPTIONS}
              value={sortOrder}
              onChange={(e) =>
                onSortOrderChange(e.target.value as "asc" | "desc")
              }
              leftIcon={<ArrowUpDown className="h-3.5 w-3.5" />}
            />
          </div>

          <div className="flex items-center gap-2">
            <Tooltip text="Muat Ulang Log Audit">
              <Button
                variant="secondary"
                size="md"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${loading ? "animate-spin text-red-500" : ""}`}
                />
              </Button>
            </Tooltip>

            <Tooltip text="Bersihkan Semua Filter">
              <Button variant="secondary" size="md" onClick={onResetFilters}>
                <FilterX className="h-3.5 w-3.5 text-zinc-400 hover:text-red-400" />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* DATE RANGE FILTER CONSOLE */}
        <div className="flex items-center gap-3 pt-2 border-t border-zinc-900/80 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 shrink-0 text-zinc-500 font-bold tracking-wider">
            <Calendar className="h-3.5 w-3.5 text-red-500" />
            <span>RENTANG WAKTU:</span>
          </div>

          <div className="w-44">
            <DateInput
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              placeholder="TANGGAL MULAI"
            />
          </div>

          <span className="text-zinc-600 font-bold">S/D</span>

          <div className="w-44">
            <DateInput
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              placeholder="TANGGAL AKHIR"
            />
          </div>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="border border-zinc-900 rounded-lg overflow-x-auto bg-black font-mono select-none w-full shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <th className="p-4">WAKTU (STAMP)</th>
              <th className="p-4">PELAKU (ACTOR)</th>
              <th className="p-4">AKSI MUTASI</th>
              <th className="p-4">MODUL</th>
              <th className="p-4">TARGET ENTITY</th>
              <th className="p-4">IP ADDRESS</th>
              <th className="p-4 text-center">RINCIAN JSON</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/80 text-xs">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRowSkeleton key={idx} columns={SKELETON_COLUMNS} />
              ))
            ) : auditLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
                >
                  TIDAK ADA CATATAN AUDIT DISIMPANKAN.
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                >
                  {/* WAKTU (STAMP) MENGGUNAKAN HELPER formatDate */}
                  <td className="p-4 text-zinc-400 font-mono whitespace-nowrap text-[11px]">
                    {formatDate(log.createdAt, { variant: "DATE_TIME" })}
                  </td>
                  <td className="p-4 font-bold text-white whitespace-nowrap">
                    {log.actorEmail}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded border uppercase tracking-wider ${getActionBadge(
                        log.action,
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                    {log.module}
                  </td>
                  <td className="p-4 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                    {log.targetEntity ? `${log.targetEntity}` : "-"}
                  </td>
                  <td className="p-4 text-zinc-500 font-mono text-[11px] whitespace-nowrap">
                    {log.ipAddress || "127.0.0.1"}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <Tooltip text="Buka Detail Payload JSON Transaction">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <FileCode className="h-3 w-3 text-red-500 mr-1" />
                        INSPEKSI
                      </Button>
                    </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        loading={loading}
      />

      {/* INSPEKTOR MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono select-none">
          <div className="w-full max-w-2xl bg-black border border-zinc-900 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Terminal className="h-4 w-4 text-red-600" />
                INSPEKSI PAYLOAD AUDIT: {selectedLog.action}
              </div>
              <Tooltip text="Tutup Modal">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 text-[11px] bg-zinc-950 p-3 rounded border border-zinc-900">
                <div>
                  <span className="text-zinc-500 block">TRANSACTION ID:</span>
                  <span className="text-zinc-300 font-mono">
                    {selectedLog.id}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">AKTOR PELAKU:</span>
                  <span className="text-white font-bold">
                    {selectedLog.actorEmail}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">TARGET ID:</span>
                  <span className="text-zinc-400 font-mono">
                    {selectedLog.targetId || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">IP ADDRESS:</span>
                  <span className="text-zinc-400 font-mono">
                    {selectedLog.ipAddress || "::1"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 tracking-wider">
                  PAYLOAD DETAILS (JSON DATA):
                </label>
                <pre className="p-4 bg-zinc-950 border border-zinc-900 rounded text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60">
                  {selectedLog.details
                    ? JSON.stringify(selectedLog.details, null, 2)
                    : "// Tidak ada data rincian payload disimpankan."}
                </pre>
              </div>
            </div>

            <div className="p-3 border-t border-zinc-900 bg-zinc-950 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                TUTUP INSPEKTOR
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditTable;
