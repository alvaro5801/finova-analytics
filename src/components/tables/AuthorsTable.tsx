"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { motionTokens } from "@/lib/tokens";
import type { AuthorData } from "@/types/dashboard";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}

export function AuthorsTable({ authors }: { authors: AuthorData[] }) {
  const online = authors.filter((a) => a.status === "online").length;

  return (
    <Card>
      <CardHeader title="Equipe financeira" subtitle={`${authors.length} pessoas · ${online} online agora`} />
      {/* Focável para quem rola pelo teclado quando a tabela não cabe (WCAG 2.1.1). */}
      <div
        className="-mx-6 mt-5 overflow-x-auto rounded-lg px-6"
        tabIndex={0}
        role="region"
        aria-label="Tabela da equipe financeira"
      >
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.08em] text-muted">
              <th scope="col" className="pb-3 font-medium">Pessoa</th>
              <th scope="col" className="pb-3 font-medium">Cargo</th>
              <th scope="col" className="pb-3 font-medium">Status</th>
              <th scope="col" className="pb-3 font-medium">Admissão</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author, i) => (
              <motion.tr
                key={author.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: motionTokens.base, delay: i * 0.04, ease: motionTokens.ease }}
                className="border-t border-line transition-colors duration-200 hover:bg-white/[0.02]"
              >
                <td className="py-3 pe-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grad-${author.avatarColor} flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white`}
                    >
                      {initials(author.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-fg">{author.name}</p>
                      <p className="truncate text-xs text-muted">{author.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pe-4">
                  <p className="font-medium text-fg">{author.function}</p>
                  <p className="text-xs text-muted">{author.department}</p>
                </td>
                <td className="py-3 pe-4">
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                      author.status === "online" ? "bg-success/10 text-success" : "bg-white/[0.05] text-muted",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "h-1.5 w-1.5 rounded-full",
                        author.status === "online" ? "bg-success" : "bg-faint",
                      )}
                    />
                    {author.status === "online" ? "Online" : "Ausente"}
                  </span>
                </td>
                <td className="py-3 pe-4 text-muted tabular-nums">{author.employed}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function AuthorsTableSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-2 h-3 w-44" />
      <div className="mt-5 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </Card>
  );
}
