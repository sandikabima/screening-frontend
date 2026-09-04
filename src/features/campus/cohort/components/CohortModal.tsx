import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Cohort, CreateCohortPayload } from "../types/cohort.types";
import { StudyProgram } from "../../study/types/studyProgram.types";

interface CohortModalProps {
  isOpen: boolean;
  submitting: boolean;
  initialData: Cohort | null;
  studyPrograms?: StudyProgram[];
  onClose: () => void;
  onSubmit: (data: CreateCohortPayload) => Promise<{ success: boolean }>;
}

export const CohortModal: React.FC<CohortModalProps> = ({
  isOpen,
  submitting,
  initialData,
  onClose,
  onSubmit,
}) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setYear(initialData.year || currentYear);
      setName(initialData.name || "");
    } else {
      setYear(currentYear);
      setName(`Angkatan ${currentYear}`);
    }
  }, [initialData, isOpen, currentYear]);

  const handleYearChange = (val: number) => {
    setYear(val);
    if (!initialData) {
      setName(`Angkatan ${val}`);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !name.trim()) return;

    const res = await onSubmit({
      year: Number(year),
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
            {initialData ? "EDIT DATA ANGKATAN" : "REGISTRASI ANGKATAN BARU"}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xs cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-1">
              <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                TAHUN
              </label>
              <Input
                type="number"
                placeholder="2026"
                value={year}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                required
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                NAMA ANGKATAN / COHORT
              </label>
              <Input
                type="text"
                placeholder="Contoh: Angkatan 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              {initialData ? "SIMPAN PERUBAHAN" : "REGISTRASI ANGKATAN"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CohortModal;
