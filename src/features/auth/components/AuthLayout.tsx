import React from "react";
import { Lock, Activity, ShieldCheck, QrCode } from "lucide-react";

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen w-full min-w-[1024px] bg-black font-mono text-zinc-200 flex flex-row select-none">
      <div className="w-1/2 min-h-screen bg-zinc-950 border-r border-zinc-900 p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="h-12 w-12 bg-white border border-zinc-800 rounded-xl flex items-center justify-center p-2 shadow-md shrink-0">
            <img
              src="/logo.png"
              alt="Logo Universitas Baiturrahmah"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-black text-sm md:text-base tracking-wider text-white uppercase flex items-center gap-2 leading-tight">
              <span>UNIVERSITAS BAITURRAHMAH</span>
              <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]" />
            </h1>
            <p className="text-[10px] text-red-500 font-bold block mt-0.5 uppercase tracking-wider">
              UPT Layanan Psikologi & Difabel
            </p>
          </div>
        </div>

        <div className="relative z-10 my-auto space-y-6 max-w-md">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-950/50 border border-red-900/80 rounded text-[10px] font-bold text-red-400 tracking-widest uppercase">
              ADMINISTRATOR CONTROL PANEL
            </div>
            <h2 className="text-2xl font-black text-white uppercase leading-snug tracking-tight">
              MANAGEMENT & ANALYTICS SCREENING
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Portal pusat pengawasan data hasil kuesioner SRQ-20, rekapitulasi
              tingkat risiko kesehatan mental mahasiswa, dan manajemen QR sesi
              screening.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-zinc-900/80">
            <div className="bg-zinc-900/40 border border-zinc-800/80 p-2.5 rounded-lg space-y-1">
              <Activity className="h-3.5 w-3.5 text-red-500" />
              <p className="text-[9px] text-zinc-500 font-bold uppercase">
                ANALYTICS
              </p>
              <p className="text-[11px] font-black text-white">
                SRQ-20 PROTOCOL
              </p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800/80 p-2.5 rounded-lg space-y-1">
              <QrCode className="h-3.5 w-3.5 text-red-500" />
              <p className="text-[9px] text-zinc-500 font-bold uppercase">
                SESSION
              </p>
              <p className="text-[11px] font-black text-white">DYNAMIC QR</p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800/80 p-2.5 rounded-lg space-y-1">
              <ShieldCheck className="h-3.5 w-3.5 text-red-500" />
              <p className="text-[9px] text-zinc-500 font-bold uppercase">
                SECURITY
              </p>
              <p className="text-[11px] font-black text-white">RESTRICTED</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-zinc-600 flex justify-between items-center border-t border-zinc-900/80 pt-4">
          <span className="tracking-wider">CONFIDENTIAL & SECURE PLATFORM</span>
          <span className="tracking-wider">RESTRICTED ADMIN ACCESS</span>
        </div>
      </div>

      <div className="w-1/2 min-h-screen flex flex-col justify-center items-center p-12 relative bg-black">
        <div className="w-full max-w-sm bg-zinc-950/90 p-8 rounded-xl border border-zinc-800/90 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

          <div className="mb-6 space-y-1.5 border-b border-zinc-900 pb-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-500 shrink-0" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                PORTAL MASUK APLIKASI
              </h2>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              MASUKKAN KREDENSIAL ADMIN ANDA
            </p>
          </div>

          {children}
        </div>

        <div className="mt-8 text-center text-[11px] text-zinc-600 font-mono tracking-wider">
          SECURE CORE v1.0 // Mental Health Screening System
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
