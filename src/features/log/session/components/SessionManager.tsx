import React from "react";
import { Laptop, LogOut, RefreshCw, Trash2, User } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";
import { formatDate } from "@/shared/utils/formatDate";
import { Session, SessionStatusFilter } from "../types/session.types";

interface SessionManagerProps {
  sessions: Session[];
  loading: boolean;
  revokingId: string | null;
  revokingOthers: boolean;
  statusFilter: SessionStatusFilter;
  onFilterChange: (status: SessionStatusFilter) => void;
  onRevokeSession: (sessionId: string) => void;
  onRevokeOtherSessions: () => void;
  onRefresh: () => void;
}

const SESSION_SKELETON_COLUMNS: ColumnSkeletonConfig[] = [
  { width: "w-64" },
  { width: "w-24" },
  { width: "w-32" },
  { width: "w-32" },
  { width: "w-28", align: "right", isAction: true },
];

export const SessionManager: React.FC<SessionManagerProps> = ({
  sessions,
  loading,
  revokingId,
  revokingOthers,
  statusFilter,
  onFilterChange,
  onRevokeSession,
  onRevokeOtherSessions,
  onRefresh,
}) => {
  return (
    <div className="w-full space-y-4 font-mono select-none">
      {/* TOOLBAR CONTAINER */}
      <div className="w-full space-y-4 rounded-lg border border-zinc-900 bg-black/80 p-4 shadow-xl">
        {/* HEADER TITLE */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626]" />
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
              <Laptop className="h-4 w-4 text-red-500" />
              MANAJEMEN SESI & PERANGKAT AKTIF
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
            </Button>

            <Button
              variant="primary"
              size="md"
              loading={revokingOthers}
              disabled={revokingOthers || loading}
              onClick={onRevokeOtherSessions}
              className="shrink-0"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              LOGOUT PERANGKAT LAIN
            </Button>
          </div>
        </div>

        {/* TAB FILTER STATUS */}
        <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-3">
          {(["all", "active", "inactive"] as SessionStatusFilter[]).map(
            (st) => (
              <Button
                key={st}
                size="md"
                variant={statusFilter === st ? "primary" : "secondary"}
                onClick={() => onFilterChange(st)}
                className="text-[10px] uppercase tracking-wider"
              >
                {st === "all"
                  ? "SEMUA SESI"
                  : st === "active"
                    ? "AKTIF"
                    : "NON-AKTIF / EXPIRED"}
              </Button>
            ),
          )}
        </div>
      </div>

      {/* TABEL SESI PERANGKAT */}
      <div className="w-full overflow-hidden rounded-lg border border-zinc-900 bg-black shadow-2xl">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
          <table className="w-full min-w-[750px] border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-950 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="p-4">INFORMASI PENGGUNA & PERANGKAT</th>
                <th className="p-4">STATUS SESI</th>
                <th className="p-4">WAKTU LOGIN</th>
                <th className="p-4">KEDALUWARSA</th>
                <th className="p-4 text-right">AKSI OPERASIONAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/80 text-xs">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRowSkeleton
                    key={idx}
                    columns={SESSION_SKELETON_COLUMNS}
                  />
                ))
              ) : sessions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-12 text-center font-bold uppercase tracking-widest text-zinc-600"
                  >
                    TIDAK ADA DATA SESI PERANGKAT DITEMUKAN.
                  </td>
                </tr>
              ) : (
                sessions.map((item) => {
                  const isRevokingThis = revokingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="text-zinc-200 transition-colors hover:bg-zinc-900/40"
                    >
                      {/* USER & DEVICE INFO */}
                      <td className="whitespace-nowrap p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 shrink-0 text-red-500" />
                          <span className="text-xs font-bold text-white">
                            {item.userName || "Tanpa Nama"}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[10px] text-zinc-400">
                          {item.userEmail || "-"}
                        </div>
                        <div
                          className="mt-1.5 max-w-xs truncate text-[11px] font-semibold text-zinc-300"
                          title={item.deviceInfo || "Perangkat Tidak Dikenal"}
                        >
                          {item.deviceInfo || "Perangkat Tidak Dikenal"}
                        </div>
                        <div className="mt-1 flex items-center gap-3 font-mono text-[9px] text-zinc-600">
                          <span>SESI ID: {item.id}</span>
                          <span>USER ID: {item.userId}</span>
                        </div>
                      </td>

                      {/* STATUS BADGE */}
                      <td className="whitespace-nowrap p-4">
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded border border-emerald-800 bg-emerald-950/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                            AKTIF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                            {item.isRevoked ? "REVOKED" : "EXPIRED"}
                          </span>
                        )}
                      </td>

                      {/* WAKTU LOGIN (MEMAKAI HELPER DATE_TIME) */}
                      <td className="whitespace-nowrap p-4 text-[11px] text-zinc-400">
                        {formatDate(item.createdAt, { variant: "DATE_TIME" })}
                      </td>

                      {/* KEDALUWARSA (MEMAKAI HELPER DATE_TIME) */}
                      <td className="whitespace-nowrap p-4 text-[11px] text-zinc-500">
                        {formatDate(item.expiredAt, { variant: "DATE_TIME" })}
                      </td>

                      {/* AKSI REVOKE */}
                      <td className="whitespace-nowrap p-4 text-right">
                        {item.isActive ? (
                          <Button
                            variant="danger"
                            size="md"
                            loading={isRevokingThis}
                            disabled={isRevokingThis}
                            onClick={() => onRevokeSession(item.id)}
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            PUTUS AKSES
                          </Button>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                            NON-AKTIF
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;
