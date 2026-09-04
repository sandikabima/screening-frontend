import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select, SelectOption } from "@/shared/components/ui/Select";
import {
  Student,
  CreateStudentPayload,
  UpdateStudentPayload,
} from "../types/student.types";
import {
  createStudentSchema,
  updateStudentSchema,
} from "../schemas/student.schema";
import { Faculty } from "../../faculty/types/faculty.types";
import { StudyProgram } from "../../study/types/studyProgram.types";
import { Cohort } from "../../cohort/types/cohort.types";
import { ClassEntity } from "../../class/types/class.types";

interface StudentModalProps {
  isOpen: boolean;
  submitting: boolean;
  initialData: Student | null;
  faculties: Faculty[];
  studyPrograms: StudyProgram[];
  cohorts: Cohort[];
  classes?: ClassEntity[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<{ success: boolean }>;
}

const GENDER_OPTIONS: SelectOption[] = [
  { value: "L", label: "LAKI-LAKI" },
  { value: "P", label: "PEREMPUAN" },
];

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  submitting,
  initialData,
  faculties,
  studyPrograms,
  cohorts,
  classes = [],
  onClose,
  onSubmit,
}) => {
  const [nim, setNim] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<"L" | "P">("L");
  const [facultyId, setFacultyId] = useState("");
  const [studyProgramId, setStudyProgramId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [classId, setClassId] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const facultyOptions = useMemo<SelectOption[]>(() => {
    const list = faculties.map((f) => ({
      value: f.id,
      label: `[${f.code}] ${f.name}`,
    }));
    return [{ value: "", label: "-- PILIH FAKULTAS --" }, ...list];
  }, [faculties]);

  // 2. Options Prodi (Filter berdasarkan fakultas terpilih)
  const spOptions = useMemo<SelectOption[]>(() => {
    const filtered = facultyId
      ? studyPrograms.filter((sp) => sp.facultyId === facultyId)
      : [];

    const list = filtered.map((sp) => ({
      value: sp.id,
      label: `[${sp.degree || "S1"}-${sp.code}] ${sp.name}`,
    }));

    return [{ value: "", label: "-- PILIH PRODI --" }, ...list];
  }, [studyPrograms, facultyId]);

  // 3. Options Cohort / Angkatan
  const cohortOptions = useMemo<SelectOption[]>(() => {
    const list = cohorts.map((c) => ({
      value: c.id,
      label: `${c.name} (${c.year})`,
    }));
    return [{ value: "", label: "-- PILIH ANGKATAN --" }, ...list];
  }, [cohorts]);

  // 4. Options Kelas (Filter berdasarkan prodi & angkatan terpilih)
  const classOptions = useMemo<SelectOption[]>(() => {
    const filtered =
      studyProgramId && cohortId
        ? classes.filter(
            (cl) =>
              cl.studyProgramId === studyProgramId && cl.cohortId === cohortId,
          )
        : [];

    const list = filtered.map((cl) => ({
      value: cl.id,
      label: `[${cl.code}] ${cl.name}`,
    }));

    return [{ value: "", label: "-- TANPA KELAS / OPSIONAL --" }, ...list];
  }, [classes, studyProgramId, cohortId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErrors({});
    if (initialData) {
      setNim(initialData.nim || "");
      setName(initialData.user?.name || "");
      setEmail(initialData.user?.email || "");
      setPassword("");
      setPhoneNumber(initialData.phoneNumber || "");
      setGender(initialData.gender || "L");

      const sp = initialData.studyProgram || initialData.study_program;
      setFacultyId(sp?.facultyId || "");
      setStudyProgramId(initialData.studyProgramId || "");
      setCohortId(initialData.cohortId || "");
      setClassId(initialData.classId || "");
    } else {
      setNim("");
      setName("");
      setEmail("");
      setPassword("");
      setPhoneNumber("");
      setGender("L");
      setFacultyId("");
      setStudyProgramId("");
      setCohortId("");
      setClassId("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      nim: nim.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phoneNumber: phoneNumber.trim(),
      gender,
      facultyId,
      studyProgramId,
      cohortId,
      classId: classId || undefined,
    };

    const schema = initialData ? updateStudentSchema : createStudentSchema;
    const validation = schema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      const formatted = validation.error.format();

      Object.keys(formatted).forEach((key) => {
        if (key !== "_errors") {
          const errObj = (formatted as any)[key];
          if (errObj?._errors?.[0]) {
            fieldErrors[key] = errObj._errors[0];
          }
        }
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      let res;
      if (initialData) {
        const payload: UpdateStudentPayload = {
          name: formData.name,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          studyProgramId: formData.studyProgramId,
          cohortId: formData.cohortId,
          classId: formData.classId,
        };
        res = await onSubmit(payload);
      } else {
        const payload: CreateStudentPayload = {
          nim: formData.nim,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          studyProgramId: formData.studyProgramId,
          cohortId: formData.cohortId,
          classId: formData.classId,
        };
        res = await onSubmit(payload);
      }

      if (res?.success) onClose();
    } catch (err: any) {
      if (err?.response?.data?.data && Array.isArray(err.response.data.data)) {
        const backendErrors: Record<string, string> = {};
        err.response.data.data.forEach((item: { message: string }) => {
          const msg = item.message.toLowerCase();
          if (msg.includes("password")) backendErrors.password = item.message;
          else if (msg.includes("phone"))
            backendErrors.phoneNumber = item.message;
          else if (msg.includes("email")) backendErrors.email = item.message;
          else if (msg.includes("nim")) backendErrors.nim = item.message;
        });
        setErrors((prev) => ({ ...prev, ...backendErrors }));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {initialData ? "EDIT DATA MAHASISWA" : "REGISTRASI MAHASISWA BARU"}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-zinc-500 hover:text-white text-xs cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* ROW 1: NIM & GENDER */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                NIM (NOMOR INDUK) <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="2026001001"
                value={nim}
                onChange={(e) => {
                  setNim(e.target.value);
                  if (errors.nim) setErrors((prev) => ({ ...prev, nim: "" }));
                }}
                disabled={!!initialData}
              />
              {errors.nim && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {errors.nim}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Select
                label="JENIS KELAMIN *"
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value as "L" | "P");
                  if (errors.gender)
                    setErrors((prev) => ({ ...prev, gender: "" }));
                }}
                options={GENDER_OPTIONS}
              />
              {errors.gender && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {errors.gender}
                </p>
              )}
            </div>
          </div>

          {/* ROW 2: NAMA LENGKAP */}
          <div className="space-y-1">
            <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              NAMA LENGKAP <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Contoh: Alex Wijaya"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />
            {errors.name && (
              <p className="text-[10px] text-red-500 font-bold mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {!initialData ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  EMAIL <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="alex@student.ac.id"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  PASSWORD AKUN <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Password123"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                />
                {errors.password && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                EMAIL AKUN (READONLY)
              </label>
              <Input
                type="email"
                value={email}
                disabled
                className="opacity-60 cursor-not-allowed bg-zinc-900/50"
              />
            </div>
          )}

          {/* ROW 4: TELEPON */}
          <div className="space-y-1">
            <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              NOMOR TELEPON / WHATSAPP <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="081234567890"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (errors.phoneNumber)
                  setErrors((prev) => ({ ...prev, phoneNumber: "" }));
              }}
            />
            {errors.phoneNumber && (
              <p className="text-[10px] text-red-500 font-bold mt-1">
                {errors.phoneNumber}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Select
                label="FAKULTAS NAUNGAN *"
                value={facultyId}
                onChange={(e) => {
                  setFacultyId(e.target.value);
                  setStudyProgramId("");
                  setClassId("");
                  if (errors.facultyId)
                    setErrors((prev) => ({ ...prev, facultyId: "" }));
                }}
                options={facultyOptions}
              />
              {errors.facultyId && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {errors.facultyId}
                </p>
              )}
            </div>

            <div
              className={`space-y-1 transition-opacity ${
                !facultyId
                  ? "opacity-35 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
            >
              <Select
                label="PROGRAM STUDI *"
                value={studyProgramId}
                onChange={(e) => {
                  setStudyProgramId(e.target.value);
                  setClassId("");
                  if (errors.studyProgramId)
                    setErrors((prev) => ({ ...prev, studyProgramId: "" }));
                }}
                options={spOptions}
                disabled={!facultyId}
              />
              {errors.studyProgramId && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {errors.studyProgramId}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Select
                label="ANGKATAN / COHORT *"
                value={cohortId}
                onChange={(e) => {
                  setCohortId(e.target.value);
                  setClassId("");
                  if (errors.cohortId)
                    setErrors((prev) => ({ ...prev, cohortId: "" }));
                }}
                options={cohortOptions}
              />
              {errors.cohortId && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {errors.cohortId}
                </p>
              )}
            </div>

            <div
              className={`space-y-1 transition-opacity ${
                !studyProgramId || !cohortId
                  ? "opacity-35 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
            >
              <Select
                label="KELAS / ROMBEL (OPSIONAL)"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                options={classOptions}
                disabled={!studyProgramId || !cohortId}
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
              {initialData ? "SIMPAN PERUBAHAN" : "REGISTRASI MAHASISWA"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
