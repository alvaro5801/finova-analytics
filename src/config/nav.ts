import type { LucideIcon } from "lucide-react";
import {
  Languages,
  LayoutDashboard,
  LogIn,
  Receipt,
  Table2,
  UserPlus,
  UserRound,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Termos extras para a busca de páginas da navbar (sem acento). */
  keywords?: string[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const mainNavItems: NavItem[] = [
  {
    label: "Visão geral",
    href: "/dashboard",
    icon: LayoutDashboard,
    keywords: ["dashboard", "inicio", "receita", "despesas", "saldo", "kpi", "fluxo de caixa"],
  },
  {
    label: "Relatórios",
    href: "/tables",
    icon: Table2,
    keywords: ["tabelas", "equipe", "orcamentos", "areas", "time"],
  },
  {
    label: "Faturamento",
    href: "/billing",
    icon: Receipt,
    keywords: ["faturas", "billing", "pagamento", "cartao", "notas"],
  },
];

export const accountNavItems: NavItem[] = [
  { label: "Perfil", href: "/profile", icon: UserRound, keywords: ["conta", "configuracoes", "usuario"] },
  { label: "Entrar", href: "/sign-in", icon: LogIn, keywords: ["login", "acesso", "sign in"] },
  { label: "Criar conta", href: "/sign-up", icon: UserPlus, keywords: ["cadastro", "registro", "sign up"] },
];

/** D3: a prévia RTL continua acessível, mas fora do menu principal. */
export const otherNavItems: NavItem[] = [
  { label: "Prévia RTL", href: "/rtl", icon: Languages, keywords: ["rtl", "direita para esquerda", "idioma"] },
];

export const navSections: NavSection[] = [
  { title: "Principal", items: mainNavItems },
  { title: "Conta", items: accountNavItems },
  { title: "Outros", items: otherNavItems },
];

export const allNavItems = [...mainNavItems, ...accountNavItems, ...otherNavItems];

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Busca de páginas: casa rótulo ou palavras-chave, ignorando acentos e caixa. */
export function searchNavItems(query: string): NavItem[] {
  const q = normalize(query);
  if (!q) return allNavItems;
  return allNavItems.filter(
    (item) =>
      normalize(item.label).includes(q) || item.keywords?.some((k) => normalize(k).includes(q)),
  );
}
