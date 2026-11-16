export interface PageSlice<T> {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  /** Posição (base 1) do primeiro item exibido; 0 quando a lista está vazia. */
  from: number;
  to: number;
}

/** Recorta uma página da lista; páginas fora do intervalo caem no limite mais próximo. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): PageSlice<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const start = (current - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);

  return {
    items: slice,
    page: current,
    totalPages,
    total,
    from: total ? start + 1 : 0,
    to: start + slice.length,
  };
}

/**
 * Páginas a exibir na navegação: todas até 7; acima disso, primeira, última, a atual
 * e suas vizinhas, com "…" nos saltos (1 … 9 10 11 … 19).
 */
export function pageWindow(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const shown = new Set([1, totalPages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => shown.add(n));
  if (page >= totalPages - 2) [totalPages - 3, totalPages - 2, totalPages - 1].forEach((n) => shown.add(n));

  const sorted = [...shown].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? (["…", n] as const) : [n]));
}
