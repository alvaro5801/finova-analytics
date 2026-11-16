"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Check, CheckCircle2, ChevronRight, Loader2, Lock, ShieldCheck, TriangleAlert } from "lucide-react";
import { PluggyConnectWidget } from "@/components/integrations/PluggyConnectWidget";
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

/** Fixo fora do componente: um array novo a cada renderização reiniciaria o widget. */
const COUNTRIES = ["BR"];

type Step =
  | { name: "choose" }
  | { name: "opening"; institution: BankInstitutionData }
  | { name: "consent"; institution: BankInstitutionData; connectToken: string }
  | { name: "widget"; institution: BankInstitutionData; connectToken: string }
  | { name: "importing"; institution: BankInstitutionData }
  | { name: "done"; result: ConnectResultData }
  | { name: "error"; message: string };

const SHARED_DATA = ["Dados das contas e saldos", "Transações dos últimos 12 meses", "Cartão de crédito e faturas"];

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Logo do banco (vindo do agregador) ou, sem logo, as iniciais na cor da instituição. */
export function InstitutionBadge({
  name,
  color,
  imageUrl,
  size = "md",
}: {
  name: string;
  color: string;
  imageUrl?: string | null;
  size?: "md" | "lg";
}) {
  const box = size === "lg" ? "h-11 w-11 rounded-xl text-sm" : "h-9 w-9 rounded-lg text-xs";
  if (imageUrl)
    return (
      <span aria-hidden="true" className={clsx("flex shrink-0 items-center justify-center overflow-hidden bg-white p-1", box)}>
        {/* Logo externo e pequeno: o otimizador de imagens do Next não traz ganho aqui. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="h-full w-full object-contain" loading="lazy" />
      </span>
    );
  return (
    <span
      aria-hidden="true"
      className={clsx("flex shrink-0 items-center justify-center font-semibold text-canvas", box)}
      style={{ backgroundColor: `#${color}` }}
    >
      {initialsOf(name)}
    </span>
  );
}

function errorMessage(error: unknown) {
  const data = (error as { data?: { error?: { message?: string } } } | undefined)?.data;
  return data?.error?.message ?? "Não foi possível conectar o banco. Tente novamente.";
}

function BankPicker({
  mode,
  busy,
  onChoose,
}: {
  mode: BankingMode;
  busy: boolean;
  onChoose: (institution: BankInstitutionData) => void;
}) {
  const [query, setQuery] = useState("");
  const institutions = useGetBankInstitutionsQuery();
  const visible = useMemo(
    () => (institutions.data ?? []).filter((i) => matchesQuery([i.name], query)),
    [institutions.data, query],
  );
  const hasSandbox = visible.some((i) => i.sandbox);

  return (
    <div className="mt-5">
      <SearchField label="Buscar banco" placeholder="Buscar banco" value={query} onChange={setQuery} />
      <ul aria-label="Instituições disponíveis" className="mt-3 max-h-80 space-y-1 overflow-y-auto">
        {institutions.isLoading && <li className="py-6 text-center text-sm text-muted">Carregando bancos…</li>}
        {institutions.isError && (
          <li className="py-6 text-center text-sm text-muted">Não foi possível carregar a lista de bancos.</li>
        )}
        {visible.map((institution) => (
          <li key={institution.id}>
            <button
              type="button"
              onClick={() => onChoose(institution)}
              disabled={busy}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors duration-200 hover:bg-white/[0.05] disabled:opacity-60"
            >
              <InstitutionBadge name={institution.name} color={institution.color} imageUrl={institution.imageUrl} />
              <span className="flex-1 text-sm font-medium text-fg">{institution.name}</span>
              {institution.sandbox && (
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase text-muted">
                  Teste
                </span>
              )}
              <ChevronRight size={16} className="text-muted rtl:-scale-x-100" aria-hidden="true" />
            </button>
          </li>
        ))}
        {institutions.data && visible.length === 0 && (
          <li className="py-6 text-center text-sm text-muted">Nenhum banco encontrado.</li>
        )}
      </ul>
      <p className="mt-4 text-xs text-muted">
        {mode === "demo"
          ? "Modo demonstração: bancos fictícios. Com a Pluggy configurada, aparecem aqui os bancos liberados na sua conta."
          : `Você será levado ao ambiente seguro do banco para autorizar o acesso.${hasSandbox ? " Bancos marcados como “Teste” são do ambiente de testes da Pluggy." : ""}`}
      </p>
    </div>
  );
}

/** Tela de consentimento do modo demonstração: faz o papel do app do banco. */
function DemoConsent({
  institution,
  onBack,
  onApprove,
}: {
  institution: BankInstitutionData;
  onBack: () => void;
  onApprove: () => void;
}) {
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
          <button type="button" onClick={onBack} className={secondaryButton}>
            Voltar
          </button>
          <button type="button" onClick={onApprove} className={primaryButton}>
            Autorizar compartilhamento
          </button>
        </ModalActions>
      </div>
    </div>
  );
}

function ImportingView({ institutionName }: { institutionName: string }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center" role="status" aria-live="polite">
      <Loader2 size={28} className="animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-fg">Importando contas e transações de {institutionName}…</p>
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

/**
 * Conexão de banco em um fluxo só: o cliente escolhe o banco na lista do Finova.
 * - Demonstração: consentimento simulado e importação na hora.
 * - Pluggy: o widget oficial abre direto no banco escolhido (`selectedConnectorId`); o
 *   login e o consentimento acontecem no ambiente do banco, e o Finova só recebe o `item.id`.
 */
function ConnectFlow({ mode, sandbox, onClose }: { mode: BankingMode; sandbox: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>({ name: "choose" });
  const [createToken] = useCreateConnectTokenMutation();
  const [authorizeDemo] = useAuthorizeDemoBankMutation();
  const [connect] = useCreateBankConnectionMutation();
  const restart = () => setStep({ name: "choose" });

  const choose = async (institution: BankInstitutionData) => {
    setStep({ name: "opening", institution });
    try {
      const { connectToken } = await createToken().unwrap();
      setStep(
        mode === "demo"
          ? { name: "consent", institution, connectToken }
          : { name: "widget", institution, connectToken },
      );
    } catch (error) {
      setStep({ name: "error", message: errorMessage(error) });
    }
  };

  const importItem = async (institution: BankInstitutionData, getItemId: () => Promise<string>) => {
    setStep({ name: "importing", institution });
    try {
      const itemId = await getItemId();
      setStep({ name: "done", result: await connect({ itemId }).unwrap() });
    } catch (error) {
      setStep({ name: "error", message: errorMessage(error) });
    }
  };

  if (step.name === "widget") {
    const { institution, connectToken } = step;
    return (
      <PluggyConnectWidget
        connectToken={connectToken}
        selectedConnectorId={Number(institution.id)}
        includeSandbox={sandbox}
        language="pt"
        theme="dark"
        countries={COUNTRIES}
        onSuccess={({ item }) => importItem(institution, async () => item.id)}
        onError={(error) => {
          // Alguns fluxos de Open Finance terminam aqui com a autorização ainda pendente.
          const itemId = error.data?.item?.id;
          if (itemId) importItem(institution, async () => itemId);
          else setStep({ name: "error", message: "A conexão com o banco não foi concluída." });
        }}
        onClose={() => setStep((s) => (s.name === "widget" ? { name: "choose" } : s))}
      />
    );
  }

  return (
    <Modal open onClose={onClose} title="Conectar banco" description="Escolha o seu banco para autorizar o acesso.">
      {(step.name === "choose" || step.name === "opening") && (
        <BankPicker mode={mode} busy={step.name === "opening"} onChoose={choose} />
      )}
      {step.name === "consent" && (
        <DemoConsent
          institution={step.institution}
          onBack={restart}
          onApprove={() =>
            importItem(step.institution, async () => {
              const { itemId } = await authorizeDemo({
                connectToken: step.connectToken,
                institutionId: step.institution.id,
              }).unwrap();
              return itemId;
            })
          }
        />
      )}
      {step.name === "importing" && <ImportingView institutionName={step.institution.name} />}
      {step.name === "done" && <DoneView result={step.result} onClose={onClose} />}
      {step.name === "error" && <ErrorView message={step.message} onRetry={restart} />}
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
  // Montado só enquanto aberto: cada conexão começa do zero, com um token novo.
  return open ? <ConnectFlow mode={mode} sandbox={sandbox} onClose={onClose} /> : null;
}
