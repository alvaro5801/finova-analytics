import clsx from "clsx";
import { RefreshCw, TriangleAlert } from "lucide-react";

/** Estado de erro isolado por widget: uma falha não derruba o resto da página. */
export function ErrorState({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={clsx(
        "flex h-full min-h-[120px] flex-col items-start justify-center gap-3 rounded-2xl border border-danger/25 bg-danger/[0.06] p-5",
        className,
      )}
    >
      <p className="flex items-center gap-2 text-sm font-medium text-danger">
        <TriangleAlert size={16} aria-hidden="true" />
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="fn-press inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-fg transition-colors duration-200 hover:bg-white/[0.06]"
        >
          <RefreshCw size={13} aria-hidden="true" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
