"use client";

import { useState } from "react";
import clsx from "clsx";
import { CircleAlert, CircleCheck, CreditCard, Landmark, Loader2, RefreshCw, RotateCcw, Unplug } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { InstitutionBadge } from "@/components/integrations/ConnectBankDialog";
import { formatBRL, formatDate, formatRelative } from "@/lib/format";
import { useDeleteBankConnectionMutation, useSyncBankConnectionMutation } from "@/store/api/dashboardApi";
import type { BankConnectionData, BankConnectionStatus } from "@/types/dashboard";

const STATUS: Record<BankConnectionStatus, { label: string; chip: string; icon: typeof CircleCheck }> = {
  connected: { label: "Conectado", chip: "bg-success/10 text-success", icon: CircleCheck },
  syncing: { label: "Sincronizando", chip: "bg-accent/10 text-accent", icon: Loader2 },
  error: { label: "Erro na sincronização", chip: "bg-danger/10 text-danger", icon: CircleAlert },
  reconnect: { label: "Precisa reconectar", chip: "bg-warning/10 text-warning", icon: RotateCcw },
};

const actionButton =
  "fn-press inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-semibold transition-colors duration-200 disabled:opacity-60";

export function ConnectionCard({ connection }: { connection: BankConnectionData }) {
  const [sync, syncState] = useSyncBankConnectionMutation();
  const [remove, removeState] = useDeleteBankConnectionMutation();
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");

  const status = STATUS[syncState.isLoading ? "syncing" : connection.status];
  const StatusIcon = status.icon;
  const transactionCount = connection.accounts.reduce((sum, a) => sum + a.transactionCount, 0);

  const runSync = async () => {
    try {
      const result = await sync(connection.id).unwrap();
      setMessage(`${connection.institutionName} sincronizado: ${result.imported} transações recentes conferidas.`);
    } catch {
      setMessage(`A sincronização de ${connection.institutionName} falhou. Tente novamente.`);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start gap-3">
        <InstitutionBadge
          name={connection.institutionName}
          color={connection.institutionColor}
          imageUrl={connection.institutionImageUrl}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-fg">{connection.institutionName}</h3>
          <p className="mt-0.5 text-xs text-muted">
            {connection.lastSyncAt ? `Sincronizado ${formatRelative(connection.lastSyncAt)}` : "Ainda não sincronizado"}
          </p>
        </div>
        <span className={clsx("inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", status.chip)}>
          <StatusIcon size={13} aria-hidden="true" className={clsx(status.icon === Loader2 && "animate-spin")} />
          {status.label}
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {connection.accounts.map((account) => (
          <li key={account.id} className="fn-well flex items-center gap-3 rounded-xl px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-muted">
              {account.type === "CREDIT" ? <CreditCard size={15} aria-hidden="true" /> : <Landmark size={15} aria-hidden="true" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg">{account.name}</p>
              <p className="text-xs text-muted">
                <span className="tabular-nums">{account.number}</span> · {account.transactionCount} transações
              </p>
            </div>
            <div className="text-end">
              <p className="text-xs text-muted">{account.type === "CREDIT" ? "Fatura atual" : "Saldo"}</p>
              <p className="text-sm font-semibold text-fg tabular-nums">{formatBRL(account.balanceCents)}</p>
            </div>
          </li>
        ))}
      </ul>

      {connection.consentExpiresAt && (
        <p className="mt-3 text-xs text-muted">Consentimento válido até {formatDate(connection.consentExpiresAt)}.</p>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <button
          type="button"
          onClick={runSync}
          disabled={syncState.isLoading}
          className={clsx(actionButton, "text-fg hover:bg-white/[0.06]")}
        >
          <RefreshCw size={14} aria-hidden="true" className={clsx(syncState.isLoading && "animate-spin")} />
          {syncState.isLoading ? "Sincronizando…" : "Sincronizar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={removeState.isLoading}
          aria-haspopup="dialog"
          className={clsx(actionButton, "text-muted hover:border-danger/40 hover:bg-danger/10 hover:text-danger")}
        >
          <Unplug size={14} aria-hidden="true" /> Desconectar
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>

      <ConfirmDialog
        open={confirming}
        title={`Desconectar ${connection.institutionName}?`}
        description={`O Finova revoga o acesso no banco e apaga as ${transactionCount} transações importadas. Você pode conectar de novo quando quiser.`}
        confirmLabel="Desconectar"
        onClose={() => setConfirming(false)}
        onConfirm={() => remove(connection.id)}
      />
    </Card>
  );
}
