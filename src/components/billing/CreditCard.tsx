import clsx from "clsx";
import { Nfc } from "lucide-react";

export function CreditCard({
  brand,
  number,
  holder,
  expires,
  primary,
  className,
}: {
  brand: string;
  number: string;
  holder: string;
  expires: string;
  primary: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl p-5 text-white ring-1 ring-inset ring-white/10",
        primary ? "grad-primary" : "grad-dark",
        className,
      )}
    >
      <div aria-hidden="true" className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <span className="text-sm font-semibold tracking-wide">{brand}</span>
        {primary && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            Principal
          </span>
        )}
      </div>
      <div className="relative mt-6 flex items-center gap-3">
        <span className="h-7 w-9 rounded-md bg-gradient-to-br from-amber-200/90 to-amber-400/80" aria-hidden="true" />
        <Nfc size={18} className="text-white/70" aria-hidden="true" />
      </div>
      <p className="relative mt-4 truncate font-mono text-base tracking-[0.18em] tabular-nums">{number}</p>
      <div className="relative mt-3 flex justify-between gap-3 text-[11px] uppercase tracking-wide text-white/70">
        <span className="truncate">{holder}</span>
        <span className="shrink-0">Val. {expires}</span>
      </div>
    </div>
  );
}
