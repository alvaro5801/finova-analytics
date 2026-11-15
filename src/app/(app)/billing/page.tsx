"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ErrorState } from "@/components/ui/ErrorState";
import { BillingSummary, BillingSummarySkeleton } from "@/components/billing/BillingSummary";
import { PaymentMethodCard } from "@/components/billing/PaymentMethodCard";
import { InvoicesCard, InvoicesCardSkeleton } from "@/components/billing/InvoicesCard";
import { useGetInvoicesQuery } from "@/store/api/dashboardApi";

export default function BillingPage() {
  const invoices = useGetInvoicesQuery();

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      {invoices.isLoading && <BillingSummarySkeleton />}
      {invoices.data && (
        <Reveal>
          <BillingSummary invoices={invoices.data} />
        </Reveal>
      )}

      <div className="grid grid-cols-1 gap-4 lg:gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Reveal delay={0.06} className="h-full">
          <PaymentMethodCard />
        </Reveal>
        <div className="min-w-0">
          {invoices.isLoading && <InvoicesCardSkeleton />}
          {invoices.isError && (
            <ErrorState message="Não foi possível carregar as faturas." onRetry={invoices.refetch} />
          )}
          {invoices.data && (
            <Reveal delay={0.12} className="h-full">
              <InvoicesCard invoices={invoices.data} />
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
