"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Check, CheckCircle2, ChevronRight, Loader2, Lock, ShieldCheck, TriangleAlert } from "lucide-react";
import { SearchField } from "@/components/ui/Filters";
import { Modal, ModalActions, primaryButton, secondaryButton } from "@/components/ui/Modal";
import { matchesQuery } from "@/lib/filters";
import {
  useAuthorizeDemoBankMutation,
  useCreateBankConnectionMutation,
  useCreateConnectTokenMutation,
  useGetBankInstitutionsQuery,
} from "@/store/api/dashboardApi";
import type { BankInstitutionData, BankingMode, ConnectResultData } from "@/types/dashboard";

type Step =
  | { name: "choose" }
  | { name: "consent"; institution: BankInstitutionData; connectToken: string }
  | { name: "importing"; institution: BankInstitutionData }
  | { name: "done"; result: ConnectResultData }
  | { name: "error"; message: string };

const SHARED_DATA = ["Dados das contas e saldos", "Transações dos últimos 12 meses", "Cartão de crédito e faturas"];

export function InstitutionBadge({ name, color, size = "md" }: { name: string; color: string; size?: "md" | "lg" }) {
  const initials = name
    .split(" ")
    .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={
        size === "lg"
          ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-canvas"
          : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-canvas"
      }
      style={{ backgroundColor: `#${color}` }}
    >
      {initials}
    </span>
  );
}

function errorMessage(error: unknown) {
  const data = (error as { data?: { error?: { message?: string } } } | undefined)?.data;
  return data?.error?.message ?? "Não foi possível conectar o banco. Tente novamente.";
}

// O widget acessa `window` ao carregar: só existe no navegador.
const PluggyConnect = dynamic(() => import("react-pluggy-connect").then((m) => m.PluggyConnect), { ssr: false });

function ImportingView({ institutionName }: { institutionName?: string }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center" role="status" aria-live="polite">
      <Loader2 size={28} className="animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-fg">
        Importando contas e transações{institutionName ? ` de ${institutionName}` : ""}…
      </p>
      <p className="text-xs text-muted">Logo após a autorização, o banco ainda está enviando os dados.</p>
    </div>
  );
}

function DoneView({ result, onClose }: { result: ConnectResultData; onClose: () => void }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 text-center" role="status" aria-live="polite">
      <CheckCircle2 size={32} className="text-success" aria-hidden="true" />
      <p className="text-base font-semibold text-fg">{result.institutionName} conectado</p>
      <p className="text-sm text-muted">
        {result.accounts} contas e {result.imported} transações importadas.
      </p>
      <button type="button" onClick={onClose} className={`${primaryButton} mt-2`}>
        Ver transações
      </button>
    </div>
  );
}

function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 text-center" role="alert">
      <TriangleAlert size={28} className="text-warning" aria-hidden="true" />
      <p className="text-sm text-fg">{message}</p>
      <button type="button" onClick={onRetry} className={`${secondaryButton} mt-2`}>
        Tentar de novo
      </button>
    </div>
  );
}

function ConnectFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>({ name: "choose" });
  const [query, setQuery] = useState("");
  const institutions = useGetBankInstitutionsQuery();
  const [createToken, tokenState] = useCreateConnectTokenMutation();
  const [authorize] = useAuthorizeDemoBankMutation();
  const [connect] = useCreateBankConnectionMutation();

  const visible = useMemo(
    () => (institutions.data ?? []).filter((i) => matchesQuery([i.name], query)),
    [institutions.data, query],
  );

  const choose = async (institution: BankInstitutionData) => {
    try {
      const { connectToken } = await createToken().unwrap();
      setStep({ name: "consent", institution, connectToken });
    } catch (error) {
      setStep({ name: "error", message: errorMessage(error) });
    }
  };

  const approve = async (institution: BankInstitutionData, connectToken: string) => {
    setStep({ name: "importing", institution });
    try {
      // No modo Pluggy, este itemId chega pelo onSuccess do widget oficial.
      const { itemId } = await authorize({ connectToken, institutionId: institution.id }).unwrap();
      const result = await connect({ itemId }).unwrap();
      setStep({ name: "done", result });
    } catch (error) {
      setStep({ name: "error", message: errorMessage(error) });
    }
  };

  if (step.name === "consent") {
    const { institution, connectToken } = step;
    return (
      <div className="mt-5">
        <div className="overflow-hidden rounded-xl border border-line">
          <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: `#${institution.color}` }}>
            <Lock size={15} className="text-canvas" aria-hidden="true" />
            <p className="text-sm font-semibold text-canvas">{institution.name} · ambiente seguro do banco (simulado)</p>
          </div>
          <div className="space-y-3 p-4 text-sm">
            <p className="text-fg">
              O <strong>Finova Analytics</strong> pede acesso <strong>somente de leitura</strong> a:
            </p>
            <ul className="space-y-1.5">
              {SHARED_DATA.map((item) => (
                <li key={item} className="flex items-center gap-2 text-muted">
                  <Check size={15} className="shrink-0 text-success" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted">Validade de 12 meses · você pode revogar quando quiser.</p>
            <p className="flex items-start gap-2 rounded-lg bg-white/[0.04] p-3 text-xs text-muted">
              <ShieldCheck size={15} className="mt-px shrink-0 text-primary" aria-hidden="true" />
              Sua senha fica no banco. O Finova não a vê e não consegue movimentar dinheiro.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <ModalActions>
            <button type="button" onClick={() => setStep({ name: "choose" })} className={secondaryButton}>
              Voltar
            </button>
            <button type="button" onClick={() => approve(institution, connectToken)} className={primaryButton}>
              Autorizar compartilhamento
            </button>
          </ModalActions>
        </div>
      </div>
    );
  }

  if (step.name === "importing") return <ImportingView institutionName={step.institution.name} />;
  if (step.name === "done") return <DoneView result={step.result} onClose={onClose} />;
  if (step.name === "error") return <ErrorView message={step.message} onRetry={() => setStep({ name: "choose" })} />;

  return (
    <div className="mt-5">
      <SearchField label="Buscar banco" placeholder="Buscar banco" value={query} onChange={setQuery} />
      <ul aria-label="Instituições disponíveis" className="mt-3 max-h-72 space-y-1 overflow-y-auto">
        {institutions.isLoading && <li className="py-6 text-center text-sm text-muted">Carregando bancos…</li>}
        {visible.map((institution) => (
          <li key={institution.id}>
            <button
              type="button"
              onClick={() => choose(institution)}
              disabled={tokenState.isLoading}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors duration-200 hover:bg-white/[0.05] disabled:opacity-60"
            >
              <InstitutionBadge name={institution.name} color={institution.color} />
              <span className="flex-1 text-sm font-medium text-fg">{institution.name}</span>
              <ChevronRight size={16} className="text-muted rtl:-scale-x-100" aria-hidden="true" />
            </button>
          </li>
        ))}
        {!institutions.isLoading && visible.length === 0 && (
          <li className="py-6 text-center text-sm text-muted">Nenhum banco encontrado.</li>
        )}
      </ul>
      <p className="mt-4 text-xs text-muted">
        Modo demonstração: bancos fictícios. Com a Pluggy configurada, aqui abre o widget oficial com os bancos reais
        do Open Finance.
      </p>
    </div>
  );
}

