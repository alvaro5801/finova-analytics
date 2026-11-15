import clsx from "clsx";

export function Card({
  children,
  className,
  style,
  interactive = false,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Ativa o hover com elevação (KPIs e cards clicáveis). */
  interactive?: boolean;
}) {
  return (
    <div
      className={clsx("fn-card rounded-2xl p-6", interactive && "fn-card-interactive", className)}
      style={style}
    >
      {children}
    </div>
  );
}
