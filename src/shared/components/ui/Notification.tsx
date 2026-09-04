import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  X,
  LucideIcon,
} from "lucide-react";
import {
  NotificationType,
  useNotificationStore,
} from "@/shared/hooks/useNotificationStore";

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  const styles: Record<NotificationType, string> = {
    success:
      "bg-emerald-950/90 border-emerald-800/90 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    error:
      "bg-red-950/90 border-red-800/90 text-red-300 shadow-[0_0_15px_rgba(220,38,38,0.25)]",
    warning:
      "bg-amber-950/90 border-amber-800/90 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    info: "bg-zinc-950/90 border-zinc-800 text-zinc-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]",
  };

  const icons: Record<NotificationType, LucideIcon> = {
    success: CheckCircle2,
    error: AlertTriangle,
    warning: Zap,
    info: Info,
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full font-mono text-xs select-none">
      {notifications.map((n) => {
        const IconComponent = icons[n.type];

        return (
          <div
            key={n.id}
            className={`flex items-start justify-between p-3.5 border rounded-lg shadow-2xl backdrop-blur-md transition-all animate-fadeIn ${styles[n.type]}`}
          >
            <div className="flex items-start gap-3">
              <IconComponent className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="leading-snug break-words font-semibold">
                {n.message}
              </p>
            </div>

            <button
              onClick={() => removeNotification(n.id)}
              className="text-zinc-500 hover:text-white transition-colors ml-3 p-0.5 rounded hover:bg-zinc-900/60 cursor-pointer shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
