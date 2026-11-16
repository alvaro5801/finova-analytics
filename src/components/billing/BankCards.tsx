"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Landmark } from "lucide-react";
import { CreditCard } from "@/components/billing/CreditCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatBRL, formatDate } from "@/lib/format";
import { useGetIntegrationsQuery } from "@/store/api/dashboardApi";
import type { BankAccountData } from "@/types/dashboard";

const DAY = 86_400_000;
/** A partir de quantos dias para o vencimento a data ganha destaque. */
const DUE_SOON_DAYS = 5;

type BankCard = BankAccountData & { institutionName: string };

function dayMonth(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });
}

function CardDetails({ card, now }: { card: BankCard; now: number }) {
  const limit = card.creditLimitCents ?? 0;
  const used = limit - (card.availableLimitCents ?? limit);
  const usage = limit > 0 ? Math.min(used / limit, 1) : 0;
  const daysToDue = card.billDueDate ? Math.ceil((new Date(card.billDueDate).getTime() - now) / DAY) : null;
  const dueSoon = daysToDue !== null && daysToDue >= 0 && daysToDue <= DUE_SOON_DAYS;

  return (
    <div className="mt-3 space-y-3 px-1">
      {limit > 0 && (
        <div>
          <p className="flex justify-between text-xs text-muted">
            <span>Limite usado</span>
            <span className="tabular-nums">
              {formatBRL(used)} de {formatBRL(limit)}
            </span>
          </p>
          <div
            role="img"
            aria-label={`${Math.round(usage * 100)}% do limite usado`}
            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
          >
            <div
              className={clsx("h-full rounded-full", usage > 0.8 ? "bg-warning" : "bg-primary")}
              style={{ width: `${usage * 100}%` }}
            />
          </div>
        </div>
      )}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <dt className="text-muted">Fatura atual</dt>
          <dd className="font-semibold text-fg tabular-nums">{formatBRL(card.balanceCents)}</dd>
        </div>
        {card.minimumPaymentCents !== null && (
          <div>
            <dt className="text-muted">Pagamento mínimo</dt>
            <dd className="font-semibold text-fg tabular-nums">{formatBRL(card.minimumPaymentCents)}</dd>
          </div>
        )}
        {card.billCloseDate && (
          <div>
            <dt className="text-muted">Fecha em</dt>
            <dd className="text-fg">{formatDate(card.billCloseDate)}</dd>
          </div>
        )}
        {card.billDueDate && (
          <div>
            <dt className="text-muted">Vence em</dt>
            <dd className={clsx("font-semibold", dueSoon ? "text-warning" : "text-fg")}>
              {formatDate(card.billDueDate)}
              {dueSoon && ` · ${daysToDue === 0 ? "hoje" : `em ${daysToDue} ${daysToDue === 1 ? "dia" : "dias"}`}`}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

/** Cartões de crédito das contas conectadas em Integrações (somente leitura). */
export function BankCards() {
  const integrations = useGetIntegrationsQuery();
  // Capturado uma vez: a contagem "vence em N dias" não precisa mudar a cada renderização.
  const [now] = useState(() => Date.now());
  const cards: BankCard[] = (integrations.data?.connections ?? []).flatMap((c) =>
    c.accounts.filter((a) => a.type === "CREDIT").map((a) => ({ ...a, institutionName: c.institutionName })),
  );

  return (
    <section aria-labelledby="bank-cards-title" className="mt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="bank-cards-title" className="text-sm font-semibold text-fg">
          Do seu banco
        </h3>
        <span className="text-xs text-muted">Open Finance · somente leitura</span>
      </div>

      {integrations.isLoading && <Skeleton className="mt-3 h-44 rounded-2xl" />}

      {integrations.data && cards.length === 0 && (
        <div className="mt-3 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line-strong px-5 py-6 text-center">
          <Landmark size={20} className="text-muted" aria-hidden="true" />
          <p className="text-sm font-medium text-fg">Traga os cartões de crédito do seu banco</p>
          <p className="text-xs text-muted">Limite, fatura e vencimento atualizados pelo Open Finance.</p>
          <Link
            href="/integrations"
            className="mt-1 rounded-xl border border-line px-3 py-1.5 text-xs font-semibold text-fg transition-colors duration-200 hover:border-primary/50 hover:bg-primary/10"
          >
            Conectar banco
          </Link>
        </div>
      )}

      {cards.length > 0 && (
        <ul className="mt-3 flex flex-col gap-5">
          {cards.map((card) => (
            <li key={card.id}>
              <CreditCard
                brand={card.name}
                number={`•••• •••• •••• ${card.number.replace(/\D/g, "")}`}
                holder={card.institutionName}
                meta={card.billDueDate ? `Vence ${dayMonth(card.billDueDate)}` : undefined}
                tag="Importado"
                primary={false}
                imported
              />
              <CardDetails card={card} now={now} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
