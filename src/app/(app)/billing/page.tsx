"use client";

import { Reveal } from "@/components/ui/Reveal";
import { BillingSummary } from "@/components/billing/BillingSummary";
import { PaymentMethodCard } from "@/components/billing/PaymentMethodCard";
import { InvoicesCard, InvoicesCardSkeleton } from "@/components/billing/InvoicesCard";
import { useGetInvoicesQuery } from "@/store/api/dashboardApi";

export default function BillingPage() {
  const invoices = useGetInvoicesQuery();

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <BillingSummary />
      </Reveal>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Reveal delay={0.06}>
            <PaymentMethodCard />
          </Reveal>
        </div>
        <div className="lg:col-span-2">
          {invoices.isLoading && <InvoicesCardSkeleton />}
          {invoices.isError && (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-500">
              Couldn&apos;t load invoices.
            </div>
          )}
          {invoices.data && (
            <Reveal delay={0.12}>
              <InvoicesCard invoices={invoices.data} />
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
