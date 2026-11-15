import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={clsx("fn-skeleton rounded-lg", className)} />;
}
