import clsx from "clsx";

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("flex flex-wrap items-start justify-between gap-3", className)}>
      <div className="min-w-[12rem] flex-1">
        <h2 className="text-base font-semibold tracking-tight text-fg">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
