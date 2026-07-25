import clsx from "clsx";

export function Card({
  children,
  className,
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={clsx(
        "glass-card card-shadow rounded-2xl p-6 backdrop-blur-[120px] transition-colors duration-300 hover:border-white/25",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
