"use client";

import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatBRL, formatDate } from "@/lib/format";
import { useAppSelector } from "@/store/hooks";
import { downloadInvoicePdf } from "@/components/billing/invoicePdf";
import { motionTokens } from "@/lib/tokens";
import type { InvoiceData } from "@/types/dashboard";

export function InvoicesCard({ invoices }: { invoices: InvoiceData[] }) {
  const pagination = usePagination(invoices);
  const primaryCard = useAppSelector((state) => state.billing.cards.find((card) => card.primary));
  const paymentMethod = primaryCard ? `${primaryCard.brand} •••• ${primaryCard.last4}` : "Débito automático";

  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Faturas" subtitle="Histórico da assinatura Finova Business" />
      <ul className="mt-4 flex flex-col divide-y divide-line">
        {pagination.items.map((invoice, i) => (
          <motion.li
            key={invoice.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.base, delay: i * 0.05, ease: motionTokens.ease }}
            className="flex items-center gap-3 py-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-muted ring-1 ring-inset ring-line">
              <FileText size={16} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-fg">{formatDate(invoice.issuedAt)}</p>
              <p className="font-mono text-xs text-muted">{invoice.code}</p>
            </div>
            <span className="text-sm font-semibold text-fg tabular-nums">{formatBRL(invoice.amountCents)}</span>
            <button
              type="button"
              onClick={() => downloadInvoicePdf(invoice, paymentMethod)}
              aria-label={`Baixar PDF da fatura ${invoice.code}`}
              className="fn-press inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-fg"
            >
              <Download size={14} aria-hidden="true" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </motion.li>
        ))}
      </ul>
      <Pagination
        {...pagination}
        onPageChange={pagination.setPage}
        label="Paginação das faturas"
        className="mt-auto"
      />
    </Card>
  );
}

export function InvoicesCardSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-2 h-3 w-48" />
      <div className="mt-5 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </Card>
  );
}
