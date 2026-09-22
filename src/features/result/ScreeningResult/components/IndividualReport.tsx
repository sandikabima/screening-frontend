import React from "react";
import { ScreeningResultDetail } from "../types/screeningResult.types";
import { transformDetailToReport } from "@/shared/utils/report.transformer";

interface IndividualReportProps {
  data: ScreeningResultDetail | null;
}

export const IndividualReport: React.FC<IndividualReportProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="p-8 text-center text-red-500 font-mono text-xs font-bold">
        TIDAK ADA DATA LAPORAN UNTUK DITAMPILKAN.
      </div>
    );
  }

  // Transform data real dari props
  const report = transformDetailToReport(data);

  return (
    <div className="report-container font-sans text-[9px] text-slate-800 leading-tight">
      {/* Header Banner */}
      <div className="header-banner">
        <div className="header-logo-wrapper">
          <img
            src="/logo.png"
            alt="Logo Universitas"
            className="header-logo-img"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <div className="header-text">
          <div className="univ-name">UNIVERSITAS BAITURRAHMAH</div>
          <div className="upt-name">UPT Layanan Psikologi dan Difabel</div>
          <div className="doc-title">
            LAPORAN HASIL SCREENING KESEHATAN MENTAL MAHASISWA
          </div>
        </div>
      </div>

      {/* Dokumen Metadata Table */}
      <table className="meta-table">
        <tbody>
          <tr>
            <td className="meta-label">No. Dokumen</td>
            <td className="meta-val font-semibold">{report.docNumber}</td>
            <td className="meta-label">Kategori Hasil</td>
            <td className="meta-val font-bold text-amber-700">
              {report.category}
            </td>
          </tr>
          <tr>
            <td className="meta-label">Tanggal Pengisian</td>
            <td className="meta-val">{report.fillDate}</td>
            <td className="meta-label">Tanggal Dicetak</td>
            <td className="meta-val">{report.printDate}</td>
          </tr>
        </tbody>
      </table>

      {/* 1. Identitas */}
      <div className="section-block">
        <h3 className="section-title">1. Identitas Mahasiswa</h3>
        <table className="identity-table">
          <tbody>
            <tr>
              <td className="id-label">NIM</td>
              <td className="id-val font-medium">{report.student.nim}</td>
              <td className="id-label">Inisial</td>
              <td className="id-val font-medium">{report.student.initials}</td>
            </tr>
            <tr>
              <td className="id-label">Fakultas</td>
              <td className="id-val">{report.student.faculty}</td>
              <td className="id-label">Program Studi</td>
              <td className="id-val">{report.student.studyProgram}</td>
            </tr>
            <tr>
              <td className="id-label">Angkatan</td>
              <td className="id-val">{report.student.batch}</td>
              <td className="id-label">Kelas</td>
              <td className="id-val">{report.student.className}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Priority Banner Card */}
      <div className="priority-card">
        <div className="priority-badge-title">{report.category}</div>
        <div className="priority-reason-text">
          Reason code: {report.reasonCodeText}
        </div>
      </div>

      {/* 2. Detail Hasil SRQ-20 dan Pertanyaan Triage */}
      <div className="section-block">
        <h3 className="section-title">
          2. Detail Hasil SRQ-20 dan Pertanyaan Triage
        </h3>
        <table className="srq-table">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Kode</th>
              <th style={{ width: "45%" }}>Variabel</th>
              <th style={{ width: "33%" }}>Jawaban</th>
              <th style={{ width: "12%" }}>Nilai</th>
            </tr>
          </thead>
          <tbody>
            {report.triageDetails.map((row, idx) => (
              <tr
                key={row.code || idx}
                className={idx % 2 === 1 ? "bg-zebra" : ""}
              >
                <td className="font-bold text-emerald-900">{row.code}</td>
                <td>{row.label}</td>
                <td>{row.answer}</td>
                <td className="font-bold">{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Profil Tags */}
      <div className="section-block">
        <h3 className="section-title">3. Profil Tags (M1)</h3>
        <div className="tags-container">
          {report.m1Tags && report.m1Tags.length > 0 ? (
            report.m1Tags.map((tag, idx) => (
              <span key={idx} className="tag-chip">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-slate-400 italic text-[8px]">
              Tidak ada tag masalah utama terpilih
            </span>
          )}
        </div>
      </div>

      {/* 4. Catatan Profesional Psikolog (DIPERBESAR) */}
      <div className="section-block">
        <h3 className="section-title">4. Catatan Profesional Psikolog</h3>
        <div className="notes-box-styled flex flex-col justify-start">
          {report.psychologistNotes ? (
            <p className="whitespace-pre-wrap leading-relaxed">
              {report.psychologistNotes}
            </p>
          ) : (
            <span className="notes-placeholder"></span>
          )}
        </div>
      </div>

      {/* 5. Rekomendasi Tindak Lanjut */}
      <div className="section-block">
        <h3 className="section-title">5. Rekomendasi Tindak Lanjut</h3>
        <div className="recommendation-list">
          <div className="rec-item">
            <input type="checkbox" readOnly className="custom-checkbox" />
            <span>
              Dihubungi untuk sesi P3K Psikologi (konsultasi awal) di UPT LPD
            </span>
          </div>
          <div className="rec-item">
            <input type="checkbox" readOnly className="custom-checkbox" />
            <span>
              Dirujuk ke psikolog/psikiater mitra praktik mandiri (di luar UPT)
            </span>
          </div>
          <div className="rec-item">
            <input type="checkbox" readOnly className="custom-checkbox" />
            <span>Dipantau berkala tanpa tindakan segera (monitoring)</span>
          </div>
          <div className="rec-item">
            <input type="checkbox" readOnly className="custom-checkbox" />
            <span>Diarahkan ke layanan/edukasi preventif</span>
          </div>
          <div className="rec-item">
            <input type="checkbox" readOnly className="custom-checkbox" />
            <span>
              Lainnya: __________________________________________________
            </span>
          </div>
        </div>
      </div>

      {/* 6. Status Administratif */}
      <div className="section-block">
        <h3 className="section-title">6. Status Administratif</h3>
        <table className="srq-table">
          <thead>
            <tr>
              <th style={{ width: "60%" }}>Field</th>
              <th style={{ width: "40%" }}>Isi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium">Persetujuan dihubungi UPT (Q12)</td>
              <td className="font-semibold text-emerald-700">
                {report.administrative.consent}
              </td>
            </tr>
            <tr className="bg-zebra">
              <td className="font-medium">Status tindak lanjut saat ini</td>
              <td>{report.administrative.status}</td>
            </tr>
            <tr>
              <td className="font-medium">Tanggal tindak lanjut terakhir</td>
              <td>{report.administrative.lastFollowUp}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signature Box (DIPERBESAR LELANG & TINGGI NIK/TANGAN) */}
      <div className="signature-container">
        <div className="sig-box">
          <div className="sig-header font-medium">Diperiksa oleh,</div>
          <div className="sig-footer font-bold text-emerald-950">
            <div>(__________________________)</div>
            <div className="text-[8px] text-slate-500 font-normal mt-0.5">
              Psikolog UPT LPD
            </div>
          </div>
        </div>
        <div className="sig-box">
          <div className="sig-header font-medium">
            Padang, {report.printDate}
          </div>
          <div className="sig-footer font-bold text-slate-800">
            <div>(__________________________)</div>
            <div className="text-[8px] text-slate-500 font-normal mt-0.5">
              Petugas Administrasi / Konselor
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Footer */}
      <div className="meta-footer">
        rule_version: {report.meta.ruleVersion} &nbsp;•&nbsp;
        calculation_timestamp: {report.meta.calcTimestamp}
      </div>
    </div>
  );
};
