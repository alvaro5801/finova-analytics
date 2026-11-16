import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { gotoReady } from "./routes";

/**
 * Fluxo completo da integração bancária no modo demonstração. Grava e apaga dados no
 * banco, então roda só no desktop (os 3 viewports em paralelo disputariam as mesmas linhas).
 */
test.use({ reducedMotion: "reduce" });

test("conecta um banco de demonstração, filtra as transações e desconecta", async ({ page }) => {
  test.skip(page.viewportSize()!.width < 1024, "fluxo com escrita no banco: só no desktop");
  const bank = "Banco Atlântico";

  await gotoReady(page, "/integrations");
  await page.getByRole("button", { name: "Conectar banco" }).click();
  const dialog = page.getByRole("dialog", { name: "Conectar banco" });
  await dialog.getByRole("button", { name: bank }).click();
  await expect(dialog.getByText("somente de leitura")).toBeVisible();
  await dialog.getByRole("button", { name: "Autorizar compartilhamento" }).click();
  await expect(dialog.getByText(`${bank} conectado`)).toBeVisible();
  await dialog.getByRole("button", { name: "Ver transações" }).click();

  const card = page.locator(".fn-card", { has: page.getByRole("heading", { name: bank }) });
  await expect(card).toContainText("Conta corrente");
  await expect(card).toContainText("Cartão de crédito");
  await expect(card).toContainText("Conectado");

  const imported = page.locator(".fn-card", { hasText: "Transações importadas" });
  await imported.getByRole("button", { name: "Saídas", exact: true }).click();
  const amounts = await imported.locator("tbody tr td:last-child").allInnerTexts();
  expect(amounts.length).toBeGreaterThan(0);
  expect(amounts.every((a) => a.startsWith("−"))).toBe(true);
  await imported.getByRole("combobox", { name: "Categoria" }).selectOption("Salário");
  await expect(imported.getByText("Nenhuma transação encontrada.")).toBeVisible();
  await imported.getByRole("button", { name: "Limpar filtros" }).first().click();

  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"));
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);

  await card.getByRole("button", { name: "Desconectar" }).click();
  const confirm = page.getByRole("dialog", { name: `Desconectar ${bank}?` });
  await confirm.getByRole("button", { name: "Desconectar" }).click();
  await expect(page.getByRole("heading", { name: bank })).toHaveCount(0);
});
