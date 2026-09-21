import React from "react";
import * as XLSX from "xlsx";
import {
  Activity,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Users,
  RefreshCw,
  CheckCircle2,
  Building2,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Tag,
  Download,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { HasPermission } from "@/features/auth/components/HasPermission";
import { DashboardOverviewResponse } from "../types/dashboard.types";

export const DashboardOverviewPage: React.FC = () => {
  const { data, loading, refetchStats } = useDashboardStats();

  const handleExportExcel = (dashboardData: DashboardOverviewResponse) => {
    const workbook = XLSX.utils.book_new();

    // SHEET 1: RINGKASAN EKSEKUTIF
    const overviewRows = [
      ["LAPORAN RINGKASAN DASHBOARD EKSEKUTIF & TRIAGE KLINIS"],
      [`Tanggal Ekspor: ${new Date().toLocaleDateString("id-ID")}`],
      [],
      ["MASTER DATA AKADEMIS", "JUMLAH"],
      [
        "Total Mahasiswa Terdaftar",
        dashboardData.masterData.totalRegisteredStudents,
      ],
      ["Total Fakultas", dashboardData.masterData.totalFaculties],
      ["Total Program Studi", dashboardData.masterData.totalStudyPrograms],
      ["Total Kelas", dashboardData.masterData.totalClasses],
      ["Total Angkatan", dashboardData.masterData.totalCohorts],
      [],
      ["STATUS TRIAGE KLINIS (SRQ-20)", "JUMLAH KASUS", "PERSENTASE"],
      [
        "Total Sesi Screening Selesai",
        dashboardData.overview.totalScreening,
        "100%",
      ],
      [
        "P1 - Emergency / Kritis",
        dashboardData.overview.criticalCasesP1,
        `${((dashboardData.overview.criticalCasesP1 / (dashboardData.overview.totalScreening || 1)) * 100).toFixed(1)}%`,
      ],
      [
        "P2 - High Risk",
        dashboardData.overview.highRiskCasesP2,
        `${((dashboardData.overview.highRiskCasesP2 / (dashboardData.overview.totalScreening || 1)) * 100).toFixed(1)}%`,
      ],
      [
        "P3 - Monitoring",
        dashboardData.overview.monitoringCasesP3,
        `${((dashboardData.overview.monitoringCasesP3 / (dashboardData.overview.totalScreening || 1)) * 100).toFixed(1)}%`,
      ],
      [
        "P4 - Preventif / Normal",
        dashboardData.overview.normalCasesP4,
        `${((dashboardData.overview.normalCasesP4 / (dashboardData.overview.totalScreening || 1)) * 100).toFixed(1)}%`,
      ],
      [],
      ["INDIKATOR GEJALA UTAMA (INTI)", "JUMLAH KASUS"],
      [
        "Dampak Akademik (INTI-01 / F1)",
        dashboardData.symptomClusters.emotionalDistressF1,
      ],
      [
        "Dampak Aktivitas Sehari-hari (INTI-02 / F2)",
        dashboardData.symptomClusters.somaticSymptomsF2,
      ],
      [
        "Kemampuan Menghadapi Masalah (INTI-03 / C1)",
        dashboardData.symptomClusters.depressiveThoughtsC1,
      ],
      [
        "Dukungan Sosial (INTI-04 / S1)",
        dashboardData.symptomClusters.energyDecreaseS1,
      ],
      [],
      ["TIKET INTERVENSI KLINIS", "JUMLAH TIKET"],
      ["Belum Ditangani (Pending)", dashboardData.followUpStats.pending],
      ["Dijadwalkan (Konseling Aktif)", dashboardData.followUpStats.scheduled],
      ["Selesai (Closed)", dashboardData.followUpStats.completed],
      ["Total Tiket", dashboardData.followUpStats.totalTickets],
    ];

    const sheetOverview = XLSX.utils.aoa_to_sheet(overviewRows);
    XLSX.utils.book_append_sheet(
      workbook,
      sheetOverview,
      "Ringkasan Eksekutif",
    );

    // SHEET 2: DISTRIBUSI RISIKO FAKULTAS
    const facultyHeaders = [
      [
        "Kode",
        "Nama Fakultas",
        "P1 (Emergency)",
        "P2 (High Risk)",
        "P3 (Monitoring)",
        "P4 (Normal)",
        "Total Screening",
      ],
    ];
    const facultyData = dashboardData.facultyDistribution.map((f) => [
      f.code,
      f.name,
      f.p1,
      f.p2,
      f.p3,
      f.p4,
      f.total,
    ]);
    const sheetFaculty = XLSX.utils.aoa_to_sheet([
      ...facultyHeaders,
      ...facultyData,
    ]);
    XLSX.utils.book_append_sheet(workbook, sheetFaculty, "Sebaran Fakultas");

    // SHEET 3: PROFIL TAG MASALAH UTAMA (M1)
    const m1Headers = [["No", "Kategori Masalah Utama (M1)", "Total Kasus"]];
    const m1Data = dashboardData.mainIssuesM1.map((item, idx) => [
      idx + 1,
      item.label,
      item.total,
    ]);
    const sheetM1 = XLSX.utils.aoa_to_sheet([...m1Headers, ...m1Data]);
    XLSX.utils.book_append_sheet(workbook, sheetM1, "Profil Tag Masalah");

    // SHEET 4: EMERGENCY STREAM P1 TERBARU
    const emergencyHeaders = [
      [
        "NIM",
        "Nama Mahasiswa",
        "Program Studi",
        "Skor SRQ",
        "Prioritas",
        "Waktu Kalkulasi",
      ],
    ];
    const emergencyData = dashboardData.recentEmergencyCases.map((c) => [
      c.student?.nim || "-",
      c.student?.user?.name || "-",
      c.student?.studyProgram?.name || "-",
      c.srqScore,
      c.priorityResult,
      new Date(c.calculatedAt).toLocaleString("id-ID"),
    ]);
    const sheetEmergency = XLSX.utils.aoa_to_sheet([
      ...emergencyHeaders,
      ...emergencyData,
    ]);
    XLSX.utils.book_append_sheet(
      workbook,
      sheetEmergency,
      "Emergency Stream P1",
    );

    // PROSES EKSPOR FILE
    const filename = `Laporan_Dashboard_Triage_UPT_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="w-full space-y-6 font-mono text-zinc-200 select-none">
      {/* 1. HEADER CONTROL BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <Activity className="h-6 w-6 text-red-500 animate-pulse" />
            PANEL KONTROL EKSEKUTIF & TRIAGE KLINIS
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Monitoring Real-Time Hasil Diagnostik SRQ-20 &amp; Distribusi
            Intervensi
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={refetchStats}
            disabled={loading}
            className="bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase py-2 px-4 cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-2 ${loading ? "animate-spin text-red-500" : ""}`}
            />
            SINKRONISASI DATA
          </Button>

          {data && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleExportExcel(data)}
              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 text-xs font-bold uppercase py-2 px-4 cursor-pointer transition-colors"
            >
              <Download className="h-3.5 w-3.5 mr-2 text-emerald-400" />
              EXPORT EXCEL
            </Button>
          )}
        </div>
      </div>

      {/* 2. MASTER DATA AKADEMIS */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span>MASTER DATA AKADEMIS MAHASISWA</span>
          <div className="h-px bg-zinc-900 flex-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-zinc-950/80 p-3.5 border border-zinc-900 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
              <span>MAHASISWA TERDAFTAR</span>
              <GraduationCap className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-xl font-black text-white">
              {data?.masterData?.totalRegisteredStudents?.toLocaleString() ?? 0}
            </div>
            <p className="text-[9.5px] text-zinc-600 font-sans">
              Total akun mahasiswa registered
            </p>
          </div>

          <div className="bg-zinc-950/80 p-3.5 border border-zinc-900 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
              <span>TOTAL FAKULTAS</span>
              <Building2 className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-xl font-black text-white">
              {data?.masterData?.totalFaculties ?? 0}
            </div>
            <p className="text-[9.5px] text-zinc-600 font-sans">
              Fakultas aktif terdata
            </p>
          </div>

          <div className="bg-zinc-950/80 p-3.5 border border-zinc-900 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
              <span>PROGRAM STUDI</span>
              <BookOpen className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-xl font-black text-white">
              {data?.masterData?.totalStudyPrograms ?? 0}
            </div>
            <p className="text-[9.5px] text-zinc-600 font-sans">
              Prodi terdaftar di sistem
            </p>
          </div>

          <div className="bg-zinc-950/80 p-3.5 border border-zinc-900 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
              <span>KELAS</span>
              <Users className="h-4 w-4 text-cyan-500" />
            </div>
            <div className="text-xl font-black text-white">
              {data?.masterData?.totalClasses ?? 0}
            </div>
            <p className="text-[9.5px] text-zinc-600 font-sans">
              Total kelas aktif terdaftar
            </p>
          </div>

          <div className="bg-zinc-950/80 p-3.5 border border-zinc-900 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
              <span>ANGKATAN</span>
              <CalendarDays className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-xl font-black text-white">
              {data?.masterData?.totalCohorts ?? 0}
            </div>
            <p className="text-[9.5px] text-zinc-600 font-sans">
              Tahun angkatan peserta
            </p>
          </div>
        </div>
      </div>

      {/* 3. RINGKASAN STATUS TRIAGE KLINIS */}
      <HasPermission permission="view_clinical_triage_stats">
        <div className="space-y-2 pt-2">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <span>RINGKASAN STATUS TRIAGE &amp; DIAGNOSTIK KLINIS</span>
            <div className="h-px bg-zinc-900 flex-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* TOTAL SCREENING */}
            <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-bold">
                <span>TOTAL SCREENING</span>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-white">
                {data?.overview?.totalScreening?.toLocaleString() ?? 0}
              </div>
              <p className="text-[10px] text-zinc-600 font-sans">
                Sesi diagnostik selesai
              </p>
            </div>

            {/* P1 - EMERGENCY */}
            <div className="bg-red-950/40 p-4 border-2 border-red-500 rounded-xl space-y-2 relative overflow-hidden animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_12px_#ef4444]" />

              <div className="flex items-center justify-between text-red-400 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-red-300">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  <span>P1 - EMERGENCY</span>
                </span>
                <ShieldAlert className="h-4 w-4 text-red-400 animate-bounce" />
              </div>

              <div className="text-2xl font-black text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]">
                {data?.overview?.criticalCasesP1 ?? 0}
              </div>

              <p className="text-[10px] text-red-300 font-bold font-sans">
                Suicidal Flag / Risiko Tinggi
              </p>
            </div>

            {/* P2 - HIGH RISK */}
            <div className="bg-zinc-950 p-4 border border-amber-900/60 rounded-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-amber-500 text-xs font-bold">
                <span>P2 - HIGH RISK</span>
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black text-amber-500">
                {data?.overview?.highRiskCasesP2 ?? 0}
              </div>
              <p className="text-[10px] text-amber-900/90 font-bold font-sans">
                Cluster Gejala Berat
              </p>
            </div>

            {/* P3 - MONITORING */}
            <div className="bg-zinc-950 p-4 border border-blue-900/60 rounded-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-blue-400 text-xs font-bold">
                <span>P3 - MONITORING</span>
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black text-blue-400">
                {data?.overview?.monitoringCasesP3 ?? 0}
              </div>
              <p className="text-[10px] text-blue-900/90 font-bold font-sans">
                Cluster Gejala Ringan
              </p>
            </div>

            {/* P4 - PREVENTIF */}
            <div className="bg-zinc-950 p-4 border border-emerald-900/60 rounded-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-emerald-500 text-xs font-bold">
                <span>P4 - PREVENTIF</span>
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black text-emerald-500">
                {data?.overview?.normalCasesP4 ?? 0}
              </div>
              <p className="text-[10px] text-emerald-900/90 font-bold font-sans">
                Skor Normal / Non-Klinis
              </p>
            </div>
          </div>
        </div>
      </HasPermission>

      {/* 4. DISTRIBUSI RISIKO KLINIS PER FAKULTAS */}
      <HasPermission permission="view_clinical_triage_stats">
        <div className="bg-black p-5 border border-zinc-900 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-red-500" />
              <span>DISTRIBUSI RISIKO KLINIS PER FAKULTAS</span>
            </h3>
            <span className="text-[10px] text-zinc-500">
              FORMAT METRIK STACKED
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {data?.facultyDistribution?.map((fac) => {
              const total = fac.total || 1;
              const p1Pct = (fac.p1 / total) * 100;
              const p2Pct = (fac.p2 / total) * 100;
              const p3Pct = (fac.p3 / total) * 100;
              const p4Pct = (fac.p4 / total) * 100;

              return (
                <div key={fac.code} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">
                      {fac.name} ({fac.code})
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      <span className="text-red-400 font-bold">
                        {fac.p1} P1
                      </span>{" "}
                      |{" "}
                      <span className="text-amber-400 font-bold">
                        {fac.p2} P2
                      </span>{" "}
                      |{" "}
                      <span className="text-blue-400 font-bold">
                        {fac.p3} P3
                      </span>{" "}
                      | <span className="text-zinc-400">{fac.total} Total</span>
                    </span>
                  </div>

                  <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${p1Pct}%` }}
                      className="bg-red-600 h-full"
                      title={`P1: ${fac.p1}`}
                    />
                    <div
                      style={{ width: `${p2Pct}%` }}
                      className="bg-amber-500 h-full"
                      title={`P2: ${fac.p2}`}
                    />
                    <div
                      style={{ width: `${p3Pct}%` }}
                      className="bg-blue-500 h-full"
                      title={`P3: ${fac.p3}`}
                    />
                    <div
                      style={{ width: `${p4Pct}%` }}
                      className="bg-emerald-600 h-full"
                      title={`P4: ${fac.p4}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend Warna */}
          <div className="flex items-center gap-4 text-[10px] pt-2 text-zinc-500 border-t border-zinc-900">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-600" /> P1 Emergency
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> P2 High
              Risk
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> P3
              Monitoring
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-600" /> P4 Normal
            </span>
          </div>
        </div>
      </HasPermission>

      {/* 5. SEBARAN KELOMPOK GEJALA INTI & PROFIL TAG M1 */}
      <HasPermission permission="view_clinical_triage_stats">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-black p-5 border border-zinc-900 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-500" />
                <span>SEBARAN KELOMPOK GEJALA UTAMA (INDIKATOR INTI)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-400">
                    Dampak Akademik (INTI-01)
                  </span>
                  <span className="text-red-400 font-mono font-black">
                    {data?.symptomClusters?.emotionalDistressF1 ?? 0} Kasus
                  </span>
                </div>
                <p className="text-[9.5px] text-zinc-500 font-sans leading-relaxed">
                  Tingkat gangguan pada fungsi akademik dan perkuliahan.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-400">
                    Dampak Aktivitas Sehari-hari (INTI-02)
                  </span>
                  <span className="text-amber-400 font-mono font-black">
                    {data?.symptomClusters?.somaticSymptomsF2 ?? 0} Kasus
                  </span>
                </div>
                <p className="text-[9.5px] text-zinc-500 font-sans leading-relaxed">
                  Tingkat gangguan pada makan, mandi, istirahat, dan
                  sosialisasi.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-400">
                    Kemampuan Menghadapi Masalah (INTI-03)
                  </span>
                  <span className="text-red-500 font-mono font-black">
                    {data?.symptomClusters?.depressiveThoughtsC1 ?? 0} Kasus
                  </span>
                </div>
                <p className="text-[9.5px] text-zinc-500 font-sans leading-relaxed">
                  Evaluasi kapasitas mahasiswa dalam mengelola stres dan
                  masalah.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-400">
                    Dukungan Sosial (INTI-04)
                  </span>
                  <span className="text-yellow-400 font-mono font-black">
                    {data?.symptomClusters?.energyDecreaseS1 ?? 0} Kasus
                  </span>
                </div>
                <p className="text-[9.5px] text-zinc-500 font-sans leading-relaxed">
                  Kecukupan dukungan dari lingkungan keluarga dan teman.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black p-5 border border-zinc-900 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Tag className="h-4 w-4 text-red-500" />
                <span>PROFIL TAG (MASALAH UTAMA)</span>
              </h3>
              <span className="text-[10px] text-zinc-500">M1</span>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {data?.mainIssuesM1?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 bg-zinc-950 border border-zinc-900 rounded text-xs hover:border-zinc-800 transition-colors"
                >
                  <span className="font-bold text-zinc-300 text-[11px] truncate">
                    {item.label}
                  </span>
                  <span className="text-red-400 font-black ml-2 shrink-0">
                    {item.total} Kasus
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </HasPermission>

      {/* 6. STATUS TIKET & EMERGENCY STREAM */}
      <HasPermission permission="view_clinical_triage_stats_super_admin">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-black p-5 border border-zinc-900 rounded-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-3 flex items-center justify-between">
              <span>STATUS TIKET INTERVENSI KLINIS (P1 &amp; P2)</span>
              <span className="text-[10px] text-zinc-600 font-normal">
                TOTAL TIKET: {data?.followUpStats?.totalTickets ?? 0}
              </span>
            </h3>

            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span className="text-red-400">
                    BELUM DITANGANI (PENDING)
                  </span>
                  <span className="text-white">
                    {data?.followUpStats?.pending ?? 0} Tiket
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full"
                    style={{
                      width: `${((data?.followUpStats?.pending ?? 0) / (data?.followUpStats?.totalTickets || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span className="text-amber-400">
                    DIJADWALKAN (KONSELING AKTIF)
                  </span>
                  <span className="text-white">
                    {data?.followUpStats?.scheduled ?? 0} Tiket
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full"
                    style={{
                      width: `${((data?.followUpStats?.scheduled ?? 0) / (data?.followUpStats?.totalTickets || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span className="text-emerald-400">
                    SELESAI (CLOSED INTERVENTION)
                  </span>
                  <span className="text-white">
                    {data?.followUpStats?.completed ?? 0} Tiket
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${((data?.followUpStats?.completed ?? 0) / (data?.followUpStats?.totalTickets || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black p-5 border border-zinc-900 rounded-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 border-b border-zinc-900 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                CASES EMERGENCY TERBARU (P1)
              </span>
              <span className="text-[10px] text-zinc-600 font-normal">
                REAL-TIME
              </span>
            </h3>

            <div className="space-y-3">
              {data?.recentEmergencyCases?.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-zinc-950 border border-red-950/80 rounded-lg space-y-2 hover:border-red-900 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white text-xs">
                        {c.student?.user?.name || "N/A"}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-sans mt-0.5">
                        NIM: {c.student?.nim || "-"} |{" "}
                        {c.student?.studyProgram?.name || "-"}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-red-950 text-red-400 border border-red-800 rounded">
                      SKOR: {c.srqScore}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-600 border-t border-zinc-900 pt-2 font-sans">
                    <span>
                      {new Date(c.calculatedAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="font-bold uppercase text-red-400">
                      PRIORITAS: {c.priorityResult}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </HasPermission>
    </div>
  );
};

export default DashboardOverviewPage;
