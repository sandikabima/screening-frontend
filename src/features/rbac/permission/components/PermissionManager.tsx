import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Permission, CreatePermissionPayload } from "../types/permission.types";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import {
  ColumnSkeletonConfig,
  TableRowSkeleton,
} from "@/shared/components/ui/TableRowSkeleton";
import { PermissionModal } from "./PermissionModal";

interface PermissionManagerProps {
  permissions: Permission[];
  loading: boolean;
  submitting: boolean;
  deletingId?: string | null;
  onCreate: (payload: CreatePermissionPayload) => Promise<any>;
  onUpdate?: (id: string, payload: CreatePermissionPayload) => Promise<any>;
  onDelete: (permission: Permission) => void;
}

const PERMISSION_SKELETON_COLUMNS: ColumnSkeletonConfig[] = [
  { width: "w-48" },
  { width: "w-64" },
  { width: "w-32" },
  { width: "w-36", align: "right", isAction: true },
];

export const PermissionManager: React.FC<PermissionManagerProps> = ({
  permissions,
  loading,
  submitting,
  deletingId,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Permission | null>(null);

  const filtered = permissions.filter(
    (p) =>
      p.permissionKey?.toLowerCase().includes(search.toLowerCase()) ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.module?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenCreate = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Permission) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (payload: CreatePermissionPayload) => {
    let result;
    if (editItem && onUpdate) {
      result = await onUpdate(editItem.id, payload);
    } else {
      result = await onCreate(payload);
    }

    if (result?.success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-4 font-mono select-none w-full">
      {/* TOOLBAR CONTAINER */}
      <div className="bg-black/80 p-4 border border-zinc-900 rounded-lg space-y-3">
        {/* TITLE */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626]" />
          <h2 className="text-xs font-black text-white uppercase tracking-wider">
            KATALOG MASTER PERMISSION
          </h2>
        </div>

        {/* TOOLBAR CONTENT */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Cari modul / key..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5 text-zinc-600" />}
            />
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            className="shrink-0 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            BUAT MASTER PERMISSION
          </Button>
        </div>
      </div>

      {/* TABEL KATALOG PERMISSION WITH HORIZONTAL SCROLLBAR */}
      <div className="border border-zinc-900 rounded-lg bg-black w-full shadow-2xl overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-950 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                <th className="p-4">PERMISSION KEY</th>
                <th className="p-4">NAMA OTORITAS</th>
                <th className="p-4">MODUL</th>
                <th className="p-4 text-right">AKSI OPERASIONAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/80 text-xs">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRowSkeleton
                    key={idx}
                    columns={PERMISSION_SKELETON_COLUMNS}
                  />
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-12 text-center text-zinc-600 tracking-widest uppercase font-bold"
                  >
                    TIDAK ADA DATA PERMISSION DITEMUKAN.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isDeleting = deletingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-900/40 transition-colors text-zinc-200"
                    >
                      <td className="p-4 font-bold text-amber-500 font-mono uppercase whitespace-nowrap">
                        {item.permissionKey}
                      </td>
                      <td className="p-4 text-white font-semibold whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-[10px] font-bold bg-zinc-900 text-red-500 border border-zinc-800 rounded uppercase tracking-wider">
                          {item.module}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                          disabled={isDeleting}
                        >
                          EDIT
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          loading={isDeleting}
                          disabled={isDeleting}
                          onClick={() => onDelete(item)}
                        >
                          HAPUS
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PermissionModal
        isOpen={isModalOpen}
        submitting={submitting}
        initialData={editItem}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
};

export default PermissionManager;
