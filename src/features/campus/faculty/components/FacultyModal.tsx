import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Faculty, CreateFacultyPayload } from "../types/faculty.types";

interface FacultyModalProps {
  isOpen: boolean;
  submitting: boolean;
  initialData: Faculty | null;
  onClose: () => void;
  onSubmit: (data: CreateFacultyPayload) => Promise<{ success: boolean }>;
}

export const FacultyModal: React.FC<FacultyModalProps> = ({
  isOpen,
  submitting,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCode(initialData.code || "");
      setName(initialData.name || "");
    } else {
      setCode("");
      setName("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const res = await onSubmit({
      code: code.trim().toUpperCase(),
      name: name.trim(),
    });

    if (res?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {initialData ? "EDIT DATA FAKULTAS" : "REGISTRASI FAKULTAS BARU"}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              KODE RESMI FAKULTAS
            </label>
            <Input
              type="text"
              placeholder="Contoh: FT, FK, FEB"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              NAMA FAKULTAS
            </label>
            <Input
              type="text"
              placeholder="Contoh: Fakultas Teknik"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-900">
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={submitting}
              onClick={onClose}
            >
              BATAL
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
            >
              {initialData ? "SIMPAN PERUBAHAN" : "REGISTRASI FAKULTAS"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyModal;
