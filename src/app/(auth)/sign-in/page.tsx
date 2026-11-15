"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { AuthCard, AuthError, AuthField, AuthSubmit, apiErrorMessage } from "@/components/auth/AuthForm";
import { useSignInMutation } from "@/store/api/dashboardApi";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signIn, { isLoading }] = useSignInMutation();
  const [email, setEmail] = useState("marina.costa@finova.example");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const result = await signIn({ email, password }).unwrap();
      dispatch(setUser(result.user));
      router.push("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  return (
    <AuthCard title="Entrar" subtitle="Acesse o painel financeiro da sua empresa.">
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
        />

        {error && <AuthError message={error} />}

        <AuthSubmit loading={isLoading}>Entrar</AuthSubmit>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link href="/sign-up" className="font-semibold text-primary-light transition-colors hover:text-fg">
          Criar conta
        </Link>
      </p>
    </AuthCard>
  );
}
