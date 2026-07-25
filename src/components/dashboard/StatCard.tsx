import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { StatCardData } from "@/types/dashboard";

export function StatCardSkeleton() {
  return (
    <Card
      className="flex h-[80px] items-center justify-between gap-4"
      style={{
        background:
          "linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%)",
      }}
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
    </Card>
  );
}

export function StatCard({ stat }: { stat: StatCardData }) {
  const positive = stat.changePct >= 0;

  return (
    <Card
      className="flex h-[80px] items-center justify-between gap-4"
      style={{
        background:
          "linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%)",
      }}
    >
      <div>
        <p className="text-[12px] text-slate-300">{stat.title}</p>
        <p className="flex items-baseline gap-1.5">
          <span className="text-[18px] font-bold text-white">{stat.value}</span>
          <span
            className={`text-[14px] font-semibold ${
              positive ? "text-emerald-400" : "text-rose-500"
            }`}
          >
            {positive ? "+" : ""}
            {stat.changePct}%
          </span>
        </p>
      </div>
      <div className="icon-shadow h-[50px] w-[50px] shrink-0 overflow-hidden rounded-xl">
        <img
          src={`/icons/${stat.icon}.png`}
          alt=""
          className="h-[50px] w-[50px]"
        />
      </div>
    </Card>
  );
}
