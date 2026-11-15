import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { ROUTES, gotoReady } from "./routes";

/**
 * Acessibilidade automatizada com axe-core (ADR-0011): critérios WCAG 2.0, 2.1 e 2.2,
 * níveis A e AA, nas 7 rotas e em estados dinâmicos (busca aberta, drawer aberto).
 *
 * Roda com movimento reduzido e espera as animações terminarem, porque o axe mede o
 * contraste com a opacidade atual: um fade-in em andamento geraria falso positivo.
 * O axe cobre cerca de metade dos critérios WCAG; o resto (ordem de leitura, leitor
 * de tela real) continua manual.
 */
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.use({ reducedMotion: "reduce" });

async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState !== "running"),
  );
}

async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const report = violations
    .map(
      (v) =>
        `\n[${v.impact}] ${v.id}: ${v.help}\n` +
        v.nodes
          .slice(0, 4)
          .map((n) => `   ${n.target.join(" ")}\n     ${n.failureSummary?.split("\n").join("\n     ")}`)
          .join("\n"),
    )
    .join("\n");
  expect(violations, `Violações de acessibilidade:${report}`).toEqual([]);
}

test.describe("acessibilidade (WCAG A/AA)", () => {
  for (const route of ROUTES) {
    test(`${route.path}: sem violações`, async ({ page }) => {
      await gotoReady(page, route.path);
      await expect(page.getByText(route.ready).first()).toBeVisible();
      await settle(page);
      await expectNoViolations(page);
    });
  }

  test("busca de páginas aberta: sem violações", async ({ page }) => {
    test.skip(page.viewportSize()!.width < 640, "a busca fica oculta no celular");
    await gotoReady(page, "/dashboard");
    await expect(page.getByText("Receita do mês").first()).toBeVisible();
    await page.getByRole("combobox", { name: "Buscar páginas" }).fill("fat");
    await expect(page.getByRole("listbox", { name: "Páginas" })).toBeVisible();
    await settle(page);
    await expectNoViolations(page);
  });

  test("menu de navegação aberto (drawer): sem violações", async ({ page }) => {
    test.skip(page.viewportSize()!.width >= 1024, "o drawer só existe abaixo de 1024px");
    await gotoReady(page, "/dashboard");
    await expect(page.getByText("Receita do mês").first()).toBeVisible();
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await expect(page.getByRole("dialog", { name: "Menu de navegação" })).toBeVisible();
    await settle(page);
    await expectNoViolations(page);
  });

  test("sidebar recolhida: sem violações", async ({ page }) => {
    test.skip(page.viewportSize()!.width < 1024, "a sidebar retrátil só existe no desktop");
    await gotoReady(page, "/dashboard");
    await expect(page.getByText("Receita do mês").first()).toBeVisible();
    await page.getByRole("button", { name: "Recolher menu" }).click();
    await expect(page.getByRole("button", { name: "Expandir menu" })).toBeVisible();
    await settle(page);
    await expectNoViolations(page);
  });
});
