import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { CreateRolePayload, Role } from "../types/role.types";

interface RoleModalProps {
  isOpen: boolean;
  submitting: boolean;
  initialData: Role | null;
  onClose: () => void;
  onSubmit: (data: CreateRolePayload) => Promise<{ success: boolean }>;
}

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  submitting,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateRolePayload>({
    name: "",
    displayName: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: initialData.name || "",
        displayName: initialData.displayName || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({ name: "", displayName: "", description: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await onSubmit(formData);
    if (res.success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-mono">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-lg p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            {initialData ? "Edit Skema Peran" : "Tambah Peran Baru"}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white cursor-pointer font-bold text-base"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <Input
            label="Kode Sistem Role (SNAKE_CASE)"
            required
            placeholder="AUDITOR"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value.toUpperCase() })
            }
            className="text-amber-400 font-bold"
          />

          <Input
            label="Nama Tampilan Teks"
            required
            placeholder="Audit System"
            value={formData.displayName}
            onChange={(e) =>
              setFormData({ ...formData, displayName: e.target.value })
            }
          />

          <div>
            <label className="block text-zinc-400 mb-1 font-bold">
              Deskripsi Otoritas
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-1.5 bg-black border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:border-red-600 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-900">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              loading={submitting}
            >
              Simpan Peran
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
