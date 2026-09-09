import React from "react";
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
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { HasPermission } from "@/features/auth/components/HasPermission";

export const DashboardOverviewPage: React.FC = () => {
  const { data, loading, refetchStats } = useDashboardStats();

  return (
    <div className="w-full space-y-6 font-mono text-zinc-200 select-none">
      {/* 1. HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-white">
            <Activity className="h-6 w-6 text-red-500 animate-pulse" />
            PANEL KONTROL EKSEKUTIF & TRIAGE KLINIS
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Monitoring Real-Time Hasil Diagnostik SRQ-20 & Distribusi Intervensi
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={refetchStats}
          disabled={loading}
          className="self-start md:self-auto bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase py-2 px-4"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 mr-2 ${loading ? "animate-spin text-red-500" : ""}`}
          />
          SINKRONISASI DATA
        </Button>
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

            <div className="bg-zinc-950 p-4 border border-red-900/60 rounded-xl space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
              <div className="flex items-center justify-between text-red-500 text-xs font-bold">
                <span>P1 - EMERGENCY</span>
                <ShieldAlert className="h-4 w-4 animate-bounce" />
              </div>
              <div className="text-2xl font-black text-red-500">
                {data?.overview?.criticalCasesP1 ?? 0}
              </div>
              <p className="text-[10px] text-red-900/90 font-bold font-sans">
                Suicidal Flag / Risiko Tinggi
              </p>
            </div>

            <div className="bg-zinc-950 p-4 border border-amber-900/60 rounded-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-amber-500 text-xs font-bold">
                <span>P2 - HIGH RISK</span>
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black text-amber-500">
                {data?.overview?.highRiskCasesP2 ?? 0}
              </div>
              <p className="text-[10px] text-amber-900/90 font-bold font-sans">
                Di atas Cut-Off (&gt;6)
              </p>
            </div>

            <div className="bg-zinc-950 p-4 border border-yellow-900/60 rounded-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-yellow-500 text-xs font-bold">
                <span>P3 - MONITORING</span>
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black text-yellow-400">
                {data?.overview?.monitoringCasesP3 ?? 0}
              </div>
              <p className="text-[10px] text-yellow-900/90 font-bold font-sans">
                Cluster Gejala Ringan
              </p>
            </div>

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
                      className="bg-yellow-500 h-full"
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

          <div className="flex items-center gap-4 text-[10px] pt-2 text-zinc-500 border-t border-zinc-900">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-600" /> P1 Emergency
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> P2 High
              Risk
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-500" /> P3
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
      <HasPermission permission="view_clinical_triage_stats">
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
