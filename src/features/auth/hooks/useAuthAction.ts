import { useState } from "react";
import { useAuthStore } from "./useAuthStore";
import { useNotificationStore } from "@/shared/hooks/useNotificationStore";
import { useNavigate } from "react-router-dom";
import { LoginPayload } from "../types/auth.types";
import { authService } from "../api/authService";
import { ROUTES } from "@/shared/config/routes";
import { rbacCache } from "@/shared/lib/cacheEngine";

const MIN_LOADING_TIME = 1000;

export const useAuthAction = () => {
  const [submitting, setSubmitting] = useState(false);
  const { setAuth, clearAuth } = useAuthStore();
  const { notify } = useNotificationStore();
  const navigate = useNavigate();

  const handleLogin = async (payload: LoginPayload) => {
    setSubmitting(true);
    try {
      const [res] = await Promise.all([
        authService.login(payload),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME)),
      ]);

      const { auth: user, token, refreshToken } = res.data;

      setAuth(user, token);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      notify.success(
        res.meta?.message || "Autentikasi berhasil, selamat datang!",
      );

      navigate(ROUTES.DASHBOARD);
      return { success: true };
    } catch (err: any) {
      notify.error(err.message || "Gagal masuk ke sistem");
      setSubmitting(false);
      return { success: false };
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken") || "";

      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (err: any) {
      // Ignore error jika session token sudah kedaluwarsa di backend
    } finally {
      localStorage.removeItem("refreshToken");

      clearAuth();
      rbacCache.clear();
      notify.info("Sesi telah berakhir");
      navigate(ROUTES.LOGIN);
    }
  };

  return {
    submitting,
    login: handleLogin,
    logout: handleLogout,
  };
};

export default useAuthAction;
