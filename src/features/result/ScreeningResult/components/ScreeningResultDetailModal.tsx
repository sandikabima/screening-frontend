import React from "react";
import ReactDOMServer from "react-dom/server";
import { ScreeningResultDetail } from "../types/screeningResult.types";
import { IndividualReport } from "./IndividualReport";

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

  const handlePrintReport = () => {
    if (!data) return;

    const reportHtml = ReactDOMServer.renderToString(
      <IndividualReport data={data} />,
    );

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";

    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) return;

    const baseUrl = window.location.origin;

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>LAPORAN HASIL SCREENING KESEHATAN MENTAL MAHASISWA</title>
          <base href="${baseUrl}/" />
          <style>
            @page { size: 215mm 330mm; margin: 6mm 8mm; }
            * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body { font-family: 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif; background: #ffffff !important; color: #1e293b !important; margin: 0; padding: 0; font-size: 9.5px; line-height: 1.3; }
            .report-container { max-width: 198mm; margin: 0 auto; }
            .header-banner { background: linear-gradient(135deg, #15803d 0%, #166534 100%) !important; color: #ffffff !important; padding: 6px 10px; display: flex; align-items: center; gap: 10px; margin-bottom: 6px; border-radius: 4px; }
            .header-logo-wrapper { width: 32px; height: 32px; background-color: #ffffff; border-radius: 4px; padding: 2px; display: flex; align-items: center; justify-content: center; }
            .header-logo-img { max-width: 100%; max-height: 100%; object-fit: contain; }
            .header-text { text-align: left; }
            .univ-name { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
            .upt-name { font-size: 8px; opacity: 0.85; margin-top: 1px; }
            .doc-title { font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 3px; letter-spacing: 0.4px; }
            .meta-table, .identity-table, .srq-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; font-size: 9px; }
            .meta-table td, .identity-table td, .srq-table td { border: 1px solid #cbd5e1; padding: 3px 6px; }
            .meta-label, .id-label { background-color: #f8fafc !important; color: #475569; font-weight: 600; }
            .meta-label { width: 20%; }
            .meta-val { width: 30%; color: #0f172a; }
            .id-label { width: 16%; }
            .id-val { width: 34%; color: #0f172a; }
            .section-block { margin-bottom: 6px; }
            .section-title { color: #166534 !important; font-size: 10px; font-weight: 700; margin: 0 0 3px 0; padding-bottom: 2px; border-bottom: 1.5px solid #166534 !important; }
            .priority-card { background-color: #fffbe6 !important; border: 1px solid #f59e0b !important; border-left: 4px solid #d97706 !important; padding: 5px 8px; margin-bottom: 6px; border-radius: 3px; }
            .priority-badge-title { color: #b45309 !important; font-size: 10.5px; font-weight: 800; text-transform: uppercase; }
            .priority-reason-text { color: #78350f !important; font-size: 8px; margin-top: 1px; }
            .srq-table th { background-color: #166534 !important; color: #ffffff !important; border: 1px solid #166534 !important; padding: 3.5px 6px; font-weight: 700; }
            .bg-zebra { background-color: #f8fafc !important; }
            .tags-container { display: flex; gap: 5px; padding: 4px 6px; border: 1px dashed #cbd5e1; border-radius: 3px; background-color: #fafafa; }
            .tag-chip { background-color: #e2e8f0 !important; color: #334155 !important; padding: 1.5px 6px; border-radius: 8px; font-size: 8px; font-weight: 600; }
            .notes-box-styled { min-height: 50px; border: 1px solid #cbd5e1; border-radius: 3px; padding: 5px 7px; margin-bottom: 3px; background-color: #fafafa; }
            .notes-placeholder { color: #94a3b8; font-style: italic; font-size: 8.5px; }
            .recommendation-list { display: flex; flex-direction: column; gap: 3px; font-size: 9px; margin-top: 3px; }
            .rec-item { display: flex; align-items: center; gap: 5px; }
            .custom-checkbox { width: 10px; height: 10px; accent-color: #166534; }
            .signature-container { display: flex; width: 100%; margin-top: 8px; border: 1px solid #cbd5e1; border-radius: 3px; min-height: 60px; }
            .sig-box { width: 50%; border-right: 1px solid #cbd5e1; padding: 5px 7px; display: flex; flex-direction: column; justify-content: space-between; }
            .sig-box:last-child { border-right: none; }
            .sig-header { font-size: 8.5px; color: #475569; }
            .sig-footer { font-size: 9px; font-weight: 700; }
            .meta-footer { font-size: 7.5px; color: #64748b; font-style: italic; margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 3px; }
          </style>
        </head>
        <body>
          ${reportHtml}
        </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 1500);
    }, 250);
  };

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

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-900">
          {data && (
            <button
              onClick={handlePrintReport}
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 text-white rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              🖨️ CETAK LAPORAN
            </button>
          )}
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
