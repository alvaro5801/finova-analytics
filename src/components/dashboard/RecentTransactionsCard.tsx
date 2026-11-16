"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { SegmentedControl, type SegmentOption } from "@/components/ui/SegmentedControl";
import {
  ActiveFilters,
  EmptyResults,
  type ActiveFilter,
  SearchField,
  SelectField,
} from "@/components/ui/Filters";
import { Skeleton } from "@/components/ui/Skeleton";
import { filterTransactions, uniqueSorted, type TransactionFilters, type TransactionType } from "@/lib/filters";
import { formatBRL, formatDateTime, formatSignedBRL } from "@/lib/format";
import { renderIcon } from "@/lib/icon-map";
import { motionTokens } from "@/lib/tokens";
import { toneChip } from "@/lib/tones";
import type { OrderEventData } from "@/types/dashboard";

const TYPES: SegmentOption<TransactionType>[] = [
  { value: "all", label: "Todas" },
  { value: "in", label: "Entradas" },
  { value: "out", label: "Saídas" },
];

const NO_FILTERS: TransactionFilters = { type: "all", query: "", category: "" };

export function RecentTransactionsCard({ orders }: { orders: OrderEventData[] }) {
  const [filters, setFilters] = useState(NO_FILTERS);
  const categories = useMemo(() => uniqueSorted(orders.map((o) => o.description)), [orders]);
  const filtered = useMemo(() => filterTransactions(orders, filters), [orders, filters]);
  const pagination = usePagination(filtered);

  // Os totais acompanham o filtro: "quanto saiu com Pessoal" vira leitura direta.
  const inflow = filtered.filter((o) => o.amountCents > 0).reduce((sum, o) => sum + o.amountCents, 0);
  const outflow = filtered.filter((o) => o.amountCents < 0).reduce((sum, o) => sum - o.amountCents, 0);

  const update = (patch: Partial<TransactionFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    pagination.setPage(1);
  };
  const clear = () => update(NO_FILTERS);
  const activeFilters: ActiveFilter[] = [
    ...(filters.type !== "all"
      ? [{ key: "type", label: filters.type === "in" ? "Entradas" : "Saídas", onRemove: () => update({ type: "all" }) }]
      : []),
    ...(filters.category
      ? [{ key: "category", label: `Categoria: ${filters.category}`, onRemove: () => update({ category: "" }) }]
      : []),
    ...(filters.query.trim()
      ? [{ key: "query", label: `Busca: “${filters.query.trim()}”`, onRemove: () => update({ query: "" }) }]
      : []),
  ];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Transações recentes" />
      <div className="mt-3 flex flex-col gap-2">
        <SearchField
          label="Buscar transações"
          placeholder="Buscar por descrição ou categoria"
          value={filters.query}
          onChange={(query) => update({ query })}
        />
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            label="Tipo de transação"
            options={TYPES}
            value={filters.type}
            onChange={(type) => update({ type })}
          />
          <SelectField
            label="Categoria"
            allLabel="Todas as categorias"
            options={categories}
            value={filters.category}
            onChange={(category) => update({ category })}
          />
        </div>
      </div>
      <ActiveFilters
        filters={activeFilters}
        onClearAll={clear}
        count={filtered.length}
        total={orders.length}
        noun="transações"
      />

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

      {filtered.length === 0 && <EmptyResults message="Nenhuma transação encontrada." onClear={clear} />}
      <ol className="mt-4 flex flex-col divide-y divide-line">
        {pagination.items.map((order, i) => {
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
      <Pagination
        {...pagination}
        onPageChange={pagination.setPage}
        label="Paginação das transações recentes"
        className="mt-auto"
      />
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
