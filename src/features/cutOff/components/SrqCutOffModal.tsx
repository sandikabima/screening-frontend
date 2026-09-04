import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { SrqCutOff, UpdateSrqCutOffPayload } from "../types/srqCutOff.types";

interface SrqCutOffModalProps {
  isOpen: boolean;
  submitting: boolean;
  initialData: SrqCutOff | null;
  onClose: () => void;
  onSubmit: (payload: UpdateSrqCutOffPayload) => Promise<{ success: boolean }>;
}

export const SrqCutOffModal: React.FC<SrqCutOffModalProps> = ({
  isOpen,
  submitting,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [cutoffScore, setCutoffScore] = useState<number>(6);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCutoffScore(initialData.cutoffScore || 6);
      setLabel(initialData.label || "");
      setDescription(initialData.description || "");
    }
  }, [initialData, isOpen]);

  if (!isOpen || !initialData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const res = await onSubmit({
      cutoffScore: Number(cutoffScore),
      label: label.trim(),
      description: description.trim(),
    });

    if (res?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>PENGATURAN CUT-OFF SRQ-20</span>
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xs cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              BATAS SKOR (CUT-OFF SCORE 1-20)
            </label>
            <Input
              type="number"
              min={1}
              max={20}
              value={cutoffScore}
              onChange={(e) => setCutoffScore(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              LABEL DIAGNOSIS / INDIKASI
            </label>
            <Input
              type="text"
              placeholder="Contoh: Indikasi Distress Psikologis"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              DESKRIPSI &amp; PETUNJUK PENANGANAN
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan instruksi penanganan untuk tim psikolog..."
              className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all font-mono"
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
              className="bg-amber-600 hover:bg-amber-500 text-black font-bold border-amber-500"
            >
              SIMPAN PERUBAHAN
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SrqCutOffModal;
