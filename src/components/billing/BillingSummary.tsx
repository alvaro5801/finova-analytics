import clsx from "clsx";
import { CalendarDays, CircleDollarSign, Receipt, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatBRL, formatDate } from "@/lib/format";
import type { InvoiceData } from "@/types/dashboard";

function addMonths(iso: string, months: number) {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth() + months, d.getDate());
}

/** Resumo derivado das próprias faturas: nada aqui é número fixo. */
export function BillingSummary({ invoices }: { invoices: InvoiceData[] }) {
  const latest = invoices[0];
  const total = invoices.reduce((sum, inv) => sum + inv.amountCents, 0);

  const items: { label: string; value: string; hint: string; icon: LucideIcon; chip: string }[] = [
    {
      label: `Total faturado (${invoices.length} meses)`,
      value: formatBRL(total),
      hint: "Assinatura Finova Business",
      icon: Receipt,
      chip: "bg-primary/15 text-primary-light ring-primary/25",
    },
    {
      label: "Última fatura",
      value: latest ? formatBRL(latest.amountCents) : "—",
      hint: latest ? `Emitida em ${formatDate(latest.issuedAt)}` : "Nenhuma fatura",
      icon: CircleDollarSign,
      chip: "bg-accent/10 text-accent ring-accent/25",
    },
    {
      label: "Próximo vencimento",
      value: latest ? formatDate(addMonths(latest.issuedAt, 1)) : "—",
      hint: "Débito automático no cartão principal",
      icon: CalendarDays,
      chip: "bg-warning/10 text-warning ring-warning/25",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
      {items.map((item) => (
        <Card key={item.label} interactive className="flex items-start gap-4 p-5">
          <span
            className={clsx(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
              item.chip,
            )}
          >
            <item.icon size={18} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-1 truncate text-xl font-semibold tracking-tight text-fg tabular-nums">{item.value}</p>
            <p className="mt-0.5 truncate text-xs text-muted">{item.hint}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function BillingSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="flex items-start gap-4 p-5">
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-36" />
          </div>
        </Card>
      ))}
    </div>
  );
}
