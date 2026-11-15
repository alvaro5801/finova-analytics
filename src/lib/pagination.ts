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
