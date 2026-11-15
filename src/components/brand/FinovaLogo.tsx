import { useId } from "react";
import clsx from "clsx";

/** Símbolo da Finova: um "F" em traço com uma faísca, a "nova". */
export function FinovaMark({ size = 32, className }: { size?: number; className?: string }) {
  const gradientId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={clsx("shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7958F5" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
      <path
        d="M11 23V9.5h9.5M11 16h6.5"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M23.5 18.5Q24 21 26.5 21.5Q24 22 23.5 24.5Q23 22 20.5 21.5Q23 21 23.5 18.5Z" fill="#fff" />
    </svg>
  );
}

export function FinovaLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <FinovaMark size={compact ? 28 : 32} />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-fg">Finova</span>
        {!compact && (
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
            Analytics
          </span>
        )}
      </span>
    </span>
  );
}
