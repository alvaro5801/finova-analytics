"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { paginate } from "@/lib/pagination";

export const DEFAULT_PAGE_SIZE = 5;

export function usePagination<T>(items: readonly T[], pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  return { ...paginate(items, page, pageSize), setPage };
}

const pageButton =
  "fn-press flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold tabular-nums transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40";

export function Pagination({
  page,
  totalPages,
  total,
  from,
  to,
  onPageChange,
  label,
  className,
}: {
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  label: string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label={label}
      className={clsx("flex items-center justify-between gap-3 border-t border-line pt-4", className)}
    >
      <p className="text-xs text-muted tabular-nums" aria-live="polite">
        {from === to ? from : `${from}–${to}`} de {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Página anterior"
          className={clsx(pageButton, "text-muted hover:bg-white/[0.06] hover:text-fg")}
        >
          <ChevronLeft size={16} aria-hidden="true" className="rtl:-scale-x-100" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
          const active = n === page;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              aria-label={`Página ${n}`}
              aria-current={active ? "page" : undefined}
              className={clsx(
                pageButton,
                active
                  ? "bg-white/[0.08] text-fg ring-1 ring-inset ring-line-strong"
                  : "text-muted hover:bg-white/[0.06] hover:text-fg",
              )}
            >
              {n}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Próxima página"
          className={clsx(pageButton, "text-muted hover:bg-white/[0.06] hover:text-fg")}
        >
          <ChevronRight size={16} aria-hidden="true" className="rtl:-scale-x-100" />
        </button>
      </div>
    </nav>
  );
}
