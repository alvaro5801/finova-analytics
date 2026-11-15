"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueExpensesCard } from "@/components/dashboard/RevenueExpensesCard";
import { motionTokens } from "@/lib/tokens";
import { useAppDispatch } from "@/store/hooks";
import { setDirection } from "@/store/slices/uiSlice";
import type { SalesPointData, StatCardData } from "@/types/dashboard";

/** Conjunto alternativo e independente de dados fictícios (valores em centavos). */
const previewStats: StatCardData[] = [
  { id: 1, key: "revenue", title: "Receita semanal", value: 12_440_000, format: "currency", changePct: 18, changeLabel: "vs. semana anterior", icon: "trending-up", color: "primary", order: 0 },
  { id: 2, key: "customers", title: "Novos clientes", value: 1204, format: "number", changePct: 9, changeLabel: "vs. semana anterior", icon: "users", color: "info", order: 1 },
  { id: 3, key: "expenses", title: "Estornos", value: 1_874_050, format: "currency", changePct: -4, changeLabel: "vs. trimestre anterior", icon: "receipt", color: "warning", order: 2 },
  { id: 4, key: "conversion", title: "Conversão", value: 320, format: "percent", changePct: 6, changeLabel: "vs. mês anterior", icon: "chart-line", color: "success", order: 3 },
];

const previewSales: SalesPointData[] = [
  ["2026-04", 8_000_000, 5_400_000],
  ["2026-05", 13_000_000, 8_100_000],
  ["2026-06", 9_500_000, 7_300_000],
  ["2026-07", 26_000_000, 15_200_000],
  ["2026-08", 19_000_000, 13_400_000],
  ["2026-09", 31_000_000, 18_900_000],
  ["2026-10", 24_000_000, 17_600_000],
].map(([month, revenueCents, expensesCents], i) => ({
  id: i + 1,
  month: month as string,
  revenueCents: revenueCents as number,
  expensesCents: expensesCents as number,
  order: i,
}));

const previewProjects = [
  { name: "Novo site institucional", progress: 45, tag: "Em execução" },
  { name: "Aplicativo mobile", progress: 100, tag: "Concluído" },
  { name: "Migração da API de pagamentos", progress: 70, tag: "Em execução" },
];

export default function RtlPage() {
  const dispatch = useAppDispatch();

  // Inverte o layout inteiro (sidebar, paddings, ícones) via propriedades lógicas
  // `start-*`/`end-*`, e restaura ao sair da página.
  useEffect(() => {
    dispatch(setDirection("rtl"));
    return () => {
      dispatch(setDirection("ltr"));
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <Reveal>
        <Card>
          <CardHeader
            title="Prévia RTL"
            subtitle="Os mesmos componentes do painel, com um conjunto alternativo de dados e layout da direita para a esquerda. Ao sair desta página, a direção volta ao normal."
          />
        </Card>
      </Reveal>

      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 xl:grid-cols-4 lg:gap-5">
        {previewStats.map((stat, i) => (
          <Reveal key={stat.id} delay={i * 0.06} className="h-full">
            <StatCard stat={stat} />
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-5 xl:grid-cols-3">
        <div className="h-[400px] xl:col-span-2">
          <Reveal className="h-full">
            <RevenueExpensesCard points={previewSales} />
          </Reveal>
        </div>
        <div className="xl:col-span-1">
          <Reveal className="h-full" delay={0.08}>
            <Card className="flex h-full flex-col">
              <CardHeader title="Projetos" />
              <ul className="mt-5 flex flex-col gap-5">
                {previewProjects.map((project, i) => (
                  <motion.li
                    key={project.name}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: motionTokens.base, delay: i * 0.06, ease: motionTokens.ease }}
                  >
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-fg">{project.name}</span>
                      <span className="shrink-0 text-xs font-semibold text-muted">{project.tag}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{
                          duration: motionTokens.chartDrawMs / 1000,
                          delay: 0.2 + i * 0.06,
                          ease: motionTokens.ease,
                        }}
                        className="grad-brand h-full rounded-full"
                      />
                    </div>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
