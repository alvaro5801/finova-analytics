"use client";

import { Reveal } from "@/components/ui/Reveal";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/StatCard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { SalesOverviewCard, SalesOverviewSkeleton } from "@/components/dashboard/SalesOverviewCard";
import { ActiveUsersCard, ActiveUsersSkeleton } from "@/components/dashboard/ActiveUsersCard";
import { SatisfactionCard, SatisfactionSkeleton } from "@/components/dashboard/SatisfactionCard";
import { ReferralCard, ReferralSkeleton } from "@/components/dashboard/ReferralCard";
import { ProjectsCard, ProjectsSkeleton } from "@/components/dashboard/ProjectsCard";
import { OrdersCard, OrdersSkeleton } from "@/components/dashboard/OrdersCard";
import {
  useGetActiveUsersQuery,
  useGetOrdersQuery,
  useGetProjectsQuery,
  useGetReferralQuery,
  useGetSalesOverviewQuery,
  useGetSatisfactionQuery,
  useGetStatsQuery,
} from "@/store/api/dashboardApi";

export default function DashboardPage() {
  const stats = useGetStatsQuery();
  const sales = useGetSalesOverviewQuery();
  const activeUsers = useGetActiveUsersQuery();
  const satisfaction = useGetSatisfactionQuery();
  const referral = useGetReferralQuery();
  const projects = useGetProjectsQuery();
  const orders = useGetOrdersQuery();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.isLoading &&
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        {stats.isError && (
          <div className="col-span-full rounded-2xl bg-rose-50 p-4 text-sm text-rose-500">
            Couldn&apos;t load stats. Please try again shortly.
          </div>
        )}
        {stats.data?.map((stat, i) => (
          <Reveal key={stat.id} delay={i * 0.06}>
            <StatCard stat={stat} />
          </Reveal>
        ))}
      </div>

      <div className="welcome-row grid grid-cols-1 gap-5">
        <div className="h-[320px]">
          <Reveal className="block h-full">
            <WelcomeCard />
          </Reveal>
        </div>
        <div className="h-[320px]">
          {satisfaction.isLoading && <SatisfactionSkeleton />}
          {satisfaction.isError && (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-500">
              Couldn&apos;t load satisfaction data.
            </div>
          )}
          {satisfaction.data && (
            <Reveal className="block h-full" delay={0.05}>
              <SatisfactionCard rate={satisfaction.data} />
            </Reveal>
          )}
        </div>
        <div className="h-[320px]">
          {referral.isLoading && <ReferralSkeleton />}
          {referral.isError && (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-500">
              Couldn&apos;t load referral data.
            </div>
          )}
          {referral.data && (
            <Reveal className="block h-full" delay={0.1}>
              <ReferralCard data={referral.data} />
            </Reveal>
          )}
        </div>
      </div>

      <div className="overview-row grid grid-cols-1 gap-5">
        <div className="h-[445px]">
          {sales.isLoading && <SalesOverviewSkeleton />}
          {sales.isError && (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-500">
              Couldn&apos;t load sales overview.
            </div>
          )}
          {sales.data && (
            <Reveal className="block h-full">
              <SalesOverviewCard points={sales.data} />
            </Reveal>
          )}
        </div>
        <div className="h-[445px]">
          {activeUsers.isLoading && <ActiveUsersSkeleton />}
          {activeUsers.isError && (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-500">
              Couldn&apos;t load active users.
            </div>
          )}
          {activeUsers.data && (
            <Reveal className="block h-full" delay={0.08}>
              <ActiveUsersCard data={activeUsers.data} />
            </Reveal>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="h-[500px] lg:col-span-2">
          {projects.isLoading && <ProjectsSkeleton />}
          {projects.isError && (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-500">
              Couldn&apos;t load projects.
            </div>
          )}
          {projects.data && (
            <Reveal className="block h-full">
              <ProjectsCard projects={projects.data} />
            </Reveal>
          )}
        </div>
        <div className="h-[500px] lg:col-span-1">
          {orders.isLoading && <OrdersSkeleton />}
          {orders.isError && (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-500">
              Couldn&apos;t load orders overview.
            </div>
          )}
          {orders.data && (
            <Reveal className="block h-full" delay={0.08}>
              <OrdersCard orders={orders.data} />
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
