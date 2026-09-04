import React from "react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import {
  Activity,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Users,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

export const DashboardOverviewPage: React.FC = () => {
  const { stats, loading, refetchStats } = useDashboardStats(true);

  const overview = stats?.overview || {
    totalScreening: 0,
    criticalCasesP1: 0,
    highRiskCasesP2: 0,
    monitoringCasesP3: 0,
    normalCasesP4: 0,
  };

  const followUp = stats?.followUpStats || {
    pending: 0,
    scheduled: 0,
    completed: 0,
    totalTickets: 0,
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      {/* Header Banner */}
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
          className="self-start md:self-auto"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 mr-2 ${
              loading ? "animate-spin text-red-500" : ""
            }`}
          />
          SINKRONISASI DATA
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Screening */}
        <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-bold">
            <span>TOTAL SCREENING</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-white">
            {overview.totalScreening}
          </div>
          <p className="text-[10px] text-zinc-600">Sesi diagnostik selesai</p>
        </div>

        {/* P1 Emergency */}
        <div className="bg-zinc-950 p-4 border border-red-900/40 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-red-500 text-xs font-bold">
            <span>P1 - EMERGENCY</span>
            <ShieldAlert className="h-4 w-4 animate-bounce" />
          </div>
          <div className="text-2xl font-black text-red-500">
            {overview.criticalCasesP1}
          </div>
          <p className="text-[10px] text-red-900/80 font-bold">
            Suicidal Flag / Risiko Tinggi
          </p>
        </div>

        {/* P2 High Risk */}
        <div className="bg-zinc-950 p-4 border border-amber-900/40 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-amber-500 text-xs font-bold">
            <span>P2 - HIGH RISK</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-amber-500">
            {overview.highRiskCasesP2}
          </div>
          <p className="text-[10px] text-amber-900/80 font-bold">
            Di atas Cut-Off (&gt;6)
          </p>
        </div>

        {/* P3 Monitoring */}
        <div className="bg-zinc-950 p-4 border border-yellow-900/40 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-yellow-500 text-xs font-bold">
            <span>P3 - MONITORING</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-yellow-400">
            {overview.monitoringCasesP3}
          </div>
          <p className="text-[10px] text-yellow-900/80 font-bold">
            Cluster Gejala Ringan
          </p>
        </div>
      </div>

      {/* Ticket Bar Distribution & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-black p-5 border border-zinc-900 rounded-lg space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-3 flex items-center justify-between">
            <span>DISTRIBUSI STATUS TIKET INTERVENSI KLINIS</span>
            <span className="text-[10px] text-zinc-600 font-normal">
              TOTAL TIKET: {followUp.totalTickets}
            </span>
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-red-400">BELUM DITANGANI (PENDING)</span>
                <span className="text-white">{followUp.pending} Tiket</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full transition-all duration-500"
                  style={{
                    width: `${
                      followUp.totalTickets
                        ? (followUp.pending / followUp.totalTickets) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-amber-400">
                  DIJADWALKAN (KONSELING AKTIF)
                </span>
                <span className="text-white">{followUp.scheduled} Tiket</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{
                    width: `${
                      followUp.totalTickets
                        ? (followUp.scheduled / followUp.totalTickets) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-emerald-400">
                  SELESAI (CLOSED INTERVENTION)
                </span>
                <span className="text-white">{followUp.completed} Tiket</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{
                    width: `${
                      followUp.totalTickets
                        ? (followUp.completed / followUp.totalTickets) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Feed Stream */}
        <div className="bg-black p-5 border border-zinc-900 rounded-lg space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 border-b border-zinc-900 pb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
            CASES EMERGENCY TERBARU (P1)
          </h3>

          <div className="space-y-3">
            {stats?.recentEmergencyCases &&
            stats.recentEmergencyCases.length > 0 ? (
              stats.recentEmergencyCases.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-zinc-950 border border-red-950 rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-white text-xs">
                      {c.student?.user?.name || "N/A"}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      NIM: {c.student?.nim} | {c.student?.studyProgram?.code}
                    </div>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-bold bg-red-950 text-red-400 border border-red-800 rounded">
                    SKOR: {c.srqScore}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-600 italic py-4 text-center">
                Tidak ada indikasi P1 Emergency.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
