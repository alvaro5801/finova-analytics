import type { LucideIcon } from "lucide-react";
import { normalizeText } from "@/lib/filters";
import {
  Landmark,
  Languages,
  LayoutDashboard,
  Receipt,
  Table2,
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
  {
    label: "Integrações",
    href: "/integrations",
    icon: Landmark,
    keywords: ["bancos", "open finance", "conectar", "extrato", "pluggy", "transacoes"],
  },
];

export const accountNavItems: NavItem[] = [
  { label: "Perfil", href: "/profile", icon: UserRound, keywords: ["conta", "configuracoes", "usuario"] },
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

/** A busca lista só as páginas do painel; a prévia RTL fica apenas na sidebar. */
const searchableNavItems = [...mainNavItems, ...accountNavItems];

/** Busca de páginas: casa rótulo ou palavras-chave, ignorando acentos e caixa. */
export function searchNavItems(query: string): NavItem[] {
  const q = normalizeText(query);
  if (!q) return searchableNavItems;
  return searchableNavItems.filter(
    (item) =>
      normalizeText(item.label).includes(q) || item.keywords?.some((k) => normalizeText(k).includes(q)),
  );
}
