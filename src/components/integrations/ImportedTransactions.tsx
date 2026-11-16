"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { ClearFiltersButton, EmptyResults, FilterStatus, SearchField, SelectField } from "@/components/ui/Filters";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { SegmentedControl, type SegmentOption } from "@/components/ui/SegmentedControl";
import { filterBankTransactions, uniqueSorted, type BankTransactionFilters, type TransactionType } from "@/lib/filters";
import { formatBRL, formatDate, formatSignedBRL } from "@/lib/format";
import type { BankTransactionData } from "@/types/dashboard";

const TYPES: SegmentOption<TransactionType>[] = [
  { value: "all", label: "Todas" },
  { value: "in", label: "Entradas" },
  { value: "out", label: "Saídas" },
];

const NO_FILTERS: BankTransactionFilters = { query: "", type: "all", category: "", institution: "" };
const PAGE_SIZE = 10;

export function ImportedTransactions({ transactions }: { transactions: BankTransactionData[] }) {
  const [filters, setFilters] = useState(NO_FILTERS);
  const categories = useMemo(() => uniqueSorted(transactions.map((t) => t.category)), [transactions]);
  const institutions = useMemo(() => uniqueSorted(transactions.map((t) => t.institutionName)), [transactions]);
  const filtered = useMemo(() => filterBankTransactions(transactions, filters), [transactions, filters]);
  const pagination = usePagination(filtered, PAGE_SIZE);
  const active = filters.query !== "" || filters.type !== "all" || filters.category !== "" || filters.institution !== "";

  const inflow = filtered.filter((t) => t.amountCents > 0).reduce((sum, t) => sum + t.amountCents, 0);
  const outflow = filtered.filter((t) => t.amountCents < 0).reduce((sum, t) => sum - t.amountCents, 0);

  const update = (patch: Partial<BankTransactionFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    pagination.setPage(1);
  };
  const clear = () => update(NO_FILTERS);

  return (
    <Card>
      <CardHeader
        title="Transações importadas"
        subtitle={`${transactions.length} lançamentos vindos dos bancos conectados`}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SearchField
          label="Buscar transações importadas"
          placeholder="Buscar por descrição ou categoria"
          value={filters.query}
          onChange={(query) => update({ query })}
        />
        <SegmentedControl label="Tipo de transação" options={TYPES} value={filters.type} onChange={(type) => update({ type })} />
        <SelectField
          label="Categoria"
          allLabel="Todas as categorias"
          options={categories}
          value={filters.category}
          onChange={(category) => update({ category })}
        />
        {institutions.length > 1 && (
          <SelectField
            label="Banco"
            allLabel="Todos os bancos"
            options={institutions}
            value={filters.institution}
            onChange={(institution) => update({ institution })}
          />
        )}
        {active && <ClearFiltersButton onClick={clear} />}
        <FilterStatus count={filtered.length} total={transactions.length} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:max-w-md">
        <div className="fn-well rounded-lg px-3 py-2">
          <p className="text-muted">Entradas</p>
          <p className="mt-0.5 font-semibold text-success tabular-nums">{formatBRL(inflow)}</p>
        </div>
        <div className="fn-well rounded-lg px-3 py-2">
          <p className="text-muted">Saídas</p>
          <p className="mt-0.5 font-semibold text-fg tabular-nums">{formatBRL(outflow)}</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyResults message="Nenhuma transação encontrada." onClear={clear} />
      ) : (
        // Focável para quem rola pelo teclado quando a tabela não cabe (WCAG 2.1.1).
        <div
          className="-mx-6 mt-5 overflow-x-auto rounded-lg px-6"
          tabIndex={0}
          role="region"
          aria-label="Tabela de transações importadas"
        >
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.08em] text-muted">
                <th scope="col" className="pb-3 font-medium">Data</th>
                <th scope="col" className="pb-3 font-medium">Descrição</th>
                <th scope="col" className="pb-3 font-medium">Conta</th>
                <th scope="col" className="pb-3 text-end font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {pagination.items.map((t) => (
                <tr key={t.id} className="border-t border-line transition-colors duration-200 hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap py-3 pe-4 text-muted tabular-nums">{formatDate(t.date)}</td>
                  <td className="py-3 pe-4">
                    <p className="font-medium text-fg">{t.description}</p>
                    <p className="text-xs text-muted">{t.category}</p>
                  </td>
                  <td className="py-3 pe-4">
                    <p className="text-fg">{t.institutionName}</p>
                    <p className="text-xs text-muted">{t.accountName}</p>
                  </td>
                  <td
                    className={clsx(
                      "whitespace-nowrap py-3 text-end font-semibold tabular-nums",
                      t.amountCents > 0 ? "text-success" : "text-fg",
                    )}
                  >
                    {formatSignedBRL(t.amountCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination {...pagination} onPageChange={pagination.setPage} label="Paginação das transações importadas" />
    </Card>
  );
}
