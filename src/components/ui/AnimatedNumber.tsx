"use client";

import { useLayoutEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { formatMetric } from "@/lib/format";
import { motionTokens } from "@/lib/tokens";
import type { MetricFormat } from "@/types/dashboard";

/**
 * Contagem de 0 até `value` na montagem, sem re-render por frame (escreve direto no nó).
 * Com movimento reduzido, mostra o valor final na hora.
 */
export function AnimatedNumber({
  value,
  format,
  className,
}: {
  value: number;
  format: MetricFormat;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduceMotion) {
      node.textContent = formatMetric(value, format);
      return;
    }
    node.textContent = formatMetric(0, format);
    const controls = animate(0, value, {
      duration: motionTokens.chartDrawMs / 1000,
      ease: motionTokens.ease,
      onUpdate: (latest) => {
        node.textContent = formatMetric(Math.round(latest), format);
      },
    });
    return () => controls.stop();
  }, [value, format, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {formatMetric(value, format)}
    </span>
  );
}
