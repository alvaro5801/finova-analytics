"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative h-6 w-11 shrink-0 rounded-full ring-1 ring-inset transition-colors duration-200",
        checked ? "bg-primary ring-primary/50" : "bg-white/[0.08] ring-line-strong",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
        style={{ insetInlineStart: checked ? "calc(100% - 1.375rem)" : "0.125rem" }}
      />
    </button>
  );
}
