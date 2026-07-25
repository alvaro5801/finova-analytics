"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AuthorData } from "@/types/dashboard";

export function AuthorsTable({ authors }: { authors: AuthorData[] }) {
  return (
    <Card>
      <p className="mb-4 text-sm font-semibold text-slate-700">Authors table</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 font-semibold">Author</th>
              <th className="pb-2 font-semibold">Function</th>
              <th className="pb-2 font-semibold">Status</th>
              <th className="pb-2 font-semibold">Employed</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author, i) => (
              <motion.tr
                key={author.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="border-t border-slate-100"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grad-${author.avatarColor} flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white`}
                    >
                      {author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div>
                      <p className="font-medium text-slate-600">{author.name}</p>
                      <p className="text-xs text-slate-400">{author.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <p className="font-medium text-slate-600">{author.function}</p>
                  <p className="text-xs text-slate-400">{author.department}</p>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      author.status === "online"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        author.status === "online" ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {author.status === "online" ? "Online" : "Offline"}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-500">{author.employed}</td>
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
      <Skeleton className="h-4 w-32" />
      <div className="mt-5 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </Card>
  );
}
