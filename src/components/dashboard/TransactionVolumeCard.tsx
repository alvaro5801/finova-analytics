"use client";

import { Bar, BarChart, ResponsiveContainer, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { renderIcon } from "@/lib/icon-map";
import type { ActiveUsersResponse } from "@/types/dashboard";

const PROGRESS_WIDTHS = [70, 45, 85, 55];

export function ActiveUsersCard({ data }: { data: ActiveUsersResponse }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="h-[222px] shrink-0 rounded-2xl bg-[#060C29] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.chart}
            margin={{ top: 4, right: 4, bottom: 8, left: -20 }}
          >
            <YAxis
              tick={{ fill: "#A0AEC0", fontSize: 9, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
              allowDecimals={false}
              interval={0}
            />
            <Bar
              dataKey="value"
              fill="#FFFFFF"
              radius={[15, 15, 15, 15]}
              barSize={7}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-5 text-[18px] font-bold text-white">Active Users</p>
      <p className="mt-1 text-sm text-[#A0AEC0]">
        <span className="font-bold text-emerald-400">(+23)</span>{" "}
        <span className="text-[#A0AEC0] text-[14px] font-bold">
          than last week
        </span>
      </p>

      <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.stats.map((stat, i) => {
          return (
            <div key={stat.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0075ff] text-white">
                  {renderIcon(stat.icon, { size: 14 })}
                </span>
                <span className="truncate text-xs text-[#A0AEC0]">
                  {stat.label}
                </span>
              </div>
              <p className="text-lg font-bold text-white text-[18px]">
                {stat.value}
              </p>
              <div className="h-1 w-[100px] max-w-full overflow-hidden rounded-full bg-[#2D2E5F]">
                <div
                  className="h-full rounded-full bg-[#0075ff]"
                  style={{ width: `${PROGRESS_WIDTHS[i % PROGRESS_WIDTHS.length]}px` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function ActiveUsersSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <Skeleton className="h-[222px] shrink-0 rounded-2xl" />
      <Skeleton className="mt-5 h-3 w-28" />
      <Skeleton className="mt-2 h-3 w-36" />
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </Card>
  );
}
