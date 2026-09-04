import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { ShieldAlert, Lock, ArrowLeft, LayoutDashboard } from "lucide-react";
import { ROUTES } from "@/shared/config/routes";
import { useAuthStore } from "../hooks/useAuthStore";
import { Button } from "@/shared/components/ui/Button";

interface ProtectedRouteProps {
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, hasPermission } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-[75vh] w-full flex flex-col items-center justify-center font-mono select-none p-6">
        <div className="bg-black/90 border border-red-900/60 rounded-xl p-8 max-w-md w-full text-center space-y-6 shadow-[0_0_30px_rgba(220,38,38,0.15)] relative overflow-hidden">
          <div className="absolute -top-12 -left-12 h-24 w-24 bg-red-600/20 rounded-full blur-2xl" />

          <div className="mx-auto h-14 w-14 bg-red-950/80 border border-red-700/80 rounded-lg flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] animate-pulse">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center justify-center gap-2">
              <Lock className="h-3.5 w-3.5 text-red-500" />
              AKSES DITOLAK (403 FORBIDDEN)
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              OTORITAS PERMISSION TIDAK MENCUKUPI
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-3.5 rounded text-left space-y-2 text-[11px] text-zinc-400">
            <p>
              Akun Anda tidak memiliki hak akses resmi (
              <code className="text-red-400 font-bold font-mono">
                {requiredPermission}
              </code>
              ) untuk memasuki area kerja ini.
            </p>
            <p className="text-[10px] text-zinc-600 border-t border-zinc-900 pt-2">
              Pengaksesan tanpa otorisasi dicatat pada log audit sistem.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(-1)}
              className="w-full justify-center text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              KEMBALI
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="w-full justify-center"
            >
              <LayoutDashboard className="h-4 w-4 mr-1.5" />
              DASHBOARD
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
