import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select, SelectOption } from "@/shared/components/ui/Select";
import {
  StudyProgram,
  CreateStudyProgramPayload,
} from "../types/studyProgram.types";
import { Faculty } from "../../faculty/types/faculty.types";

interface StudyProgramModalProps {
  isOpen: boolean;
  submitting: boolean;
  initialData: StudyProgram | null;
  faculties: Faculty[];
  onClose: () => void;
  onSubmit: (data: CreateStudyProgramPayload) => Promise<{ success: boolean }>;
}

const DEGREE_OPTIONS: SelectOption[] = [
  { value: "D3", label: "D3 - DIPLOMA TIGA" },
  { value: "D4", label: "D4 - DIPLOMA EMPAT" },
  { value: "S1", label: "S1 - SARJANA" },
  { value: "S2", label: "S2 - MAGISTER" },
  { value: "S3", label: "S3 - DOKTOR" },
  { value: "Profesi", label: "PROFESI" },
];

export const StudyProgramModal: React.FC<StudyProgramModalProps> = ({
  isOpen,
  submitting,
  initialData,
  faculties,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [degree, setDegree] = useState("S1");
  const [facultyId, setFacultyId] = useState("");

  // Opsi dropdown fakultas
  const facultyOptions = useMemo<SelectOption[]>(() => {
    const list = faculties.map((f) => ({
      value: f.id,
      label: `[${f.code}] ${f.name}`,
    }));

    return [{ value: "", label: "PILIH FAKULTAS NAUNGAN" }, ...list];
  }, [faculties]);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCode(initialData.code || "");
      setName(initialData.name || "");
      setDegree(initialData.degree || "S1");
      setFacultyId(initialData.facultyId || "");
    } else {
      setCode("");
      setName("");
      setDegree("S1");
      setFacultyId(faculties[0]?.id || "");
    }
  }, [initialData, isOpen, faculties]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !facultyId) return;

    const res = await onSubmit({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      degree,
      facultyId,
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
            {initialData
              ? "EDIT DATA PROGRAM STUDI"
              : "REGISTRASI PROGRAM STUDI BARU"}
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
            label="FAKULTAS NAUNGAN"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            options={facultyOptions}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <Select
                label="JENJANG"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                options={DEGREE_OPTIONS}
                required
              />
            </div>

            <div className="col-span-1 space-y-1">
              <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                KODE RESMI PRODI
              </label>
              <Input
                type="text"
                placeholder="Contoh: IF, SI, TI"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              NAMA PROGRAM STUDI
            </label>
            <Input
              type="text"
              placeholder="Contoh: Teknik Informatika"
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
              {initialData ? "SIMPAN PERUBAHAN" : "REGISTRASI PRODI"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyProgramModal;
