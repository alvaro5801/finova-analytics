"use client";

import { MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { SemicircleGauge } from "@/components/dashboard/SemicircleGauge";
import type { ReferralResponse } from "@/types/dashboard";

function SafetyGauge({ score }: { score: number }) {
  return (
    <SemicircleGauge
      valuePct={100}
      size={176}
      gradientId="referralGaugeGradient"
      gradientStops={[
        { offset: 0, color: "rgba(16,185,129,0)" },
        { offset: 100, color: "#10b981" },
      ]}
      capColor="#10b981"
    >
      <div className="flex flex-col items-center justify-center">
        <span className="text-sm text-slate-400">Safety</span>
        <span className="text-5xl font-bold text-white">{score}</span>
        <span className="text-sm text-slate-400">Total Score</span>
      </div>
    </SemicircleGauge>
  );
}

export function ReferralCard({ data }: { data: ReferralResponse }) {
  const invited = data.summary.find((s) => s.series === "invited");
  const bonus = data.summary.find((s) => s.series === "bonus");

  return (
    <Card
      className="flex h-full flex-col"
      style={{
        background:
          "linear-gradient(126.97deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(14, 21, 58, 0.71) 91.2%)",
      }}
    >
      <div className="flex items-start justify-between">
        <p className="text-[18px] font-bold text-white">Referral Tracking</p>
        <button
          aria-label="More options"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1f37] text-[#7551ff] transition-colors hover:bg-[#232a4d]"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="flex flex-1 items-center gap-4">
        <div className="ml-[20px] mr-[50px] flex w-[217px] max-w-full flex-col gap-4">
          <div className="rounded-2xl bg-black/25 px-5 py-4">
            <p className="text-sm text-slate-400">Invited</p>
            <p className="mt-1 text-xl font-bold text-white">
              {invited?.total}
            </p>
          </div>
          <div className="rounded-2xl bg-black/25 px-5 py-4">
            <p className="text-sm text-slate-400">Bonus</p>
            <p className="mt-1 text-xl font-bold text-white">{bonus?.total}</p>
          </div>
        </div>
        <SafetyGauge score={9.3} />
      </div>
    </Card>
  );
}

export function ReferralSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="flex flex-1 items-center gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
        <Skeleton className="h-32 w-32 shrink-0 rounded-full" />
      </div>
    </Card>
  );
}
