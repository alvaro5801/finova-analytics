import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AccountRole = "admin" | "editor" | "viewer";

export const ROLE_LABEL: Record<AccountRole, string> = {
  admin: "Administrador",
  editor: "Editor",
  viewer: "Leitor",
};

export interface Account {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  role: AccountRole;
  status: "active" | "invited";
  phone?: string;
  location?: string;
}

interface AccountsState {
  /** Conta logada no ambiente de demonstração. */
  currentId: string;
  accounts: Account[];
}

const account = (
  id: number,
  name: string,
  jobTitle: string,
  role: AccountRole,
  status: Account["status"] = "active",
): Account => ({
  id: `acc-${id}`,
  name,
  email: `${name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(" ", ".")}@finova.example`,
  jobTitle,
  role,
  status,
});

const initialState: AccountsState = {
  currentId: "acc-1",
  accounts: [
    { ...account(1, "Marina Costa", "Diretora financeira (CFO)", "admin"), phone: "+55 (11) 99999-0000", location: "São Paulo, SP" },
    account(2, "Juliana Souza", "Gerente de FP&A", "admin"),
    account(3, "Rafael Almeida", "Analista financeiro", "editor"),
    account(4, "Lucas Pereira", "Engenheiro de dados", "editor"),
    account(5, "Beatriz Fernandes", "Contadora", "editor"),
    account(6, "André Barbosa", "Controller", "editor"),
    account(7, "Gabriel Oliveira", "Analista de risco", "viewer"),
    account(8, "Camila Ribeiro", "Product designer", "viewer"),
    account(9, "Thiago Andrade", "Analista de tesouraria", "viewer"),
    account(10, "Patrícia Queiroz", "Analista de marketing", "viewer", "invited"),
    account(11, "Eduardo Klein", "Suporte ao cliente", "viewer", "invited"),
  ],
};

export type AccountInvite = Pick<Account, "id" | "name" | "email" | "jobTitle" | "role">;
export type AccountChanges = Partial<Omit<Account, "id" | "status">>;

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    inviteAccount(state, action: PayloadAction<AccountInvite>) {
      state.accounts.push({ ...action.payload, status: "invited" });
    },
    updateAccount(state, action: PayloadAction<{ id: string; changes: AccountChanges }>) {
      const target = state.accounts.find((a) => a.id === action.payload.id);
      if (!target) return;
      const changes = { ...action.payload.changes };
      // Sem isso a conta logada poderia se trancar fora da área de administração.
      if (target.id === state.currentId) delete changes.role;
      Object.assign(target, changes);
    },
    removeAccount(state, action: PayloadAction<string>) {
      if (action.payload === state.currentId) return;
      state.accounts = state.accounts.filter((a) => a.id !== action.payload);
    },
  },
});

export const { inviteAccount, updateAccount, removeAccount } = accountsSlice.actions;
export default accountsSlice.reducer;

export interface AccountForm {
  name: string;
  email: string;
  jobTitle: string;
}

export type AccountFormErrors = Partial<Record<keyof AccountForm, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** `currentEmail`: na edição, o e-mail que a conta já tem não conta como repetido. */
export function validateAccountForm(form: AccountForm, emails: string[], currentEmail?: string): AccountFormErrors {
  const errors: AccountFormErrors = {};
  const email = form.email.trim().toLowerCase();
  if (form.name.trim().length < 2) errors.name = "Informe o nome.";
  if (!EMAIL_RE.test(email)) errors.email = "Informe um e-mail válido.";
  else if (email !== currentEmail?.toLowerCase() && emails.some((e) => e.toLowerCase() === email))
    errors.email = "Já existe uma conta com este e-mail.";
  return errors;
}
