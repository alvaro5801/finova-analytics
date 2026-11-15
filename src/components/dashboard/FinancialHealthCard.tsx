"use client";

import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { DeltaBadge } from "@/components/ui/DeltaBadge";
import { SemicircleGauge } from "@/components/dashboard/SemicircleGauge";
import { formatDecimal, formatMetric } from "@/lib/format";
import { colors } from "@/lib/tokens";
import type { ReferralResponse } from "@/types/dashboard";

export function FinancialHealthCard({ data }: { data: ReferralResponse }) {
  const score = data.score;
  const scorePct = score ? (score.value / score.maxValue) * 100 : 0;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Saúde financeira" subtitle="Indicadores do último mês fechado" />

      <div className="mt-5 flex flex-1 flex-col items-center gap-5 sm:flex-row sm:items-center">
        <ul className="flex w-full flex-col gap-3 sm:max-w-[15rem]">
          {data.summary.map((item) => (
            <li key={item.id} className="fn-well rounded-xl px-4 py-3">
              <p className="text-xs text-muted">{item.label}</p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                <span className="text-lg font-semibold tracking-tight text-fg tabular-nums">
                  {formatMetric(item.value, item.format)}
                </span>
                <DeltaBadge value={item.changePct} />
              </div>
            </li>
          ))}
        </ul>

        {score && (
          <div className="mx-auto shrink-0" style={{ height: 150 }}>
            <SemicircleGauge
              size={168}
              valuePct={scorePct}
              gradientId="healthGaugeGradient"
              gradientStops={[
                { offset: 0, color: "rgba(94,202,142,0.12)" },
                { offset: 100, color: colors.success },
              ]}
              capColor={colors.success}
              fromDeg={261}
            >
              <div className="flex -translate-y-3 flex-col items-center">
                <span className="text-xs text-muted">{score.label}</span>
                <span className="text-4xl font-semibold tracking-tight text-fg tabular-nums">
                  {formatDecimal(score.value)}
                </span>
                <span className="text-xs font-semibold text-success">{score.caption}</span>
              </div>
            </SemicircleGauge>
          </div>
        )}
      </div>
    </Card>
  );
}

export function FinancialHealthSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-2 h-3 w-44" />
      <div className="mt-5 flex flex-1 items-center gap-5">
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
        <Skeleton className="hidden h-32 w-36 shrink-0 rounded-t-full sm:block" />
      </div>
    </Card>
  );
}
