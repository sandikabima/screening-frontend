import React from "react";
import { User } from "../types/user.types";
import { Tooltip } from "@/shared/components/ui/Tooltip";
import { Button } from "@/shared/components/ui/Button";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";

interface UserTableProps {
  users: User[];
  loading: boolean;
  deletingId: string | null;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

const SKELETON_COLUMNS: ColumnSkeletonConfig[] = [
  { isIdentity: true },
  { width: "w-48" },
  { width: "w-32" },
  { width: "w-20" },
  { width: "w-36", align: "right", isAction: true },
];

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  deletingId,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="border border-zinc-900 rounded-lg overflow-hidden bg-black font-mono select-none w-full shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-900 bg-zinc-950 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            <th className="p-4">IDENTITAS PERSONEL</th>
            <th className="p-4">SEBUTAN JABATAN</th>
            <th className="p-4">ROLE AKSES</th>
            <th className="p-4">STATUS AKUN</th>
            <th className="p-4 text-right">TINDAKAN OTORITAS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900/80 text-xs">
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRowSkeleton key={idx} columns={SKELETON_COLUMNS} />
            ))
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
              >
                TIDAK ADA DATA PERSONEL DITEMUKAN.
              </td>
            </tr>
          ) : (
            users.map((u) => {
              const safeId = u.id || "";
              const initials = u.name
                ? u.name
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "MC";

              const isDeleting = deletingId === safeId;

              return (
                <tr
                  key={safeId}
                  className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                >
                  {/* Identitas Personel */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-400 text-xs shadow-inner shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">
                          {u.name || "Evaluator Klinis"}
                        </div>
                        <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                          <span>{u.email}</span>
                          <span className="text-zinc-700">•</span>
                          <Tooltip text={`Full Node ID: ${safeId}`}>
                            <span className="text-zinc-600 cursor-help hover:text-zinc-400 transition-colors">
                              ID:{" "}
                              {safeId ? `${safeId.substring(0, 8)}...` : "-"}
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Sebutan Jabatan */}
                  <td className="p-4 whitespace-nowrap font-bold text-zinc-300">
                    {u.roleDisplayName ||
                      u.displayName ||
                      u.name ||
                      "Staf Penguji Klinis"}
                  </td>

                  {/* Role Akses */}
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 text-[9px] font-bold border rounded uppercase tracking-wider cursor-default ${
                        u.role === "SUPER_ADMIN" || u.role === "ADMIN"
                          ? "bg-red-950/40 text-red-400 border-red-900/80"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800"
                      }`}
                    >
                      {u.role || "USER"}
                    </span>
                  </td>

                  {/* Status Akun Interaktif */}
                  <td className="p-4 whitespace-nowrap">
                    <Tooltip
                      text={
                        u.isActive
                          ? "Klik untuk menonaktifkan akun"
                          : "Klik untuk mengaktifkan akun"
                      }
                    >
                      <button
                        type="button"
                        onClick={() => onToggleStatus(safeId, u.isActive)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-full cursor-pointer border transition-all inline-flex items-center gap-1.5 ${
                          u.isActive
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/80 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                            : "bg-red-950/40 text-red-400 border-red-900/80"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.isActive
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-red-500"
                          }`}
                        />
                        {u.isActive ? "AKTIF" : "NONAKTIF"}
                      </button>
                    </Tooltip>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-4 text-right whitespace-nowrap space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(u)}
                      disabled={isDeleting}
                    >
                      EDIT AKUN
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={isDeleting}
                      disabled={isDeleting}
                      onClick={() => onDelete(u)}
                    >
                      HAPUS AKUN
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
