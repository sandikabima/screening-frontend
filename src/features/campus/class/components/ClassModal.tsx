import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select, SelectOption } from "@/shared/components/ui/Select";
import { ClassEntity, CreateClassPayload } from "../types/class.types";
import { StudyProgram } from "../../study/types/studyProgram.types";
import { Cohort } from "../../cohort/types/cohort.types";

interface ClassModalProps {
  isOpen: boolean;
  submitting: boolean;
  initialData: ClassEntity | null;
  studyPrograms: StudyProgram[];
  cohorts: Cohort[];
  onClose: () => void;
  onSubmit: (data: CreateClassPayload) => Promise<{ success: boolean }>;
}

export const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  submitting,
  initialData,
  studyPrograms,
  cohorts,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [studyProgramId, setStudyProgramId] = useState("");
  const [cohortId, setCohortId] = useState("");

  const spOptions = useMemo<SelectOption[]>(() => {
    const list = studyPrograms.map((sp) => ({
      value: sp.id,
      label: `[${sp.degree || "S1"}-${sp.code}] ${sp.name}`,
    }));
    return [{ value: "", label: "-- PILIH PROGRAM STUDI --" }, ...list];
  }, [studyPrograms]);

  const cohortOptions = useMemo<SelectOption[]>(() => {
    const list = cohorts.map((c) => ({
      value: c.id,
      label: `${c.name} (${c.year})`,
    }));
    return [{ value: "", label: "-- PILIH ANGKATAN --" }, ...list];
  }, [cohorts]);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialData.name || "");
      setCode(initialData.code || "");
      setStudyProgramId(initialData.studyProgramId || "");
      setCohortId(initialData.cohortId || "");
    } else {
      setName("");
      setCode("");
      setStudyProgramId(studyPrograms[0]?.id || "");
      setCohortId(cohorts[0]?.id || "");
    }
  }, [initialData, isOpen, studyPrograms, cohorts]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !studyProgramId || !cohortId) return;

    const res = await onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      studyProgramId,
      cohortId,
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
            {initialData ? "EDIT DATA KELAS" : "REGISTRASI KELAS BARU"}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xs cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="PROGRAM STUDI"
            value={studyProgramId}
            onChange={(e) => setStudyProgramId(e.target.value)}
            options={spOptions}
            required
          />

          <Select
            label="ANGKATAN / COHORT"
            value={cohortId}
            onChange={(e) => setCohortId(e.target.value)}
            options={cohortOptions}
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-1">
              <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                KODE KELAS
              </label>
              <Input
                type="text"
                placeholder="IF-A"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                NAMA KELAS
              </label>
              <Input
                type="text"
                placeholder="Contoh: IF 2026 A"
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
              {initialData ? "SIMPAN PERUBAHAN" : "REGISTRASI KELAS"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassModal;
