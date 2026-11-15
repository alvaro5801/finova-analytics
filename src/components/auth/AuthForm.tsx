"use client";

import { motion } from "framer-motion";
import { Loader2, type LucideIcon } from "lucide-react";
import { motionTokens } from "@/lib/tokens";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.slow, ease: motionTokens.ease }}
      className="fn-card rounded-2xl p-7 shadow-glow"
    >
      <h1 className="text-xl font-semibold tracking-tight text-fg">{title}</h1>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
      {children}
    </motion.div>
  );
}

export function AuthField({
  icon: Icon,
  label,
  ...inputProps
}: { icon: LucideIcon; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="flex items-center gap-2.5 rounded-xl border border-line bg-sunken px-3 py-2.5 transition-colors duration-200 focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/25">
        <Icon size={16} className="shrink-0 text-muted" aria-hidden="true" />
        <input
          {...inputProps}
          className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-faint"
        />
      </span>
    </label>
  );
}

export function AuthError({ message }: { message: string }) {
  return (
    <motion.p
      role="alert"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.fast }}
      className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-medium text-danger"
    >
      {message}
    </motion.p>
  );
}

export function AuthSubmit({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="fn-btn-primary mt-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold disabled:opacity-70"
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

/** Extrai a mensagem do envelope `{ error: { message } }` retornado pela API. */
export function apiErrorMessage(err: unknown): string {
  const fallback = "Algo deu errado. Tente novamente.";
  if (err && typeof err === "object" && "data" in err) {
    return (err as { data?: { error?: { message?: string } } }).data?.error?.message ?? fallback;
  }
  return fallback;
}
