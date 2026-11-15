"use client";

import { useEffect, useRef, useState } from "react";
import { Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { SemicircleGauge } from "@/components/dashboard/SemicircleGauge";
import { formatBRLCompact, formatPercent } from "@/lib/format";
import { colors } from "@/lib/tokens";
import type { SatisfactionRateData } from "@/types/dashboard";

const MAX_GAUGE = 196;
/** O arco ocupa ~62% da altura do quadrado do gauge; o resto fica livre para o painel. */
const ARC_HEIGHT_RATIO = 0.62;

export function RevenueGoalCard({ goal }: { goal: SatisfactionRateData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(MAX_GAUGE);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setSize(Math.min(entries[0].contentRect.width, MAX_GAUGE));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader title={goal.label} subtitle="Receita acumulada no ano" />

      <div ref={containerRef} className="mx-auto mt-4 w-full max-w-[240px]">
        <div className="relative mx-auto" style={{ width: size, height: size * ARC_HEIGHT_RATIO }}>
          <SemicircleGauge
            size={size}
            valuePct={goal.value}
            gradientId="revenueGoalGradient"
            gradientStops={[
              { offset: 0, color: "rgba(121,88,245,0.15)" },
              { offset: 100, color: colors.primary },
            ]}
            capColor={colors.primaryLight}
            fromDeg={261}
          >
            <span className="absolute bottom-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-primary/15 text-primary-light ring-1 ring-inset ring-primary/30">
              <Target size={20} aria-hidden="true" />
            </span>
          </SemicircleGauge>
        </div>
      </div>

      <div className="fn-well mt-auto flex items-end justify-between rounded-xl px-4 py-3">
        <span className="text-xs text-muted">0%</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-semibold tracking-tight text-fg tabular-nums">
            {formatPercent(goal.value)}
          </span>
          <span className="text-xs text-muted">de {formatBRLCompact(goal.targetCents)}</span>
        </div>
        <span className="text-xs text-muted">100%</span>
      </div>
    </Card>
  );
}

export function RevenueGoalSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-2 h-3 w-28" />
      <Skeleton className="mx-auto mt-6 h-[110px] w-[190px] rounded-t-full" />
      <Skeleton className="mt-auto h-14 w-full rounded-xl" />
    </Card>
  );
}
