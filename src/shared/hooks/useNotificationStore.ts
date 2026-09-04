import { create } from "zustand";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  notify: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info: (msg: string) => void;
  };
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => {
  const addNotification = (type: NotificationType, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newItem: NotificationItem = { id, type, message };

    set((state) => ({
      notifications: [...state.notifications, newItem],
    }));

    setTimeout(() => {
      get().removeNotification(id);
    }, 4000);
  };

  return {
    notifications: [],
    removeNotification: (id) =>
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),

    notify: {
      success: (msg) => addNotification("success", msg),
      error: (msg) => addNotification("error", msg),
      warning: (msg) => addNotification("warning", msg),
      info: (msg) => addNotification("info", msg),
    },
  };
});
