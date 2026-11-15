"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ErrorState } from "@/components/ui/ErrorState";
import { AuthorsTable, AuthorsTableSkeleton } from "@/components/tables/AuthorsTable";
import { BudgetsCard, BudgetsSkeleton } from "@/components/dashboard/BudgetsCard";
import { useGetAuthorsQuery, useGetProjectsQuery } from "@/store/api/dashboardApi";

export default function TablesPage() {
  const authors = useGetAuthorsQuery();
  const projects = useGetProjectsQuery();

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      {authors.isLoading && <AuthorsTableSkeleton />}
      {authors.isError && (
        <ErrorState message="Não foi possível carregar a equipe." onRetry={authors.refetch} />
      )}
      {authors.data && (
        <Reveal>
          <AuthorsTable authors={authors.data} />
        </Reveal>
      )}

      {projects.isLoading && <BudgetsSkeleton />}
      {projects.isError && (
        <ErrorState message="Não foi possível carregar os orçamentos." onRetry={projects.refetch} />
      )}
      {projects.data && (
        <Reveal delay={0.08}>
          <BudgetsCard projects={projects.data} />
        </Reveal>
      )}
    </div>
  );
}
