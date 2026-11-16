"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SegmentedControl, type SegmentOption } from "@/components/ui/SegmentedControl";
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
  useGetBankSummaryQuery,
  useGetOrdersQuery,
  useGetProjectsQuery,
  useGetReferralQuery,
  useGetSalesOverviewQuery,
  useGetSatisfactionQuery,
  useGetStatsQuery,
} from "@/store/api/dashboardApi";

type DataSource = "bank" | "demo";

const SOURCES: SegmentOption<DataSource>[] = [
  { value: "bank", label: "Meus bancos" },
  { value: "demo", label: "Demonstração" },
];

/** Lista "A, B e C". */
const joinNames = (names: string[]) =>
  names.length <= 1 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} e ${names.at(-1)}`;

/**
 * Cada widget lê o próprio hook RTK Query e trata loading/erro isoladamente:
 * uma falha de rota não derruba o resto do painel.
 *
 * Com banco conectado, indicadores, resumo do mês, receita × despesas e transações recentes
 * passam a vir das transações importadas ("Meus bancos"). Meta, saúde financeira, volume e
 * orçamentos não existem no Open Finance e seguem com os dados de demonstração.
 */
export default function DashboardPage() {
  const stats = useGetStatsQuery();
  const sales = useGetSalesOverviewQuery();
  const transactions = useGetActiveUsersQuery();
  const goal = useGetSatisfactionQuery();
  const health = useGetReferralQuery();
  const budgets = useGetProjectsQuery();
  const orders = useGetOrdersQuery();
  const bank = useGetBankSummaryQuery();

  const [choice, setChoice] = useState<DataSource | null>(null);
  const hasBank = !!bank.data;
  const source: DataSource = choice ?? (hasBank ? "bank" : "demo");
  const useBank = source === "bank" && hasBank;
  // Até saber se há banco conectado, mostra esqueletos em vez de piscar a demonstração.
  const deciding = choice === null && bank.isLoading;

  const view = <T,>(demo: { data?: T; isLoading: boolean; isError: boolean; refetch: () => unknown }, fromBank?: T) =>
    deciding
      ? { data: undefined, isLoading: true, isError: false, refetch: demo.refetch }
      : useBank
        ? { data: fromBank, isLoading: false, isError: false, refetch: bank.refetch }
        : demo;
  const statsView = view(stats, bank.data?.stats);
  const salesView = view(sales, bank.data?.sales);
  const ordersView = view(orders, bank.data?.orders);

  const lastPeriod = useBank ? bank.data?.periodKey : sales.data?.at(-1)?.month;

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      {hasBank && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-3xl text-sm text-muted">
            {useBank ? (
              <>
                Indicadores, receita × despesas e transações calculados com{" "}
                <strong className="font-semibold text-fg">{bank.data!.transactionCount} transações</strong> de{" "}
                {joinNames(bank.data!.institutions)}. Meta, saúde financeira, volume e orçamentos seguem como
                demonstração.
              </>
            ) : (
              "Exibindo os dados de demonstração."
            )}
          </p>
          <SegmentedControl label="Fonte dos dados" options={SOURCES} value={source} onChange={setChoice} />
        </div>
      )}
      <section aria-label="Indicadores principais" className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 xl:grid-cols-4 lg:gap-5">
        {statsView.isLoading && Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        {statsView.isError && (
          <ErrorState
            className="col-span-full"
            message="Não foi possível carregar os indicadores."
            onRetry={statsView.refetch}
          />
        )}
        {statsView.data?.map((stat, i) => (
          <Reveal key={stat.id} delay={i * 0.06} className="h-full">
            <StatCard stat={stat} />
          </Reveal>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-[1.5fr_1fr_1.45fr]">
        <div className="md:col-span-2 xl:col-span-1 xl:h-[300px]">
          {statsView.isLoading && <MonthSummarySkeleton />}
          {statsView.isError && <ErrorState message="Não foi possível carregar o resumo." onRetry={statsView.refetch} />}
          {statsView.data && (
            <Reveal className="h-full" delay={0.05}>
              <MonthSummaryCard stats={statsView.data} periodKey={lastPeriod} />
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
          {salesView.isLoading && <RevenueExpensesSkeleton />}
          {salesView.isError && (
            <ErrorState message="Não foi possível carregar receita e despesas." onRetry={salesView.refetch} />
          )}
          {salesView.data && (
            <Reveal className="h-full">
              <RevenueExpensesCard points={salesView.data} />
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
          {ordersView.isLoading && <RecentTransactionsSkeleton />}
          {ordersView.isError && (
            <ErrorState message="Não foi possível carregar as transações recentes." onRetry={ordersView.refetch} />
          )}
          {ordersView.data && (
            <Reveal className="h-full" delay={0.08}>
              <RecentTransactionsCard key={source} orders={ordersView.data} />
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
