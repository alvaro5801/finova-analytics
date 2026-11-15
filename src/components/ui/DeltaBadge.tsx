import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatPercent } from "@/lib/format";

/**
 * Variação percentual colorida pelo significado, não pelo sinal:
 * despesa subindo é ruim (`goodWhenUp={false}`).
 */
export function DeltaBadge({ value, goodWhenUp = true }: { value: number; goodWhenUp?: boolean }) {
  const up = value >= 0;
  const good = up === goodWhenUp;
  const Icon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
        good ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
      )}
    >
      <Icon size={13} aria-hidden="true" />
      <span className="sr-only">{up ? "alta de " : "queda de "}</span>
      {formatPercent(Math.abs(value))}
    </span>
  );
}
