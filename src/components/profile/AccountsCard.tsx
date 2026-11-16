"use client";

import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import { Pencil, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { ActiveFilters, EmptyResults, SearchField, type ActiveFilter } from "@/components/ui/Filters";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { SegmentedControl, type SegmentOption } from "@/components/ui/SegmentedControl";
import { AccountDialog, ConfirmRemoveDialog } from "@/components/profile/AccountDialogs";
import { matchesQuery } from "@/lib/filters";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  ROLE_LABEL,
  inviteAccount,
  removeAccount,
  updateAccount,
  type Account,
  type AccountForm,
  type AccountRole,
} from "@/store/slices/accountsSlice";

const ROLE_FILTERS: SegmentOption<"all" | AccountRole>[] = [
  { value: "all", label: "Todos" },
  { value: "admin", label: "Administradores" },
  { value: "editor", label: "Editores" },
  { value: "viewer", label: "Leitores" },
];

const ROLE_CHIP: Record<AccountRole, string> = {
  admin: "bg-primary/15 text-primary-light",
  editor: "bg-accent/10 text-accent",
  viewer: "bg-white/[0.05] text-muted",
};

const iconButton =
  "flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-fg disabled:pointer-events-none disabled:opacity-30";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function AccountsCard() {
  const accounts = useAppSelector((state) => state.accounts.accounts);
  const currentId = useAppSelector((state) => state.accounts.currentId);
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | AccountRole>("all");
  const filtered = useMemo(
    () =>
      accounts.filter((a) => (role === "all" || a.role === role) && matchesQuery([a.name, a.email, a.jobTitle], query)),
    [accounts, role, query],
  );
  const pagination = usePagination(filtered);

  // `open` separado do alvo: o conteúdo do modal não muda durante a animação de saída.
  const [editor, setEditor] = useState<{ open: boolean; account?: Account }>({ open: false });
  const [removal, setRemoval] = useState<{ open: boolean; account?: Account }>({ open: false });
  const [announcement, setAnnouncement] = useState("");

  const invited = accounts.filter((a) => a.status === "invited").length;
  const emails = accounts.map((a) => a.email);

  const closeEditor = useCallback(() => setEditor((s) => ({ ...s, open: false })), []);
  const closeRemoval = useCallback(() => setRemoval((s) => ({ ...s, open: false })), []);

  const saveAccount = (values: AccountForm & { role: AccountRole }) => {
    if (editor.account) {
      dispatch(updateAccount({ id: editor.account.id, changes: values }));
      setAnnouncement(`Conta de ${values.name} atualizada.`);
    } else {
      dispatch(inviteAccount({ id: `acc-${Date.now()}`, ...values }));
      setAnnouncement(`Convite enviado para ${values.email}.`);
    }
  };

  const confirmRemoval = (account: Account) => {
    dispatch(removeAccount(account.id));
    setAnnouncement(`Conta de ${account.name} excluída.`);
  };

  const update = (apply: () => void) => {
    apply();
    pagination.setPage(1);
  };
  const clearFilters = () =>
    update(() => {
      setQuery("");
      setRole("all");
    });
  const roleLabel = ROLE_FILTERS.find((r) => r.value === role)?.label;
  const activeFilters: ActiveFilter[] = [
    ...(role !== "all" && roleLabel ? [{ key: "role", label: roleLabel, onRemove: () => update(() => setRole("all")) }] : []),
    ...(query.trim()
      ? [{ key: "query", label: `Busca: “${query.trim()}”`, onRemove: () => update(() => setQuery("")) }]
      : []),
  ];

  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            Usuários e permissões
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary-light">
              <ShieldCheck size={12} aria-hidden="true" /> Admin
            </span>
          </span>
        }
        subtitle={`${accounts.length - invited} contas ativas · ${invited} convites pendentes`}
        action={
          <button
            type="button"
            onClick={() => setEditor({ open: true })}
            aria-haspopup="dialog"
            className="fn-btn-primary inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold"
          >
            <UserPlus size={14} aria-hidden="true" /> Convidar
          </button>
        }
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SearchField
          label="Buscar contas"
          placeholder="Buscar por nome, e-mail ou cargo"
          value={query}
          onChange={(value) => update(() => setQuery(value))}
        />
        <SegmentedControl
          label="Papel"
          options={ROLE_FILTERS}
          value={role}
          onChange={(value) => update(() => setRole(value))}
        />
      </div>
      <ActiveFilters
        filters={activeFilters}
        onClearAll={clearFilters}
        count={filtered.length}
        total={accounts.length}
        noun="contas"
      />

      {filtered.length === 0 ? (
        <EmptyResults message="Nenhuma conta encontrada." onClear={clearFilters} />
      ) : (
        // Focável para quem rola pelo teclado quando a tabela não cabe (WCAG 2.1.1).
        <div
          className="-mx-6 mt-5 overflow-x-auto rounded-lg px-6"
          tabIndex={0}
          role="region"
          aria-label="Tabela de contas do sistema"
        >
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.08em] text-muted">
                <th scope="col" className="pb-3 font-medium">
                  Pessoa
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Cargo
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Papel
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Status
                </th>
                <th scope="col" className="pb-3 text-end font-medium">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {pagination.items.map((account) => {
                const isSelf = account.id === currentId;
                return (
                  <tr
                    key={account.id}
                    className="border-t border-line transition-colors duration-200 hover:bg-white/[0.02]"
                  >
                    <td className="py-3 pe-4">
                      <div className="flex items-center gap-3">
                        <span className="grad-info flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
                          {initials(account.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 truncate font-medium text-fg">
                            {account.name}
                            {isSelf && (
                              <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                                Você
                              </span>
                            )}
                          </p>
                          <p className="truncate text-xs text-muted">{account.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pe-4 text-fg">{account.jobTitle || "—"}</td>
                    <td className="py-3 pe-4">
                      <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", ROLE_CHIP[account.role])}>
                        {ROLE_LABEL[account.role]}
                      </span>
                    </td>
                    <td className="py-3 pe-4">
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                          account.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={clsx(
                            "h-1.5 w-1.5 rounded-full",
                            account.status === "active" ? "bg-success" : "bg-warning",
                          )}
                        />
                        {account.status === "active" ? "Ativo" : "Convite pendente"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditor({ open: true, account })}
                          aria-label={`Editar ${account.name}`}
                          className={iconButton}
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRemoval({ open: true, account })}
                          disabled={isSelf}
                          aria-label={`Excluir ${account.name}`}
                          title={isSelf ? "Você não pode excluir a própria conta" : undefined}
                          className={clsx(iconButton, "hover:bg-danger/10 hover:text-danger")}
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination {...pagination} onPageChange={pagination.setPage} label="Paginação das contas" />

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <AccountDialog
        open={editor.open}
        account={editor.account}
        emails={emails}
        isSelf={editor.account?.id === currentId}
        onClose={closeEditor}
        onSubmit={saveAccount}
      />
      <ConfirmRemoveDialog
        open={removal.open}
        account={removal.account}
        onClose={closeRemoval}
        onConfirm={confirmRemoval}
      />
    </Card>
  );
}
