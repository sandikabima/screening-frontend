import React, { useState, useEffect, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import DateInput from "@/shared/components/ui/DateInput";
import { Select, SelectOption } from "@/shared/components/ui/Select";
import {
  ScreeningSchedule,
  CreateSchedulePayload,
  UpdateSchedulePayload,
} from "../types/screeningSchedule.types";
import {
  createScheduleSchema,
  updateScheduleSchema,
} from "../schemas/screeningSchedule.schema";

interface UserTesterOption {
  id: string;
  name: string;
}

interface ScreeningScheduleModalProps {
  isOpen: boolean;
  submitting: boolean;
  initialData: ScreeningSchedule | null;
  testers: UserTesterOption[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<{ success: boolean }>;
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: "ACTIVE", label: "ACTIVE (AKTIF)" },
  { value: "INACTIVE", label: "INACTIVE (NON-AKTIF)" },
  { value: "EXPIRED", label: "EXPIRED (KADALUARSA)" },
];

const getTodayISODate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseToISODate = (rawDate?: string | null): string => {
  if (!rawDate) return getTodayISODate();

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return rawDate;
  }

  if (rawDate.includes("T")) {
    return rawDate.split("T")[0];
  }

  const dateObj = new Date(rawDate);
  if (isNaN(dateObj.getTime())) return getTodayISODate();

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const generateAutoBarcode = (prefix = "SCR"): string => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
};

