"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { SemicircleGauge } from "@/components/dashboard/SemicircleGauge";
import type { SatisfactionRateData } from "@/types/dashboard";

const MAX_GAUGE_HEIGHT = 210;

export function SatisfactionCard({ rate }: { rate: SatisfactionRateData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gaugeSize, setGaugeSize] = useState(MAX_GAUGE_HEIGHT);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setGaugeSize(Math.min(width, MAX_GAUGE_HEIGHT));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Card
      className="relative flex h-full flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)",
      }}
    >
      <p className="text-[18px] font-bold text-white">Satisfaction Rate</p>
      <p className="mt-1 text-[14px] font-normal text-[#A0AEC0]">
        {rate.label}
      </p>

      <div
        ref={containerRef}
        className="mx-auto mt-2 flex w-full max-w-[280px] flex-1 items-start justify-center"
      >
        <SemicircleGauge
          size={gaugeSize}
          valuePct={rate.value}
          gradientId="satisfactionGaugeGradient"
          gradientStops={[
            { offset: 0, color: "rgba(0,117,255,0)" },
            { offset: 100, color: "#0075FF" },
          ]}
          capColor="#0075FF"
          trackColor="transparent"
          fromDeg={261}
        >
          <div className="icon-shadow absolute bottom-[50%] left-1/2 flex h-[48px] w-[48px] -translate-x-1/2 items-center justify-center rounded-full bg-[#0075ff]">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8" />
              <circle cx="9" cy="10" r="1.1" fill="white" />
              <circle cx="15" cy="10" r="1.1" fill="white" />
              <path
                d="M8.5 14c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </SemicircleGauge>
      </div>

      <div className="absolute inset-x-6 bottom-6 flex items-start justify-between rounded-2xl bg-[#050a24] px-5 pt-4 pb-4">
        <span className="text-xs text-slate-400">0%</span>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-white">{rate.value}%</span>
          <span className="text-xs text-slate-400">Based on likes</span>
        </div>
        <span className="text-xs text-slate-400">100%</span>
      </div>
    </Card>
  );
}

export function SatisfactionSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-2 h-3 w-20" />
      <Skeleton className="mx-auto mt-4 h-[240px] w-full max-w-[280px] rounded-2xl" />
    </Card>
  );
}
