"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { SalesPointData } from "@/types/dashboard";

export function SalesOverviewCard({ points }: { points: SalesPointData[] }) {
  return (
    <Card
      className="flex h-full flex-col"
      style={{
        background:
          "linear-gradient(126.97deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(10, 14, 35, 0.71) 91.2%)",
      }}
    >
      <p className="text-[18px] font-bold text-white">Sales overview</p>
      <p className="mt-1 text-sm text-[#A0AEC0]">
        <span className="font-bold text-emerald-400">(+5) more</span> in 2021
      </p>

      <div className="mt-4 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={points}
            margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
          >
            <defs>
              <linearGradient
                id="salesAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#0075ff" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#0075ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="salesSecondaryGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#2cd9ff" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#2cd9ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#A0AEC0", fontSize: 9, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              tickMargin={15}
            />
            <YAxis
              tick={{ fill: "#A0AEC0", fontSize: 9, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              tickMargin={15}
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
            />
            <Tooltip
              contentStyle={{
                background: "#1a1f3d",
                border: "none",
                borderRadius: 12,
                color: "white",
                fontSize: 12,
              }}
              labelStyle={{ color: "rgba(255,255,255,0.7)" }}
            />
            <Area
              type="natural"
              dataKey="value"
              stroke="#0075ff"
              strokeWidth={3}
              fill="url(#salesAreaGradient)"
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
            <Area
              type="natural"
              dataKey="secondary"
              stroke="#2cd9ff"
              strokeWidth={2.5}
              fill="url(#salesSecondaryGradient)"
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function SalesOverviewSkeleton() {
  return (
    <Card
      className="flex h-full flex-col"
      style={{
        background:
          "linear-gradient(126.97deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(10, 14, 35, 0.71) 91.2%)",
      }}
    >
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-2 h-4 w-40" />
      <Skeleton className="mt-6 h-64 w-full" />
    </Card>
  );
}
