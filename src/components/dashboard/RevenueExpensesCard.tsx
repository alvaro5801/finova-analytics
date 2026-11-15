"use client";

import { useId, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { ChartTooltip } from "@/components/ui/ChartTooltip";
import { SegmentedControl, type SegmentOption } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatBRL, formatBRLCompact, formatMonthLong, formatMonthShort, formatSignedBRL } from "@/lib/format";
import { colors, motionTokens } from "@/lib/tokens";
import type { SalesPointData } from "@/types/dashboard";

type Period = "3" | "6" | "12";

const PERIODS: SegmentOption<Period>[] = [
  { value: "3", label: "3M", description: "últimos 3 meses" },
  { value: "6", label: "6M", description: "últimos 6 meses" },
  { value: "12", label: "12M", description: "últimos 12 meses" },
];

const axisTick = { fill: colors.muted, fontSize: 11 };

export function RevenueExpensesCard({ points }: { points: SalesPointData[] }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduceMotion = useReducedMotion();
  const [period, setPeriod] = useState<Period>("12");
  // D4: 700 ms no primeiro desenho; 300 ms nas trocas de período.
  const [hasDrawn, setHasDrawn] = useState(false);

  const data = useMemo(() => points.slice(-Number(period)), [points, period]);
  const months = data.length;
  const revenue = data.reduce((sum, p) => sum + p.revenueCents, 0);
  const expenses = data.reduce((sum, p) => sum + p.expensesCents, 0);
  const result = revenue - expenses;

  const animation = {
    isAnimationActive: !reduceMotion,
    animationDuration: hasDrawn ? motionTokens.chartUpdateMs : motionTokens.chartDrawMs,
    animationEasing: "ease-out" as const,
    onAnimationEnd: () => setHasDrawn(true),
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Receita × Despesas"
        subtitle={
          <>
            Resultado de{" "}
            <span className={clsx("font-semibold tabular-nums", result >= 0 ? "text-success" : "text-danger")}>
              {formatSignedBRL(result)}
            </span>{" "}
            em {months} meses
          </>
        }
        action={<SegmentedControl label="Período do gráfico" options={PERIODS} value={period} onChange={setPeriod} />}
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-light" aria-hidden="true" />
          Receita <span className="font-semibold text-fg tabular-nums">{formatBRLCompact(revenue)}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          Despesas <span className="font-semibold text-fg tabular-nums">{formatBRLCompact(expenses)}</span>
        </span>
      </div>

      <div
        className="-mx-2 mt-3 min-h-[220px] flex-1"
        role="img"
        aria-label={`Gráfico de área: receita de ${formatBRL(revenue)} e despesas de ${formatBRL(expenses)} nos últimos ${months} meses`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id={`rev-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.45} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`exp-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.accent} stopOpacity={0.2} />
                <stop offset="100%" stopColor={colors.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={colors.line} strokeDasharray="4 6" vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonthShort}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              minTickGap={16}
            />
            <YAxis
              tickFormatter={formatBRLCompact}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              tickMargin={6}
              width={74}
              tickCount={5}
            />
            <Tooltip
              animationDuration={motionTokens.fast * 1000}
              cursor={{ stroke: colors.lineStrong, strokeDasharray: "4 4" }}
              content={(props) => (
                <ChartTooltip
                  active={props.active}
                  payload={props.payload}
                  label={props.label}
                  labelFormatter={formatMonthLong}
                  valueFormatter={formatBRL}
                  order={["revenueCents", "expensesCents"]}
                  footer={(v) => {
                    const net = (v.revenueCents ?? 0) - (v.expensesCents ?? 0);
                    return (
                      <p className="flex items-center justify-between gap-6 text-sm">
                        <span className="text-muted">Resultado</span>
                        <span className={clsx("font-semibold tabular-nums", net >= 0 ? "text-success" : "text-danger")}>
                          {formatSignedBRL(net)}
                        </span>
                      </p>
                    );
                  }}
                />
              )}
            />
            <Area
              type="monotone"
              dataKey="expensesCents"
              name="Despesas"
              stroke={colors.accent}
              strokeWidth={2}
              fill={`url(#exp-${uid})`}
              activeDot={{ r: 4, fill: colors.accent, stroke: colors.surface, strokeWidth: 2 }}
              {...animation}
            />
            <Area
              type="monotone"
              dataKey="revenueCents"
              name="Receita"
              stroke={colors.primaryLight}
              strokeWidth={2.5}
              fill={`url(#rev-${uid})`}
              activeDot={{
                r: 5,
                fill: colors.primaryLight,
                stroke: colors.surface,
                strokeWidth: 2,
                style: { filter: `drop-shadow(0 0 6px ${colors.primary})` },
              }}
              {...animation}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function RevenueExpensesSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>
      <Skeleton className="mt-5 h-3 w-60" />
      <Skeleton className="mt-4 w-full flex-1 rounded-xl" />
    </Card>
  );
}