type PluggyStage =
  | { name: "token" }
  | { name: "widget"; connectToken: string }
  | { name: "importing" }
  | { name: "done"; result: ConnectResultData }
  | { name: "error"; message: string };

/**
 * Modo Pluggy: o login e o consentimento acontecem no widget oficial (e no app do banco).
 * O Finova só recebe o `item.id` no onSuccess e importa os dados pelo servidor.
 */
function PluggyFlow({ sandbox, onClose }: { sandbox: boolean; onClose: () => void }) {
  const [stage, setStage] = useState<PluggyStage>({ name: "token" });
  const [createToken] = useCreateConnectTokenMutation();
  const [connect] = useCreateBankConnectionMutation();
  const started = useRef(false);

  const start = async () => {
    setStage({ name: "token" });
    try {
      const { connectToken } = await createToken().unwrap();
      setStage({ name: "widget", connectToken });
    } catch (error) {
      setStage({ name: "error", message: errorMessage(error) });
    }
  };

  useEffect(() => {
    // Em desenvolvimento o React monta efeitos duas vezes; um token por conexão basta.
    if (started.current) return;
    started.current = true;
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const importItem = async (itemId: string) => {
    setStage({ name: "importing" });
    try {
      setStage({ name: "done", result: await connect({ itemId }).unwrap() });
    } catch (error) {
      setStage({ name: "error", message: errorMessage(error) });
    }
  };

  if (stage.name === "widget") {
    return (
      <PluggyConnect
        connectToken={stage.connectToken}
        includeSandbox={sandbox}
        language="pt"
        theme="dark"
        countries={["BR"]}
        onSuccess={({ item }) => importItem(item.id)}
        onError={(error) => {
          // Alguns fluxos de Open Finance terminam aqui com a autorização ainda pendente.
          if (error.data?.item?.id) importItem(error.data.item.id);
          else setStage({ name: "error", message: "A conexão com o banco não foi concluída." });
        }}
        onClose={() => setStage((s) => (s.name === "widget" ? { name: "error", message: "Conexão cancelada." } : s))}
      />
    );
  }

  return (
    <Modal open onClose={onClose} title="Conectar banco" description="Conexão segura via Pluggy (Open Finance).">
      {stage.name === "token" && (
        <div className="mt-6 flex items-center justify-center gap-2 py-6 text-sm text-muted" role="status">
          <Loader2 size={18} className="animate-spin text-primary" aria-hidden="true" /> Abrindo conexão segura…
        </div>
      )}
      {stage.name === "importing" && <ImportingView />}
      {stage.name === "done" && <DoneView result={stage.result} onClose={onClose} />}
      {stage.name === "error" && <ErrorView message={stage.message} onRetry={start} />}
    </Modal>
  );
}

export function ConnectBankDialog({
  open,
  mode,
  sandbox,
  onClose,
}: {
  open: boolean;
  mode: BankingMode;
  sandbox: boolean;
  onClose: () => void;
}) {
  if (mode === "pluggy") return open ? <PluggyFlow sandbox={sandbox} onClose={onClose} /> : null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Conectar banco"
      description="Escolha o banco e autorize o acesso no ambiente dele."
    >
      <ConnectFlow onClose={onClose} />
    </Modal>
  );
}
