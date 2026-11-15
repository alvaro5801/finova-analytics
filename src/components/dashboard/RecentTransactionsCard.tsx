"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatBRL, formatDateTime, formatSignedBRL } from "@/lib/format";
import { renderIcon } from "@/lib/icon-map";
import { motionTokens } from "@/lib/tokens";
import { toneChip } from "@/lib/tones";
import type { OrderEventData } from "@/types/dashboard";

export function RecentTransactionsCard({ orders }: { orders: OrderEventData[] }) {
  const inflow = orders.filter((o) => o.amountCents > 0).reduce((sum, o) => sum + o.amountCents, 0);
  const outflow = orders.filter((o) => o.amountCents < 0).reduce((sum, o) => sum - o.amountCents, 0);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Transações recentes" />
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="fn-well rounded-lg px-3 py-2">
          <p className="text-muted">Entradas</p>
          <p className="mt-0.5 font-semibold text-success tabular-nums">{formatBRL(inflow)}</p>
        </div>
        <div className="fn-well rounded-lg px-3 py-2">
          <p className="text-muted">Saídas</p>
          <p className="mt-0.5 font-semibold text-fg tabular-nums">{formatBRL(outflow)}</p>
        </div>
      </div>

      <ol className="mt-4 flex flex-col divide-y divide-line">
        {orders.map((order, i) => {
          const incoming = order.amountCents > 0;
          return (
            <motion.li
              key={order.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionTokens.base, delay: i * 0.05, ease: motionTokens.ease }}
              className="flex items-center gap-3 py-3"
            >
              <span
                className={clsx(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
                  toneChip[order.color] ?? toneChip.dark,
                )}
              >
                {renderIcon(order.icon, { size: 16 })}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{order.title}</p>
                <p className="truncate text-xs text-muted">
                  {order.description} · {formatDateTime(order.date)}
                </p>
              </div>
              <span
                className={clsx(
                  "shrink-0 text-sm font-semibold tabular-nums",
                  incoming ? "text-success" : "text-fg",
                )}
              >
                {formatSignedBRL(order.amountCents)}
              </span>
            </motion.li>
          );
        })}
      </ol>
    </Card>
  );
}

export function RecentTransactionsSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton className="h-4 w-40" />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
      <div className="mt-5 space-y-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-2.5 w-24" />
            </div>
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>
    </Card>
  );
}
