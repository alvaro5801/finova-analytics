"use client";

import { useCallback, useState } from "react";
import { BadgeCheck, Building2, EyeOff, Lock, Plus, ShieldCheck, Trash2, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { Reveal } from "@/components/ui/Reveal";
import { Skeleton } from "@/components/ui/Skeleton";
import { ConnectBankDialog } from "@/components/integrations/ConnectBankDialog";
import { ConnectionCard } from "@/components/integrations/ConnectionCard";
import { ImportedTransactions } from "@/components/integrations/ImportedTransactions";
import { useGetBankTransactionsQuery, useGetIntegrationsQuery } from "@/store/api/dashboardApi";

const STEPS = [
  { icon: Building2, title: "Escolha o banco", text: "Bancos e cartões participantes do Open Finance." },
  { icon: Lock, title: "Autorize no banco", text: "O login acontece no app ou site do próprio banco." },
  { icon: Wallet, title: "Transações no Finova", text: "Contas, saldos e lançamentos importados e atualizados." },
];

const SAFEGUARDS = [
  { icon: EyeOff, text: "Sua senha fica no banco: o Finova não a vê nem a guarda." },
  { icon: ShieldCheck, text: "Acesso somente de leitura: o Finova não movimenta dinheiro." },
  { icon: BadgeCheck, text: "Consentimento com prazo de validade, renovado só com a sua autorização." },
  { icon: Trash2, text: "Desconectar revoga o acesso no banco e apaga os dados importados." },
];

export default function IntegrationsPage() {
  const integrations = useGetIntegrationsQuery();
  const transactions = useGetBankTransactionsQuery();
  const [connecting, setConnecting] = useState(false);
  const closeConnect = useCallback(() => setConnecting(false), []);

  const connections = integrations.data?.connections ?? [];
  const mode = integrations.data?.mode ?? "demo";

  const connectButton = (
    <button
      type="button"
      onClick={() => setConnecting(true)}
      aria-haspopup="dialog"
      className="fn-btn-primary inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold"
    >
      <Plus size={16} aria-hidden="true" /> Conectar banco
    </button>
  );

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <Reveal>
        <Card>
          <CardHeader
            title="Integrações bancárias"
            subtitle="Conecte seus bancos pelo Open Finance e acompanhe as transações no Finova."
            action={connectButton}
          />
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-success">
              <ShieldCheck size={13} aria-hidden="true" /> Somente leitura
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-accent">
              {mode === "demo" ? "Modo demonstração · bancos fictícios" : "Conectado à Pluggy"}
            </span>
          </div>
        </Card>
      </Reveal>

      {integrations.isError && (
        <ErrorState message="Não foi possível carregar as integrações." onRetry={integrations.refetch} />
      )}

      {integrations.isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      )}

      {integrations.data && connections.length === 0 && (
        <Reveal delay={0.06}>
          <Card>
            <CardHeader title="Nenhum banco conectado" subtitle="Em três passos, suas transações aparecem aqui." />
            <ol className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title} className="fn-well flex gap-3 rounded-xl p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary-light">
                    <step.icon size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-fg">
                      {i + 1}. {step.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </Reveal>
      )}

      {connections.length > 0 && (
        <section aria-labelledby="connected-banks" className="flex flex-col gap-3">
          <h2 id="connected-banks" className="text-sm font-semibold text-fg">
            Bancos conectados <span className="font-normal text-muted">· {connections.length}</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 lg:gap-5">
            {connections.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        </section>
      )}

      {connections.length > 0 && transactions.data && (
        <Reveal delay={0.08}>
          <ImportedTransactions transactions={transactions.data} />
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <Card>
          <CardHeader title="Como protegemos seus dados" subtitle="Integração via agregador autorizado de Open Finance." />
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SAFEGUARDS.map((item) => (
              <li key={item.text} className="flex items-start gap-3 text-sm text-muted">
                <item.icon size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                {item.text}
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>

      <ConnectBankDialog open={connecting} mode={mode} sandbox={integrations.data?.sandbox ?? false} onClose={closeConnect} />
    </div>
  );
}
