import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { FollowUpStatus } from "../types/followUp.types";

interface TicketModalData {
  id: string;
  status: FollowUpStatus;
  notes?: string | null;
  studentName?: string;
  priorityResult?: string;
  handledByName?: string;
}

interface UpdateFollowUpModalProps {
  isOpen: boolean;
  loading: boolean;
  ticket: TicketModalData | null;
  onClose: () => void;
  onSubmit: (id: string, status: FollowUpStatus, notes: string) => void;
}

export const UpdateFollowUpModal: React.FC<UpdateFollowUpModalProps> = ({
  isOpen,
  loading,
  ticket,
  onClose,
  onSubmit,
}) => {
  const [status, setStatus] = useState<FollowUpStatus>("Belum");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (ticket) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus(ticket.status);
      setNotes(ticket.notes || "");
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-mono select-none">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-lg p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            UPDATE INTERVENSI KLINIS TIKET
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white font-bold text-base leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-black border border-zinc-900 rounded flex justify-between items-center">
            <div>
              <span className="text-zinc-500 text-[10px] block font-bold">
                MAHASISWA
              </span>
              <span className="font-bold text-white">
                {ticket.studentName || "N/A"}
              </span>
              {ticket.handledByName && (
                <span className="text-[10px] text-amber-500 block mt-0.5">
                  Penangan: {ticket.handledByName}
                </span>
              )}
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-900 rounded">
              {ticket.priorityResult || "-"}
            </span>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-bold text-[10px] uppercase">
              STATUS PENANGANAN
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as FollowUpStatus)}
              className="w-full p-2 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-red-600 cursor-pointer"
            >
              <option value="Belum">BELUM DITANGANI (PENDING)</option>
              <option value="Dijadwalkan">
                DIJADWALKAN (KONSELING / SESI)
              </option>
              <option value="Selesai">SELESAI (CLOSED INTERVENTION)</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-bold text-[10px] uppercase">
              CATATAN TIKET & DIAGNOSIS PSIKOLOG
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Masukkan rincian hasil konseling / tindakan..."
              className="w-full p-2.5 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-red-600 resize-none text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-900">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            BATAL
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={loading}
            onClick={() => onSubmit(ticket.id, status, notes)}
          >
            SIMPAN PERUBAHAN
          </Button>
        </div>
      </div>
    </div>
  );
};
