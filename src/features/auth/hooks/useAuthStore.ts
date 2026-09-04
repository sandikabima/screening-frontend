import { create } from "zustand";
import { AuthUser } from "../types/auth.types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  hasPermission: (permissionKey: string) => boolean;
  hasRole: (roleName: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const savedToken = localStorage.getItem("token");
  const savedUserRaw = localStorage.getItem("user");
  let initialUser: AuthUser | null = null;

  if (savedUserRaw) {
    try {
      initialUser = JSON.parse(savedUserRaw);
    } catch {
      initialUser = null;
    }
  }

  return {
    user: initialUser,
    token: savedToken,
    isAuthenticated: Boolean(savedToken && initialUser),

    setAuth: (user, token) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },

    clearAuth: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, token: null, isAuthenticated: false });
    },

    hasPermission: (permissionKey: string) => {
      const user = get().user;
      if (!user) return false;

      if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") return true;

      if (!user.permissions || !Array.isArray(user.permissions)) return false;

      return user.permissions.some(
        (perm) => perm.toUpperCase() === permissionKey.toUpperCase(),
      );
    },

    hasRole: (role: string) => {
      const user = get().user;
      if (!user) return false;
      return user.role?.toUpperCase() === role.toUpperCase();
    },
  };
});
