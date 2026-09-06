import React, { useState } from "react";
import { Input } from "@/shared/components/ui/Input";
import { useAuthAction } from "../hooks/useAuthAction";
import { Button } from "@/shared/components/ui/Button";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { submitting, login } = useAuthAction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-mono">
      <Input
        label="Email Pengguna"
        type="email"
        required
        placeholder="gmail@example.ac.id"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Kata Sandi"
        type="password"
        required
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          className="w-full py-3 text-xs font-bold uppercase tracking-wider"
        >
          Masuk ke Konsol Otoritas →
        </Button>
      </div>
    </form>
  );
};
