import React from "react";
import { ScreeningResultDetail } from "../types/screeningResult.types";

interface ScreeningResultDetailModalProps {
  isOpen: boolean;
  loading: boolean;
  data: ScreeningResultDetail | null;
  onClose: () => void;
}

export const ScreeningResultDetailModal: React.FC<
  ScreeningResultDetailModalProps
> = ({ isOpen, loading, data, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-mono select-none">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-lg p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              INSPEKSI JAWABAN SCREENING & TRIAGE
            </h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              ID SESI: {data?.sessionId || "-"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white cursor-pointer font-bold text-base"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-500 animate-pulse tracking-widest uppercase font-bold">
            MEMUAT DOKUMEN JAWABAN JSONB...
          </div>
        ) : !data ? (
          <div className="p-12 text-center text-xs text-red-500 font-bold uppercase">
            DATA DETAIL TIDAK DITEMUKAN.
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Informasi Mahasiswa */}
            <div className="p-3 bg-black border border-zinc-900 rounded flex flex-wrap justify-between items-center gap-2">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">
                  MAHASISWA
                </span>
                <span className="font-bold text-white text-sm">
                  {data.student?.user?.name}
                </span>
                <span className="text-zinc-400 block text-[10px]">
                  NIM: {data.student?.nim}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">
                  PRODI / ANGKATAN
                </span>
                <span className="text-zinc-200 font-bold">
                  {data.student?.studyProgram?.name}
                </span>
                <span className="text-zinc-400 block text-[10px]">
                  Tahun: {data.student?.cohort?.year}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">
                  EVALUASI ENGINE
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-zinc-900 border border-zinc-700 text-white rounded">
                    SKOR: {data.srqScore}/20
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-950/40 text-amber-400 border border-amber-800 rounded">
                    {data.priorityResult} ({data.reasonCode})
                  </span>
                </div>
              </div>
            </div>

            {/* Alert Safety Flag */}
            {data.rawResponses.safetyFlag && (
              <div className="p-3 bg-red-950/40 border border-red-900/80 rounded text-red-400 font-bold text-[11px] flex items-center gap-2 animate-pulse">
                <span>
                  ⚠️ SAFETY FLAG ACTIVE (REASON R01): TERINDIKASI RISIKO
                  MENYAKITI DIRI
                </span>
              </div>
            )}

            {/* Profile Tag (M1) */}
            {data.rawResponses.m1 && data.rawResponses.m1.length > 0 && (
              <div>
                <label className="block text-zinc-400 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
                  KATEGORI MASALAH UTAMA (M1 - PROFILE TAGS)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {data.rawResponses.m1.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-[10px] font-bold bg-zinc-900 text-amber-400 border border-zinc-800 rounded uppercase tracking-wider"
                    >
                      🏷️ {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skala Indikator Gejala (0-3) */}
            <div>
              <label className="block text-zinc-400 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
                SKALA INDIKATOR GEJALA (0 - 3)
              </label>
              <div className="grid grid-cols-5 gap-2 text-center">
                {Object.entries(data.rawResponses.indicators).map(
                  ([key, val]) => (
                    <div
                      key={key}
                      className="p-2 bg-black border border-zinc-900 rounded"
                    >
                      <span className="text-zinc-500 font-bold block text-[10px] uppercase">
                        {key}
                      </span>
                      <span
                        className={`text-sm font-extrabold ${val > 0 ? "text-amber-400" : "text-zinc-600"}`}
                      >
                        {val}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* 20 Jawaban SRQ */}
            <div>
              <label className="block text-zinc-400 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
                BREAKDOWN 20 ITEM JAWABAN SRQ
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {data.rawResponses.srqAnswers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-2 border rounded flex justify-between items-center text-[11px] ${
                      ans === 1
                        ? "bg-amber-950/20 border-amber-900/50 text-amber-300"
                        : "bg-black border-zinc-900 text-zinc-500"
                    }`}
                  >
                    <span>SOAL #{idx + 1}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                        ans === 1
                          ? "bg-amber-500 text-black"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {ans === 1 ? "YA" : "TIDAK"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-zinc-900">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
          >
            TUTUP INSPEKSI
          </button>
        </div>
      </div>
    </div>
  );
};
