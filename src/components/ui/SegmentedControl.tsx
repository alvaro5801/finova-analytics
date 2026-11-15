"use client";

import { useId } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  /** Rótulo completo para leitores de tela (ex.: "Últimos 3 meses"). */
  ariaLabel?: string;
}

/** Grupo de botões com pill animado (layoutId) marcando a opção ativa. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  const groupId = useId();

  return (
    <div role="group" aria-label={label} className="inline-flex shrink-0 rounded-xl border border-line bg-sunken p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={option.ariaLabel}
            onClick={() => onChange(option.value)}
            className={clsx(
              "fn-press relative isolate rounded-lg px-3 py-1 text-xs font-semibold transition-colors duration-200",
              active ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId={`segment-${groupId}`}
                className="absolute inset-0 -z-10 rounded-lg bg-primary/25 ring-1 ring-inset ring-primary/40"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
