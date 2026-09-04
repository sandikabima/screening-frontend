import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Question } from "../types/question.types";

interface QuestionModalProps {
  isOpen: boolean;
  submitting: boolean;
  initialData: Question | null;
  onClose: () => void;
  onSubmit: (id: string, text: string) => Promise<{ success: boolean }>;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  submitting,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [questionText, setQuestionText] = useState("");

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuestionText(initialData.questionText || "");
    } else {
      setQuestionText("");
    }
  }, [initialData, isOpen]);

  if (!isOpen || !initialData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const res = await onSubmit(initialData.id, questionText.trim());
    if (res?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>EDIT PERTANYAAN:</span>
            <span className="text-amber-400">[{initialData.code}]</span>
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xs cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              REDAKSI TEKS PERTANYAAN
            </label>
            <textarea
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Masukkan redaksi pertanyaan kuesioner..."
              required
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
            >
              SIMPAN PERUBAHAN
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
