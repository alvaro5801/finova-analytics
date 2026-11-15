"use client";

import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { ChartTooltip } from "@/components/ui/ChartTooltip";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatMetric, formatNumber } from "@/lib/format";
import { renderIcon } from "@/lib/icon-map";
import { colors, motionTokens } from "@/lib/tokens";
import type { ActiveUsersResponse } from "@/types/dashboard";

const axisTick = { fill: colors.muted, fontSize: 11 };

export function TransactionVolumeCard({ data }: { data: ActiveUsersResponse }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduceMotion = useReducedMotion();
  const total = data.chart.reduce((sum, d) => sum + d.value, 0);
  const peakIndex = data.chart.reduce((best, d, i, arr) => (d.value > arr[best].value ? i : best), 0);
  const peak = data.chart[peakIndex];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Volume de transações"
        subtitle={
          <>
            Últimos 7 dias · pico na <span className="font-semibold text-fg">{peak?.day}</span>
          </>
        }
      />

      <div
        className="fn-well mt-4 h-[170px] shrink-0 rounded-xl px-1 pb-1 pt-3"
        role="img"
        aria-label={`Gráfico de barras: ${formatNumber(total)} transações nos últimos 7 dias, com pico na ${peak?.day}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.chart} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`bar-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primaryLight} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.35} />
              </linearGradient>
              <linearGradient id={`peak-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.accent} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={colors.line} strokeDasharray="4 6" vertical={false} />
            <XAxis dataKey="day" tick={axisTick} axisLine={false} tickLine={false} tickMargin={6} />
            <YAxis
              tickFormatter={formatNumber}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              width={44}
              tickCount={4}
            />
            <Tooltip
              animationDuration={motionTokens.fast * 1000}
              cursor={{ fill: "rgba(232, 237, 247, 0.04)", radius: 8 }}
              content={(props) => (
                <ChartTooltip
                  active={props.active}
                  payload={props.payload}
                  label={props.label}
                  valueFormatter={formatNumber}
                />
              )}
            />
            <Bar
              dataKey="value"
              name="Transações"
              radius={[6, 6, 6, 6]}
              maxBarSize={22}
              isAnimationActive={!reduceMotion}
              animationDuration={motionTokens.chartDrawMs}
              animationEasing="ease-out"
            >
              {data.chart.map((entry, i) => (
                <Cell key={entry.id} fill={i === peakIndex ? `url(#peak-${uid})` : `url(#bar-${uid})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        {data.stats.map((stat) => (
          <div key={stat.id} className="fn-well rounded-xl px-3 py-2.5">
            <dt className="flex items-center gap-2 text-xs text-muted">
              <span className="text-primary-light">{renderIcon(stat.icon, { size: 14 })}</span>
              <span className="truncate">{stat.label}</span>
            </dt>
            <dd className="mt-1 text-lg font-semibold tracking-tight text-fg tabular-nums">
              {formatMetric(stat.value, stat.format)}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export function TransactionVolumeSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <Skeleton className="h-4 w-44" />
      <Skeleton className="mt-2 h-3 w-36" />
      <Skeleton className="mt-4 h-[170px] w-full rounded-xl" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </Card>
  );
}
