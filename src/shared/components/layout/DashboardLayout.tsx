import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Lock } from "lucide-react";
import { useAuthStore } from "@/features/auth/hooks/useAuthStore";
import { useAuthAction } from "@/features/auth/hooks/useAuthAction";
import { SIDEBAR_SECTIONS } from "@/shared/config/menu";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import Button from "../ui/Button";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, hasPermission } = useAuthStore();

  const { logout } = useAuthAction();
  const location = useLocation();

  const [deniedMenu, setDeniedMenu] = useState<{
    title: string;
    permission: string;
  } | null>(null);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "M";

  const getActiveMenuInfo = () => {
    for (const section of SIDEBAR_SECTIONS) {
      const foundItem = section.items.find(
        (item) => item.path === location.pathname,
      );
      if (foundItem) {
        return {
          sectionHeader: section.header,
          itemTitle: foundItem.title,
        };
      }
    }
    return { sectionHeader: "CORE", itemTitle: "SCREENING SYSTEM" };
  };

  const activeInfo = getActiveMenuInfo();

  const handleMenuClick = (
    e: React.MouseEvent,
    item: { title: string; path: string; permission?: string },
    isAllowed: boolean,
  ) => {
    if (!isAllowed) {
      e.preventDefault();
      setDeniedMenu({
        title: item.title,
        permission: item.permission || "UNKNOWN_PERMISSION",
      });
    }
  };

  return (
    <div className="min-h-screen min-w-[1280px] bg-[#050505] text-zinc-200 font-mono flex select-none">
      <aside className="w-64 bg-black border-r border-zinc-900 flex flex-col justify-between h-screen sticky top-0 shrink-0">
        <div className="flex-1 overflow-y-auto">
          <div className="h-16 px-4 border-b border-zinc-900 flex items-center gap-3 shrink-0 bg-black">
            <div className="h-9 w-9 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center p-1 shadow-[0_0_12px_rgba(220,38,38,0.2)] shrink-0 group">
              <img
                src="/logo.png"
                alt="Logo Unbrah"
                className="h-full w-full object-contain filter drop-shadow-[0_0_6px_rgba(220,38,38,0.4)] transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-black text-[11px] tracking-wide uppercase text-white leading-none flex items-center gap-1.5 truncate">
                <span className="truncate">UNIV. BAITURRAHMAH</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.8)] shrink-0" />
              </div>
              <div className="text-[8.5px] text-red-500/90 tracking-wider font-bold uppercase mt-1 truncate">
                UPT Layanan Psikologi & Difabel
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {SIDEBAR_SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-[9px] font-bold text-zinc-600 tracking-widest uppercase">
                  {section.header}
                </div>

                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const IconComp = item.icon;
                    const isActive = location.pathname === item.path;

                    const isAllowed =
                      !item.permission || hasPermission(item.permission);

                    return (
                      <Link
                        key={item.path}
                        to={isAllowed ? item.path : "#"}
                        onClick={(e) => handleMenuClick(e, item, isAllowed)}
                        className={`flex items-center gap-3 px-3 py-1.5 rounded text-xs font-bold transition-all ${
                          isActive
                            ? "text-white bg-zinc-900/80 border-l-2 border-red-600"
                            : isAllowed
                              ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30"
                              : "text-zinc-600 opacity-60 hover:bg-zinc-900/20 cursor-not-allowed"
                        }`}
                      >
                        <IconComp
                          className={`h-4 w-4 shrink-0 ${
                            isActive
                              ? "text-red-500"
                              : isAllowed
                                ? "text-zinc-500"
                                : "text-zinc-700"
                          }`}
                        />
                        <span className="tracking-wide flex-1 truncate">
                          {item.title}
                        </span>

                        {!isAllowed && (
                          <Lock className="h-3 w-3 text-zinc-600 shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-zinc-900 bg-black/90">
          <Button
            variant="disconnect"
            size="md"
            onClick={logout}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <LogOut className="h-3.5 w-3.5 text-zinc-500 group-hover:text-red-500 transition-colors" />
              <span className="tracking-widest">DISCONNECT</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626] animate-pulse shrink-0" />
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen bg-[#080808] overflow-hidden">
        <header className="h-16 border-b border-zinc-900 bg-black/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase">
            {activeInfo.sectionHeader} /{" "}
            <span className="text-zinc-300">{activeInfo.itemTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-white leading-none">
                {user?.name || "Evaluator Klinis"}
              </div>
              <div className="text-[10px] text-zinc-500  mt-1">
                {user?.email || "EVALUATOR@MINDCARE.ID"}
              </div>
            </div>
            <div className="h-8 w-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-red-500 text-xs shadow-inner shrink-0">
              {userInitial}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="w-full">{children}</div>
        </main>
      </div>

      <ConfirmModal
        isOpen={Boolean(deniedMenu)}
        title="AKSES OTORITAS DITOLAK"
        description={`Anda tidak memiliki izin/permission [${deniedMenu?.permission}] untuk mengakses menu "${deniedMenu?.title}". Silakan hubungi Administrator Sistem.`}
        onClose={() => setDeniedMenu(null)}
        onConfirm={() => setDeniedMenu(null)}
        confirmText="MENGERTI"
        cancelText="TUTUP"
      />
    </div>
  );
};
