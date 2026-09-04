import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { Role } from "../types/role.types";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";

interface RoleTableProps {
  roles: Role[];
  loading: boolean;
  deletingId: string | null;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

const SKELETON_COLUMNS: ColumnSkeletonConfig[] = [
  { width: "w-32" },
  { width: "w-48" },
  { width: "w-64" },
  { width: "w-36", align: "right", isAction: true },
];

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  loading,
  deletingId,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border border-zinc-900 rounded-lg overflow-x-auto bg-black font-mono select-none w-full shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-900 bg-zinc-950 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            <th className="p-4">KODE SISTEM ROLE</th>
            <th className="p-4">NAMA LABEL TAMPILAN</th>
            <th className="p-4">DESKRIPSI TUGAS</th>
            <th className="p-4 text-right">TINDAKAN OTORITAS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900/80 text-xs">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <TableRowSkeleton key={idx} columns={SKELETON_COLUMNS} />
            ))
          ) : roles.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
              >
                BELUM ADA SKEMA PERAN TERDAFTAR.
              </td>
            </tr>
          ) : (
            roles.map((r) => {
              const safeId = r.id || "";
              const isDeleting = deletingId === safeId;

              return (
                <tr
                  key={safeId}
                  className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                >
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-950/30 text-amber-400 border border-amber-900/60 rounded uppercase tracking-wider">
                      {r.name}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap font-bold text-white">
                    {r.displayName}
                  </td>
                  <td className="p-4 text-zinc-400 max-w-xs truncate">
                    {r.description || "-"}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(r)}
                      disabled={isDeleting}
                    >
                      EDIT ROLE
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={isDeleting}
                      disabled={isDeleting}
                      onClick={() => onDelete(r)}
                    >
                      HAPUS ROLE
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

export default RoleTable;
