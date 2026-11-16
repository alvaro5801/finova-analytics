"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { SegmentedControl, type SegmentOption } from "@/components/ui/SegmentedControl";
import { ActiveFilters, EmptyResults, SearchField, ToggleChip, type ActiveFilter } from "@/components/ui/Filters";
import { filterBudgets, type BudgetFilters } from "@/lib/filters";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatBRL } from "@/lib/format";
import { renderIcon } from "@/lib/icon-map";
import { motionTokens } from "@/lib/tokens";
import type { ProjectData } from "@/types/dashboard";

const STATUS: Record<ProjectData["status"], { label: string; chip: string; bar: string }> = {
  working: { label: "Em execução", chip: "text-accent", bar: "grad-brand" },
  done: { label: "Concluído", chip: "text-success", bar: "bg-success" },
  cancelled: { label: "Cancelado", chip: "text-muted", bar: "bg-faint" },
};

function Owners({ members }: { members: string }) {
  const initials = members.split(",");
  return (
    <div className="flex -space-x-2 rtl:space-x-reverse">
      {initials.map((initial, i) => (
        <span
          key={initial + i}
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-primary/25 text-[10px] font-semibold text-fg"
        >
          {initial}
        </span>
      ))}
    </div>
  );
}

const STATUS_FILTERS: SegmentOption<BudgetFilters["status"]>[] = [
  { value: "all", label: "Todos" },
  { value: "working", label: "Em execução" },
  { value: "done", label: "Concluídos" },
  { value: "cancelled", label: "Cancelados" },
];

const NO_FILTERS: BudgetFilters = { status: "all", query: "", noBudget: false };

/** `filterable`: a versão completa (Relatórios) tem filtros; a da visão geral fica compacta. */
export function BudgetsCard({ projects, filterable = false }: { projects: ProjectData[]; filterable?: boolean }) {
  const done = projects.filter((p) => p.status === "done").length;
  const working = projects.filter((p) => p.status === "working").length;
  const [filters, setFilters] = useState(NO_FILTERS);
  const filtered = useMemo(() => filterBudgets(projects, filters), [projects, filters]);
  const pagination = usePagination(filtered);

  const update = (patch: Partial<BudgetFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    pagination.setPage(1);
  };
  const clear = () => update(NO_FILTERS);
  const statusLabel = STATUS_FILTERS.find((s) => s.value === filters.status)?.label;
  const activeFilters: ActiveFilter[] = [
    ...(filters.status !== "all" && statusLabel
      ? [{ key: "status", label: statusLabel, onRemove: () => update({ status: "all" }) }]
      : []),
    ...(filters.noBudget ? [{ key: "noBudget", label: "Sem orçamento", onRemove: () => update({ noBudget: false }) }] : []),
    ...(filters.query.trim()
      ? [{ key: "query", label: `Busca: “${filters.query.trim()}”`, onRemove: () => update({ query: "" }) }]
      : []),
  ];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Orçamentos por área" subtitle={`${done} concluídos · ${working} em execução`} />

      {filterable && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SearchField
            label="Buscar áreas"
            placeholder="Buscar área"
            value={filters.query}
            onChange={(query) => update({ query })}
          />
          <SegmentedControl
            label="Status do orçamento"
            options={STATUS_FILTERS}
            value={filters.status}
            onChange={(status) => update({ status })}
          />
          <ToggleChip pressed={filters.noBudget} onChange={(noBudget) => update({ noBudget })}>
            Sem orçamento
          </ToggleChip>
        </div>
      )}
      {filterable && (
        <ActiveFilters
          filters={activeFilters}
          onClearAll={clear}
          count={filtered.length}
          total={projects.length}
          noun="áreas"
        />
      )}

      {/* Focável para quem rola pelo teclado quando a tabela não cabe (WCAG 2.1.1). */}
      {filtered.length === 0 ? (
        <EmptyResults message="Nenhuma área encontrada." onClear={clear} />
      ) : (
        <div
          className="-mx-6 mt-5 overflow-x-auto rounded-lg px-6"
          tabIndex={0}
          role="region"
          aria-label="Tabela de orçamentos por área"
        >
          <table className="w-full min-w-[560px] table-fixed border-collapse text-left text-sm">
            <colgroup>
              <col className="w-[42%]" />
              <col className="w-[18%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.08em] text-muted">
                <th scope="col" className="pb-3 font-medium">
                  Área
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Responsáveis
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Orçamento
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Execução
                </th>
              </tr>
            </thead>
            <tbody>
              {pagination.items.map((project, i) => {
                const status = STATUS[project.status] ?? STATUS.working;
                return (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: motionTokens.base, delay: i * 0.04, ease: motionTokens.ease }}
                    className="border-t border-line transition-colors duration-200 hover:bg-white/[0.02]"
                  >
                    <td className="py-3 pe-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-muted ring-1 ring-inset ring-line">
                          {renderIcon(project.icon, { size: 16 })}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-fg">{project.name}</p>
                          <p className={clsx("text-xs", status.chip)}>{status.label}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pe-4">
                      <Owners members={project.members} />
                    </td>
                    <td className="py-3 pe-4 font-medium tabular-nums">
                      {project.budgetCents === null ? (
                        <span className="text-muted">Não definido</span>
                      ) : (
                        <span className="text-fg">{formatBRL(project.budgetCents)}</span>
                      )}
                    </td>
                    <td className="py-3 pe-2">
                      <span className="text-xs font-semibold text-fg tabular-nums">{project.completion}%</span>
                      <div className="mt-1.5 h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.completion}%` }}
                          transition={{
                            duration: motionTokens.chartDrawMs / 1000,
                            delay: 0.15 + i * 0.04,
                            ease: motionTokens.ease,
                          }}
                          className={clsx("h-full rounded-full", status.bar)}
                        />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        {...pagination}
        onPageChange={pagination.setPage}
        label="Paginação dos orçamentos por área"
        className="mt-auto"
      />
    </Card>
  );
}

export function BudgetsSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-2 h-3 w-48" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </Card>
  );
}
