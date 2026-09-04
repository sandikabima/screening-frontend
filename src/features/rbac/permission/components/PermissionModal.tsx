import React, { useState, useEffect } from "react";
import { X, ShieldPlus } from "lucide-react";
import { Permission, CreatePermissionPayload } from "../types/permission.types";
import { Button } from "@/shared/components/ui/Button";

interface PermissionModalProps {
  isOpen: boolean;
  submitting: boolean;
  initialData?: Permission | null;
  onClose: () => void;
  onSubmit: (payload: CreatePermissionPayload) => Promise<any>;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  submitting,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [permissionKey, setPermissionKey] = useState("");
  const [name, setName] = useState("");
  const [module, setModule] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPermissionKey(initialData.permissionKey || "");
        setName(initialData.name || "");
        setModule(initialData.module || "");
      } else {
        setPermissionKey("");
        setName("");
        setModule("");
      }
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onSubmit({
      permissionKey: permissionKey.trim().toUpperCase(),
      name: name.trim(),
      module: module.trim().toUpperCase(),
    });

    if (result?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono select-none">
      <div className="w-full max-w-md bg-black border border-zinc-900 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <ShieldPlus className="h-4 w-4 text-red-600" />
            {initialData
              ? "EDIT MASTER PERMISSION"
              : "BUAT MASTER PERMISSION BARU"}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* FORM 3 INPUT FIELDS */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 tracking-wider">
              PERMISSION KEY *
            </label>
            <input
              type="text"
              required
              placeholder="SCREENING_SRQ20_READ"
              value={permissionKey}
              onChange={(e) => setPermissionKey(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:border-red-600 font-mono text-xs uppercase"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 tracking-wider">
              NAMA OTORITAS *
            </label>
            <input
              type="text"
              required
              placeholder="Lihat Hasil Screening SRQ-20"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:border-red-600 font-sans text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 tracking-wider">
              MODUL *
            </label>
            <input
              type="text"
              required
              placeholder="SCREENING_SRQ20"
              value={module}
              onChange={(e) => setModule(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:border-red-600 font-mono text-xs uppercase"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-900">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              BATAL
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={submitting}
            >
              {submitting ? "PROSES..." : "SIMPAN PERMISSION"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionModal;