export const ScreeningScheduleModal: React.FC<ScreeningScheduleModalProps> = ({
  isOpen,
  submitting,
  initialData,
  testers = [],
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [tanggal, setTanggal] = useState<string>(getTodayISODate());
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [testerId, setTesterId] = useState("");
  const [barcodeValue, setBarcodeValue] = useState("");
  const [statusBarcode, setStatusBarcode] = useState<
    "ACTIVE" | "INACTIVE" | "EXPIRED"
  >("ACTIVE");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const testerOptions = useMemo<SelectOption[]>(() => {
    const list = testers.map((t) => ({
      value: t.id,
      label: t.name,
    }));
    return [
      { value: "", label: "-- PILIH TESTER PENANGGUNG JAWAB --" },
      ...list,
    ];
  }, [testers]);

  useEffect(() => {
    if (!isOpen) return;

    setErrors({});
    if (initialData) {
      setName(initialData.name || "");
      setTanggal(parseToISODate(initialData.tanggal));
      setJamMulai(initialData.jamMulai || "");
      setJamSelesai(initialData.jamSelesai || "");
      setTesterId(initialData.testerId || "");
      setBarcodeValue(initialData.barcodeValue || "");
      setStatusBarcode(initialData.statusBarcode || "ACTIVE");
    } else {
      setName("");
      setTanggal(getTodayISODate());
      setJamMulai("");
      setJamSelesai("");
      setTesterId("");
      setBarcodeValue("");
      setStatusBarcode("ACTIVE");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleGenerateBarcode = () => {
    setBarcodeValue(generateAutoBarcode());
    if (errors.barcodeValue) {
      setErrors((prev) => ({ ...prev, barcodeValue: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      name: name.trim(),
      tanggal: tanggal.trim(),
      jamMulai: jamMulai.trim(),
      jamSelesai: jamSelesai.trim(),
      testerId,
      barcodeValue: barcodeValue.trim().toUpperCase(),
      statusBarcode,
    };

    const schema = initialData ? updateScheduleSchema : createScheduleSchema;
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
        const payload: UpdateSchedulePayload = {
          name: formData.name,
          tanggal: formData.tanggal,
          jamMulai: formData.jamMulai,
          jamSelesai: formData.jamSelesai,
          testerId: formData.testerId,
          barcodeValue: formData.barcodeValue,
          statusBarcode: formData.statusBarcode,
        };
        res = await onSubmit(payload);
      } else {
        const payload: CreateSchedulePayload = {
          name: formData.name,
          tanggal: formData.tanggal,
          jamMulai: formData.jamMulai,
          jamSelesai: formData.jamSelesai,
          testerId: formData.testerId,
          barcodeValue: formData.barcodeValue,
        };
        res = await onSubmit(payload);
      }

      if (res?.success) onClose();
    } catch (err: any) {
      if (err?.response?.data?.data && Array.isArray(err.response.data.data)) {
        const backendErrors: Record<string, string> = {};
        err.response.data.data.forEach((item: { message: string }) => {
          const msg = item.message.toLowerCase();
          if (msg.includes("barcode"))
            backendErrors.barcodeValue = item.message;
          else if (msg.includes("name")) backendErrors.name = item.message;
        });
        setErrors((prev) => ({ ...prev, ...backendErrors }));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto select-none">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {initialData
              ? "EDIT JADWAL BATCH SCREENING"
              : "BUAT JADWAL BATCH SCREENING"}
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
          {/* NAMA BATCH */}
          <div className="space-y-1">
            <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              NAMA BATCH SCREENING <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Contoh: Screening Batch 1"
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

          {/* TANGGAL & BARCODE / STATUS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                TANGGAL PELAKSANAAN <span className="text-red-500">*</span>
              </label>

              <DateInput
                value={tanggal}
                onChange={(e) => {
                  setTanggal(e.target.value);
                  if (errors.tanggal)
                    setErrors((prev) => ({ ...prev, tanggal: "" }));
                }}
                placeholder="YYYY-MM-DD"
              />

              {errors.tanggal && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {errors.tanggal}
                </p>
              )}
            </div>

            {initialData ? (
              <div className="space-y-1">
                <Select
                  label="STATUS BARCODE *"
                  value={statusBarcode}
                  onChange={(e) =>
                    setStatusBarcode(
                      e.target.value as "ACTIVE" | "INACTIVE" | "EXPIRED",
                    )
                  }
                  options={STATUS_OPTIONS}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  KODE BARCODE <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1.5">
                  <Input
                    type="text"
                    readOnly
                    placeholder="Klik Generate ->"
                    value={barcodeValue}
                    className="text-amber-400 font-bold uppercase flex-1 bg-zinc-900/60 cursor-not-allowed border-zinc-800"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleGenerateBarcode}
                    title="Generate Kode Otomatis"
                    className="px-2.5 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {errors.barcodeValue && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">
                    {errors.barcodeValue}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* EDIT ONLY: KODE BARCODE & GENERATE */}
          {initialData && (
            <div className="space-y-1">
              <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                KODE BARCODE (SISTEM) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1.5">
                <Input
                  type="text"
                  readOnly
                  placeholder="Klik Generate ->"
                  value={barcodeValue}
                  className="text-amber-400 font-bold uppercase flex-1 bg-zinc-900/60 cursor-not-allowed border-zinc-800"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleGenerateBarcode}
                  title="Generate Kode Baru"
                  className="px-2.5 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
              {errors.barcodeValue && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {errors.barcodeValue}
                </p>
              )}
            </div>
          )}

          {/* WAKTU: JAM MULAI & JAM SELESAI */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                JAM MULAI <span className="text-red-500">*</span>
              </label>
              <Input
                type="time"
                value={jamMulai}
                onChange={(e) => {
                  setJamMulai(e.target.value);
                  if (errors.jamMulai)
                    setErrors((prev) => ({ ...prev, jamMulai: "" }));
                }}
                className="[color-scheme:dark] text-white"
              />
              {errors.jamMulai && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {errors.jamMulai}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                JAM SELESAI <span className="text-red-500">*</span>
              </label>
              <Input
                type="time"
                value={jamSelesai}
                onChange={(e) => {
                  setJamSelesai(e.target.value);
                  if (errors.jamSelesai)
                    setErrors((prev) => ({ ...prev, jamSelesai: "" }));
                }}
                className="[color-scheme:dark] text-white"
              />
              {errors.jamSelesai && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {errors.jamSelesai}
                </p>
              )}
            </div>
          </div>

          {/* TESTER PENANGGUNG JAWAB */}
          <div className="space-y-1">
            <Select
              label="TESTER PENANGGUNG JAWAB *"
              value={testerId}
              onChange={(e) => {
                setTesterId(e.target.value);
                if (errors.testerId)
                  setErrors((prev) => ({ ...prev, testerId: "" }));
              }}
              options={testerOptions}
            />
            {errors.testerId && (
              <p className="text-[10px] text-red-500 font-bold mt-1">
                {errors.testerId}
              </p>
            )}
          </div>

          {/* FOOTER ACTION */}
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
              {initialData ? "SIMPAN PERUBAHAN" : "BUAT JADWAL BATCH"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScreeningScheduleModal;
