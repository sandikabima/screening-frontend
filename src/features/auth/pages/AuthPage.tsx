import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/shared/config/routes";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { useAuthStore } from "../hooks/useAuthStore";

export const AuthPage: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default AuthPage;
