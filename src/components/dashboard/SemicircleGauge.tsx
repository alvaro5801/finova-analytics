"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { colors, motionTokens } from "@/lib/tokens";

const SIZE = 224;
const STROKE = 16;
const FROM_DEG = 228;
const SWEEP_DEG = 198;
const RADIUS = SIZE / 2 - STROKE / 2;
const CENTER = SIZE / 2;
const ARC_LENGTH = RADIUS * ((SWEEP_DEG * Math.PI) / 180);

function pointOnArc(deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.sin(rad),
    y: CENTER - RADIUS * Math.cos(rad),
  };
}

function arcPath(fromDeg: number, sweepDeg: number) {
  const start = pointOnArc(fromDeg);
  const end = pointOnArc(fromDeg + sweepDeg);
  const largeArc = sweepDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function SemicircleGauge({
  valuePct,
  gradientId,
  gradientStops,
  capColor,
  trackColor = colors.line,
  trackSweepDeg = SWEEP_DEG,
  fromDeg = FROM_DEG,
  size,
  className,
  children,
}: {
  valuePct: number;
  gradientId: string;
  gradientStops: { offset: number; color: string }[];
  capColor: string;
  trackColor?: string;
  trackSweepDeg?: number;
  fromDeg?: number;
  size?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRevealed(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const pct = Math.min(Math.max(valuePct, 0), 100) / 100;
  const visibleLength = ARC_LENGTH * pct;
  const finalOffset = ARC_LENGTH - visibleLength;
  const cap = pointOnArc(fromDeg + SWEEP_DEG * pct);
  const start = pointOnArc(fromDeg);
  const end = pointOnArc(fromDeg + SWEEP_DEG);
  const valuePath = arcPath(fromDeg, SWEEP_DEG);
  const trackPath = trackSweepDeg === SWEEP_DEG ? valuePath : arcPath(fromDeg, trackSweepDeg);

  return (
    <div
      className={clsx("relative", size ? "shrink-0" : "aspect-square", className)}
      style={size ? { height: size, width: size } : undefined}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
          >
            {gradientStops.map((stop) => (
              <stop key={stop.offset} offset={`${stop.offset}%`} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
        <path d={trackPath} stroke={trackColor} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
        <path
          d={valuePath}
          stroke={`url(#${gradientId})`}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: ARC_LENGTH,
            strokeDashoffset: revealed ? finalOffset : ARC_LENGTH,
            transition: `stroke-dashoffset ${motionTokens.chartDrawMs}ms cubic-bezier(0.22,1,0.36,1)`,
          }}
        />
        <circle
          cx={cap.x}
          cy={cap.y}
          r={STROKE / 2}
          fill={capColor}
          style={{
            opacity: revealed ? 1 : 0,
            filter: `drop-shadow(0 0 5px ${capColor})`,
            transition: `opacity 300ms ease-out ${motionTokens.chartDrawMs - 150}ms`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
