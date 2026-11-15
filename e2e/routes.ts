import type { Page } from "@playwright/test";

/** Rotas do app com o título (h1) esperado e um texto que só aparece depois que os dados carregam. */
export const ROUTES = [
  { path: "/dashboard", heading: "Visão geral", ready: "Receita do mês" },
  { path: "/tables", heading: "Relatórios", ready: "Equipe financeira" },
  { path: "/billing", heading: "Faturamento", ready: "Histórico da assinatura" },
  { path: "/profile", heading: "Perfil", ready: "Informações do perfil" },
  { path: "/rtl", heading: "Prévia RTL", ready: "Receita semanal" },
  { path: "/sign-in", heading: "Entrar", ready: "Acesse o painel" },
  { path: "/sign-up", heading: "Criar conta", ready: "Comece a acompanhar" },
] as const;

/**
 * Navega e espera o app ficar interativo (`<html data-app-ready>`, ver AppReadyMarker).
 * Use sempre antes de interagir: o HTML pré-renderizado (títulos, botões) aparece antes de o
 * React ligar os event listeners, e uma tecla ou um clique nessa janela se perde.
 */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  await page.locator("html[data-app-ready]").waitFor({ state: "attached" });
}
