"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { InvoiceData } from "@/types/dashboard";

export function InvoicesCard({ invoices }: { invoices: InvoiceData[] }) {
  return (
    <Card>
      <p className="mb-4 text-sm font-semibold text-slate-700">Invoices</p>
      <ul className="flex flex-col divide-y divide-slate-100">
        {invoices.map((invoice, i) => (
          <motion.li
            key={invoice.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center justify-between gap-3 py-3"
          >
            <div>
              <p className="text-sm font-medium text-slate-600">{invoice.date}</p>
              <p className="text-xs text-slate-400">{invoice.code}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-600">{invoice.amount}</span>
              <button
                aria-label="Download invoice"
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-blue-500"
              >
                <Download size={14} /> PDF
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}

export function InvoicesCardSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-24" />
      <div className="mt-5 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </Card>
  );
}
