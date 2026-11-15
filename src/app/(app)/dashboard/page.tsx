"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/StatCard";
import { MonthSummaryCard, MonthSummarySkeleton } from "@/components/dashboard/MonthSummaryCard";
import { RevenueGoalCard, RevenueGoalSkeleton } from "@/components/dashboard/RevenueGoalCard";
import { FinancialHealthCard, FinancialHealthSkeleton } from "@/components/dashboard/FinancialHealthCard";
import { RevenueExpensesCard, RevenueExpensesSkeleton } from "@/components/dashboard/RevenueExpensesCard";
import { TransactionVolumeCard, TransactionVolumeSkeleton } from "@/components/dashboard/TransactionVolumeCard";
import { BudgetsCard, BudgetsSkeleton } from "@/components/dashboard/BudgetsCard";
import { RecentTransactionsCard, RecentTransactionsSkeleton } from "@/components/dashboard/RecentTransactionsCard";
import {
  useGetActiveUsersQuery,
  useGetOrdersQuery,
  useGetProjectsQuery,
  useGetReferralQuery,
  useGetSalesOverviewQuery,
  useGetSatisfactionQuery,
  useGetStatsQuery,
} from "@/store/api/dashboardApi";

/**
 * Cada widget lê o próprio hook RTK Query e trata loading/erro isoladamente:
 * uma falha de rota não derruba o resto do painel.
 */
export default function DashboardPage() {
  const stats = useGetStatsQuery();
  const sales = useGetSalesOverviewQuery();
  const transactions = useGetActiveUsersQuery();
  const goal = useGetSatisfactionQuery();
  const health = useGetReferralQuery();
  const budgets = useGetProjectsQuery();
  const orders = useGetOrdersQuery();

  const lastPeriod = sales.data?.at(-1)?.month;

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <section aria-label="Indicadores principais" className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 xl:grid-cols-4 lg:gap-5">
        {stats.isLoading && Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        {stats.isError && (
          <ErrorState
            className="col-span-full"
            message="Não foi possível carregar os indicadores."
            onRetry={stats.refetch}
          />
        )}
        {stats.data?.map((stat, i) => (
          <Reveal key={stat.id} delay={i * 0.06} className="h-full">
            <StatCard stat={stat} />
          </Reveal>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-[1.5fr_1fr_1.45fr]">
        <div className="md:col-span-2 xl:col-span-1 xl:h-[300px]">
          {stats.isLoading && <MonthSummarySkeleton />}
          {stats.isError && <ErrorState message="Não foi possível carregar o resumo." onRetry={stats.refetch} />}
          {stats.data && (
            <Reveal className="h-full" delay={0.05}>
              <MonthSummaryCard stats={stats.data} periodKey={lastPeriod} />
            </Reveal>
          )}
        </div>
        <div className="xl:h-[300px]">
          {goal.isLoading && <RevenueGoalSkeleton />}
          {goal.isError && <ErrorState message="Não foi possível carregar a meta." onRetry={goal.refetch} />}
          {goal.data && (
            <Reveal className="h-full" delay={0.1}>
              <RevenueGoalCard goal={goal.data} />
            </Reveal>
          )}
        </div>
        <div className="xl:h-[300px]">
          {health.isLoading && <FinancialHealthSkeleton />}
          {health.isError && (
            <ErrorState message="Não foi possível carregar a saúde financeira." onRetry={health.refetch} />
          )}
          {health.data && (
            <Reveal className="h-full" delay={0.15}>
              <FinancialHealthCard data={health.data} />
            </Reveal>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="h-[400px] sm:h-[420px] xl:h-[440px]">
          {sales.isLoading && <RevenueExpensesSkeleton />}
          {sales.isError && (
            <ErrorState message="Não foi possível carregar receita e despesas." onRetry={sales.refetch} />
          )}
          {sales.data && (
            <Reveal className="h-full">
              <RevenueExpensesCard points={sales.data} />
            </Reveal>
          )}
        </div>
        <div className="xl:h-[440px]">
          {transactions.isLoading && <TransactionVolumeSkeleton />}
          {transactions.isError && (
            <ErrorState message="Não foi possível carregar as transações." onRetry={transactions.refetch} />
          )}
          {transactions.data && (
            <Reveal className="h-full" delay={0.08}>
              <TransactionVolumeCard data={transactions.data} />
            </Reveal>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-5 xl:grid-cols-[1.45fr_1fr]">
        <div className="min-w-0">
          {budgets.isLoading && <BudgetsSkeleton />}
          {budgets.isError && (
            <ErrorState message="Não foi possível carregar os orçamentos." onRetry={budgets.refetch} />
          )}
          {budgets.data && (
            <Reveal className="h-full">
              <BudgetsCard projects={budgets.data} />
            </Reveal>
          )}
        </div>
        <div className="min-w-0">
          {orders.isLoading && <RecentTransactionsSkeleton />}
          {orders.isError && (
            <ErrorState message="Não foi possível carregar as transações recentes." onRetry={orders.refetch} />
          )}
          {orders.data && (
            <Reveal className="h-full" delay={0.08}>
              <RecentTransactionsCard orders={orders.data} />
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
