"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { formatBRL, formatMonthName, formatPercent } from "@/lib/format";
import { motionTokens } from "@/lib/tokens";
import { useAppSelector } from "@/store/hooks";
import type { StatCardData } from "@/types/dashboard";

/** Pessoa fictícia exibida quando ninguém fez login (mesma CFO do seed da equipe). */
const DEMO_USER = "Marina Costa";

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(26rem 16rem at 100% 0%, rgb(121 88 245 / 0.28), transparent 65%), radial-gradient(18rem 12rem at 85% 110%, rgb(34 211 238 / 0.14), transparent 70%)",
        }}
      />
      <svg
        className="absolute -right-6 bottom-0 h-[62%] w-[60%] opacity-30"
        viewBox="0 0 300 140"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="summary-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7958F5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7958F5" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="summary-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7958F5" stopOpacity="0" />
            <stop offset="60%" stopColor="#A893FF" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <path
          d="M0 120 C40 112 60 96 95 100 C130 104 150 70 185 74 C220 78 240 40 300 22 L300 140 L0 140 Z"
          fill="url(#summary-area)"
        />
        <path
          d="M0 120 C40 112 60 96 95 100 C130 104 150 70 185 74 C220 78 240 40 300 22"
          fill="none"
          stroke="url(#summary-line)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export function MonthSummaryCard({
  stats,
  periodKey,
}: {
  stats: StatCardData[];
  /** Último mês fechado ("AAAA-MM"), vindo da série mensal. */
  periodKey?: string;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const firstName = (user?.name ?? DEMO_USER).split(" ")[0];
  const revenue = stats.find((s) => s.key === "revenue")?.value ?? 0;
  const expenses = stats.find((s) => s.key === "expenses")?.value ?? 0;
  const result = revenue - expenses;
  const expenseShare = revenue > 0 ? Math.min(expenses / revenue, 1) : 0;
  const month = periodKey ? formatMonthName(periodKey) : "do mês";

  return (
    <Card className="relative flex h-full flex-col justify-between gap-6 overflow-hidden">
      <Backdrop />

      <div className="relative">
        <p className="text-sm text-muted">Olá, {firstName}</p>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Resultado de {month}
        </p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-fg tabular-nums sm:text-[2.1rem]">
          <AnimatedNumber value={result} format="currency" />
        </p>
        <p className="mt-1 text-sm text-muted">
          Margem de <span className="font-semibold text-success">{formatPercent((1 - expenseShare) * 100)}</span>{" "}
          sobre a receita
        </p>
      </div>

      <div className="relative max-w-sm">
        <div className="h-2 w-full overflow-hidden rounded-full bg-primary/25" role="img" aria-label={`Despesas consomem ${formatPercent(expenseShare * 100)} da receita`}>
          <motion.div
            className="h-full rounded-full bg-warning/90"
            initial={{ width: 0 }}
            animate={{ width: `${expenseShare * 100}%` }}
            transition={{ duration: motionTokens.chartDrawMs / 1000, ease: motionTokens.ease, delay: 0.15 }}
          />
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div>
            <dt className="flex items-center gap-1.5 text-muted">
              <span className="h-2 w-2 rounded-full bg-primary-light" aria-hidden="true" />
              Receita
            </dt>
            <dd className="mt-0.5 font-semibold text-fg tabular-nums">{formatBRL(revenue)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-muted">
              <span className="h-2 w-2 rounded-full bg-warning" aria-hidden="true" />
              Despesas
            </dt>
            <dd className="mt-0.5 font-semibold text-fg tabular-nums">{formatBRL(expenses)}</dd>
          </div>
        </dl>
        <Link
          href="/tables"
          className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-light transition-colors duration-200 hover:text-fg"
        >
          Ver relatórios
          <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  );
}

export function MonthSummarySkeleton() {
  return (
    <Card className="flex h-full flex-col justify-between gap-6">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="mt-2 h-3 w-32" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-3.5 w-48" />
      </div>
      <div className="flex max-w-sm flex-col gap-3">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </Card>
  );
}
