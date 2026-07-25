"use client";

import { Reveal } from "@/components/ui/Reveal";
import { AuthorsTable, AuthorsTableSkeleton } from "@/components/tables/AuthorsTable";
import { ProjectsCard, ProjectsSkeleton } from "@/components/dashboard/ProjectsCard";
import { useGetAuthorsQuery, useGetProjectsQuery } from "@/store/api/dashboardApi";

export default function TablesPage() {
  const authors = useGetAuthorsQuery();
  const projects = useGetProjectsQuery();

  return (
    <div className="flex flex-col gap-6">
      {authors.isLoading && <AuthorsTableSkeleton />}
      {authors.isError && (
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-500">
          Couldn&apos;t load authors table.
        </div>
      )}
      {authors.data && (
        <Reveal>
          <AuthorsTable authors={authors.data} />
        </Reveal>
      )}

      {projects.isLoading && <ProjectsSkeleton />}
      {projects.isError && (
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-500">
          Couldn&apos;t load projects table.
        </div>
      )}
      {projects.data && (
        <Reveal delay={0.08}>
          <ProjectsCard projects={projects.data} />
        </Reveal>
      )}
    </div>
  );
}
