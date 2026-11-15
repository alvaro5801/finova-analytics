"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { AuthCard, AuthError, AuthField, AuthSubmit, apiErrorMessage } from "@/components/auth/AuthForm";
import { useSignUpMutation } from "@/store/api/dashboardApi";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signUp, { isLoading }] = useSignUpMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const result = await signUp({ name, email, password }).unwrap();
      dispatch(setUser(result.user));
      router.push("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  return (
    <AuthCard title="Criar conta" subtitle="Comece a acompanhar suas finanças em minutos.">
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <AuthField
          icon={User}
          label="Nome completo"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Marina Costa"
        />
        <AuthField
          icon={Mail}
          label="E-mail"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@empresa.com.br"
        />
        <AuthField
          icon={Lock}
          label="Senha"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo de 6 caracteres"
        />

        {error && <AuthError message={error} />}

        <AuthSubmit loading={isLoading}>Criar conta</AuthSubmit>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/sign-in" className="font-semibold text-primary-light transition-colors hover:text-fg">
          Entrar
        </Link>
      </p>
    </AuthCard>
  );
}
