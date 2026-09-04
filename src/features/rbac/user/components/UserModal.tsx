import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Role } from "../../role/types/role.types";
import { CreateUserPayload, User } from "../types/user.types";

interface UserModalProps {
  isOpen: boolean;
  submitting: boolean;
  initialData: User | null;
  roles: Role[];
  onClose: () => void;
  onSubmit: (data: CreateUserPayload) => Promise<{ success: boolean }>;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  submitting,
  initialData,
  roles,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateUserPayload>({
    name: "",
    email: "",
    roleId: "",
    password: "",
  });

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        roleId: initialData.roleId || "",
        password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        roleId: roles[0]?.id || "",
        password: "",
      });
    }
  }, [initialData, roles, isOpen]);

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
            {initialData ? "Edit Data Pengguna" : "Registrasi Pengguna Baru"}
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
            label="Nama Lengkap"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Email Resmi"
            type="email"
            required
            placeholder="gmail@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <div>
            <label className="block text-zinc-400 mb-1 font-bold">
              Peran Jabatan (Role)
            </label>
            <select
              required
              value={formData.roleId}
              onChange={(e) =>
                setFormData({ ...formData, roleId: e.target.value })
              }
              className="w-full px-3 py-1.5 bg-black border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:border-red-600"
            >
              <option value="">-- Pilih Role --</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.displayName || r.name}
                </option>
              ))}
            </select>
          </div>

          {!initialData && (
            <Input
              label="Kata Sandi"
              type="password"
              placeholder="••••••••"
              required={!initialData}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          )}

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
              Simpan Data
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
