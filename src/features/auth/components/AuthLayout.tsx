import React from "react";
import { Lock } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full min-w-[1024px] bg-black font-mono text-zinc-200 flex flex-row select-none">
      <div className="w-1/2 min-h-screen bg-zinc-950 border-r border-zinc-900 p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3"></div>

        <div className="relative z-10 text-[10px] text-zinc-600 flex justify-between items-center border-t border-zinc-900 pt-4">
          <span>CONFIDENTIAL & SECURE PLATFORM</span>
          <span>SRQ-20 PROTOCOL IMPLEMENTED</span>
        </div>
      </div>
      <div className="w-1/2 min-h-screen flex flex-col justify-center items-center p-12 relative">
        <div className="w-full max-w-sm bg-zinc-950/50 p-8 rounded-xl border border-zinc-900 shadow-2xl relative">
          <div className="mb-6 space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-500" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                PORTAL MASUK APLIKASI
              </h2>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              MASUKKAN AKUN TERDAFTAR ANDA
            </p>
          </div>

          {children}
        </div>

        <div className="mt-8 text-center text-[12px] text-zinc-600 font-mono">
          SECURE CORE v1.0 // Mental Health Screening System
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
