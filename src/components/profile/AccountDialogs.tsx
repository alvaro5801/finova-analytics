"use client";

import { useId, useState } from "react";
import { SelectInput, TextField } from "@/components/ui/FormField";
import { Modal, ModalActions, dangerButton, primaryButton, secondaryButton } from "@/components/ui/Modal";
import {
  ROLE_LABEL,
  validateAccountForm,
  type Account,
  type AccountForm,
  type AccountRole,
} from "@/store/slices/accountsSlice";

const ROLE_OPTIONS = (Object.keys(ROLE_LABEL) as AccountRole[]).map((value) => ({ value, label: ROLE_LABEL[value] }));
const FIELD_ORDER: (keyof AccountForm)[] = ["name", "email", "jobTitle"];

function useAccountForm(initial: AccountForm, emails: string[], currentEmail?: string) {
  const id = useId();
  const [form, setForm] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const errors = validateAccountForm(form, emails, currentEmail);

  const field = (key: keyof AccountForm) => ({
    id: `${id}-${key}`,
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value })),
    error: submitted ? errors[key] : undefined,
  });

  /** Valida e devolve o formulário limpo, ou foca o primeiro campo inválido. */
  const submit = () => {
    setSubmitted(true);
    const firstInvalid = FIELD_ORDER.find((key) => errors[key]);
    if (firstInvalid) {
      document.getElementById(`${id}-${firstInvalid}`)?.focus();
      return null;
    }
    return { name: form.name.trim(), email: form.email.trim().toLowerCase(), jobTitle: form.jobTitle.trim() };
  };

  return { id, field, submit };
}

function AccountFormBody({
  account,
  emails,
  isSelf,
  onClose,
  onSubmit,
}: {
  account?: Account;
  emails: string[];
  isSelf: boolean;
  onClose: () => void;
  onSubmit: (values: AccountForm & { role: AccountRole }) => void;
}) {
  const { id, field, submit } = useAccountForm(
    { name: account?.name ?? "", email: account?.email ?? "", jobTitle: account?.jobTitle ?? "" },
    emails,
    account?.email,
  );
  const [role, setRole] = useState<AccountRole>(account?.role ?? "viewer");

  return (
    <form
      noValidate
      className="mt-5 flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const values = submit();
        if (values) {
          onSubmit({ ...values, role });
          onClose();
        }
      }}
    >
      <TextField label="Nome" autoComplete="off" placeholder="Nome completo" {...field("name")} />
      <TextField label="E-mail" type="email" autoComplete="off" placeholder="nome@finova.example" {...field("email")} />
      <TextField label="Cargo" autoComplete="off" placeholder="Ex.: Analista financeiro" {...field("jobTitle")} />
      <SelectInput
        id={`${id}-role`}
        label="Papel"
        options={ROLE_OPTIONS}
        value={role}
        onChange={(e) => setRole(e.target.value as AccountRole)}
        disabled={isSelf}
        hint={
          isSelf
            ? "Você não pode remover o próprio acesso de administrador."
            : "Administrador gerencia contas · Editor altera dados · Leitor só visualiza."
        }
      />
      <ModalActions>
        <button type="button" onClick={onClose} className={secondaryButton}>
          Cancelar
        </button>
        <button type="submit" className={primaryButton}>
          {account ? "Salvar alterações" : "Enviar convite"}
        </button>
      </ModalActions>
    </form>
  );
}

export function AccountDialog({
  open,
  account,
  emails,
  isSelf = false,
  onClose,
  onSubmit,
}: {
  open: boolean;
  /** Sem conta = convite de uma conta nova. */
  account?: Account;
  emails: string[];
  isSelf?: boolean;
  onClose: () => void;
  onSubmit: (values: AccountForm & { role: AccountRole }) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={account ? "Editar conta" : "Convidar pessoa"}
      description={account ? account.email : "A pessoa recebe um convite por e-mail para acessar o Finova."}
    >
      <AccountFormBody account={account} emails={emails} isSelf={isSelf} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  );
}

function ProfileFormBody({
  account,
  emails,
  onClose,
  onSave,
}: {
  account: Account;
  emails: string[];
  onClose: () => void;
  onSave: (values: AccountForm & { phone: string; location: string }) => void;
}) {
  const { id, field, submit } = useAccountForm(
    { name: account.name, email: account.email, jobTitle: account.jobTitle },
    emails,
    account.email,
  );
  const [phone, setPhone] = useState(account.phone ?? "");
  const [location, setLocation] = useState(account.location ?? "");

  return (
    <form
      noValidate
      className="mt-5 flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const values = submit();
        if (values) {
          onSave({ ...values, phone: phone.trim(), location: location.trim() });
          onClose();
        }
      }}
    >
      <TextField label="Nome" autoComplete="name" {...field("name")} />
      <TextField label="E-mail" type="email" autoComplete="email" {...field("email")} />
      <TextField label="Cargo" autoComplete="organization-title" {...field("jobTitle")} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          id={`${id}-phone`}
          label="Telefone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          id={`${id}-location`}
          label="Local"
          autoComplete="address-level2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <ModalActions>
        <button type="button" onClick={onClose} className={secondaryButton}>
          Cancelar
        </button>
        <button type="submit" className={primaryButton}>
          Salvar perfil
        </button>
      </ModalActions>
    </form>
  );
}

export function EditProfileDialog({
  open,
  account,
  emails,
  onClose,
  onSave,
}: {
  open: boolean;
  account: Account;
  emails: string[];
  onClose: () => void;
  onSave: (values: AccountForm & { phone: string; location: string }) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Editar perfil" description="Seus dados aparecem no painel e na equipe.">
      <ProfileFormBody account={account} emails={emails} onClose={onClose} onSave={onSave} />
    </Modal>
  );
}

export function ConfirmRemoveDialog({
  open,
  account,
  onClose,
  onConfirm,
}: {
  open: boolean;
  account?: Account;
  onClose: () => void;
  onConfirm: (account: Account) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Excluir conta"
      description={account && `${account.name} perde o acesso ao Finova. Esta ação não pode ser desfeita.`}
    >
      <div className="mt-5">
        <ModalActions>
          <button type="button" onClick={onClose} className={secondaryButton}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              if (account) onConfirm(account);
              onClose();
            }}
            className={dangerButton}
          >
            Excluir conta
          </button>
        </ModalActions>
      </div>
    </Modal>
  );
}
