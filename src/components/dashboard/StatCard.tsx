import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { DeltaBadge } from "@/components/ui/DeltaBadge";
import { renderIcon } from "@/lib/icon-map";
import { toneChip } from "@/lib/tones";
import type { StatCardData } from "@/types/dashboard";

/** KPIs em que subir é ruim (a seta fica vermelha). */
const UP_IS_BAD = new Set(["expenses"]);

export function StatCard({ stat }: { stat: StatCardData }) {
  return (
    <Card interactive className="flex h-full flex-col gap-3 p-4 sm:gap-5 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span
          className={clsx(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset sm:h-10 sm:w-10 sm:rounded-xl",
            toneChip[stat.color] ?? toneChip.dark,
          )}
        >
          {renderIcon(stat.icon, { size: 18, strokeWidth: 2 })}
        </span>
        <DeltaBadge value={stat.changePct} goodWhenUp={!UP_IS_BAD.has(stat.key)} />
      </div>
      {/* Container query: o tamanho do valor acompanha a largura do card, não a da viewport. */}
      <div className="@container min-w-0">
        <p className="truncate text-xs text-muted sm:text-sm">{stat.title}</p>
        <p className="mt-1 truncate text-[0.82rem] font-semibold leading-tight tracking-tight text-fg tabular-nums @[8.5rem]:text-[0.95rem] @[11rem]:text-[1.25rem] @[14rem]:text-[1.6rem] sm:mt-1.5">
          <AnimatedNumber value={stat.value} format={stat.format} />
        </p>
        <p className="mt-1 truncate text-[11px] text-muted sm:text-xs">{stat.changeLabel}</p>
      </div>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-3 p-4 sm:gap-5 sm:p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-8 w-8 rounded-lg sm:h-10 sm:w-10 sm:rounded-xl" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-6 w-28 sm:h-7 sm:w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
    </Card>
  );
}
