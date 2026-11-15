"use client";

import clsx from "clsx";
import { Search, SearchX, X } from "lucide-react";

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

/** Anuncia ao leitor de tela quantos itens sobraram depois de filtrar. */
export function FilterStatus({ count, total }: { count: number; total: number }) {
  return (
    <p className="sr-only" aria-live="polite">
      {count === total ? "" : `${count} de ${total} resultados`}
    </p>
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
