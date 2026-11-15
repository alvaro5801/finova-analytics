/** Item do payload que o Recharts injeta no `content` do Tooltip. */
interface TooltipItem {
  name?: string | number;
  value?: number | string | ReadonlyArray<number | string>;
  color?: string;
  dataKey?: string | number | ((obj: unknown) => unknown);
}

/** Tooltip escuro padrão dos gráficos: rótulo, séries e um rodapé opcional. */
export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  order,
  footer,
}: {
  active?: boolean;
  payload?: ReadonlyArray<TooltipItem>;
  label?: string | number;
  labelFormatter?: (label: string) => string;
  valueFormatter: (value: number) => string;
  /** Ordem de exibição das séries por `dataKey`. */
  order?: string[];
  footer?: (values: Record<string, number>) => React.ReactNode;
}) {
  if (!active || !payload?.length) return null;

  const items = [...payload].sort((a, b) =>
    order ? order.indexOf(String(a.dataKey)) - order.indexOf(String(b.dataKey)) : 0,
  );
  const values = Object.fromEntries(items.map((item) => [String(item.dataKey), Number(item.value)]));

  return (
    <div className="min-w-[200px] rounded-xl border border-line-strong bg-surface/95 px-3.5 py-3 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md">
      {label !== undefined && (
        <p className="text-xs font-medium text-muted">
          {labelFormatter ? labelFormatter(String(label)) : label}
        </p>
      )}
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={String(item.dataKey)} className="flex items-center justify-between gap-6 text-sm">
            <span className="flex items-center gap-2 text-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: item.color }} aria-hidden="true" />
              {item.name}
            </span>
            <span className="font-semibold text-fg tabular-nums">{valueFormatter(Number(item.value))}</span>
          </li>
        ))}
      </ul>
      {footer && <div className="mt-2.5 border-t border-line pt-2.5">{footer(values)}</div>}
    </div>
  );
}
