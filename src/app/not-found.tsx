import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FinovaMark } from "@/components/brand/FinovaLogo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <FinovaMark size={44} />
      <p className="mt-8 font-mono text-sm text-primary-light">Erro 404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg">Página não encontrada</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        O endereço pode ter mudado ou nunca existiu. Volte ao painel para continuar.
      </p>
      <Link
        href="/dashboard"
        className="fn-btn-primary fn-press mt-8 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para a visão geral
      </Link>
    </main>
  );
}
