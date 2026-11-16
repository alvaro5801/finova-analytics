"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Inbox, Search, SearchX, X } from "lucide-react";
import { motionTokens } from "@/lib/tokens";

const control =
  "rounded-xl border border-line bg-sunken text-xs text-fg outline-none transition-colors duration-200 focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/25";

export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={clsx(control, "flex min-w-[12rem] flex-1 items-center gap-2 px-3 py-2", className)}>
      <Search size={14} className="shrink-0 text-muted" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none placeholder:text-faint"
      />
    </label>
  );
}

export function SelectField({
  value,
  onChange,
  label,
  allLabel,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  allLabel: string;
  options: string[];
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(control, "max-w-full py-2 ps-3 pe-8 focus:border-primary/70 focus:ring-2 focus:ring-primary/25")}
    >
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function ToggleChip({
  pressed,
  onChange,
  children,
}: {
  pressed: boolean;
  onChange: (pressed: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onChange(!pressed)}
      className={clsx(
        "fn-press rounded-xl border px-3 py-2 text-xs font-semibold transition-colors duration-200",
        pressed
          ? "border-line-strong bg-white/[0.08] text-fg"
          : "border-line bg-sunken text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

export function ClearFiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-fg"
    >
      <X size={14} aria-hidden="true" /> Limpar filtros
    </button>
  );
}

export interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

/**
 * Linha de filtros ativos, abaixo da barra de controles (que nunca muda de tamanho).
 * Só aparece com filtro aplicado, abrindo com animação de altura em vez de empurrar a barra.
 * Cada filtro vira um chip removível; "Limpar tudo" e a contagem ficam no fim da linha.
 */
export function ActiveFilters({
  filters,
  onClearAll,
  count,
  total,
  noun,
}: {
  filters: ActiveFilter[];
  onClearAll: () => void;
  count: number;
  total: number;
  /** Plural do que está sendo contado ("transações", "pessoas"…). */
  noun: string;
}) {
  const reduceMotion = useReducedMotion();
  const summary = `${count} de ${total} ${noun}`;

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {filters.length ? summary : ""}
      </p>
      <AnimatePresence initial={false}>
        {filters.length > 0 && (
          <motion.div
            key="active-filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : motionTokens.fast, ease: motionTokens.ease }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-2 pb-1 pt-3 text-xs">
              <span className="text-muted">Filtros:</span>
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={filter.onRemove}
                  aria-label={`Remover filtro: ${filter.label}`}
                  className="fn-press inline-flex items-center gap-1 rounded-full border border-line-strong bg-white/[0.05] py-1 pe-1.5 ps-2.5 font-medium text-fg transition-colors duration-200 hover:border-danger/40 hover:bg-danger/10"
                >
                  {filter.label}
                  <X size={12} aria-hidden="true" className="text-muted" />
                </button>
              ))}
              <button
                type="button"
                onClick={onClearAll}
                className="rounded-lg px-2 py-1 font-semibold text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-fg"
              >
                Limpar tudo
              </button>
              <span className="ms-auto text-muted tabular-nums" aria-hidden="true">
                {summary}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function EmptyResults({ message, onClear }: { message: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <SearchX size={22} className="text-faint" aria-hidden="true" />
      <p className="text-sm text-muted">{message}</p>
      <ClearFiltersButton onClick={onClear} />
    </div>
  );
}

/** Lista sem nenhum dado ainda (diferente de "nenhum resultado para os filtros"). */
export function EmptyData({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <Inbox size={22} className="text-faint" aria-hidden="true" />
      <p className="text-sm font-medium text-fg">{title}</p>
      <p className="max-w-sm text-xs text-muted">{hint}</p>
    </div>
  );
}
