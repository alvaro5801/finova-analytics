import { expect, test, type Page } from "@playwright/test";
import { ROUTES, gotoReady } from "./routes";

/**
 * Smoke da Finova Analytics. Roda em 3 viewports (ver playwright.config.ts).
 * Valores monetários usam /R\$\s/ porque o Intl pt-BR insere espaço NÃO separável (U+00A0).
 */

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("rotas", () => {
  for (const route of ROUTES) {
    test(`${route.path}: renderiza, sem erro no console e sem overflow horizontal`, async ({ page }) => {
      const errors = collectErrors(page);
      await gotoReady(page, route.path);

      await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
      await expect(page.getByText(route.ready).first()).toBeVisible();
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, "largura do documento excede a viewport").toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }

  test("rota inexistente mostra o 404 em PT-BR", async ({ page }) => {
    await gotoReady(page, "/nao-existe");
    await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
  });
});

test.describe("dashboard financeiro", () => {
  // Valores fixos da demonstração: sem banco conectado (outro teste conecta um em paralelo).
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/integrations/summary", (route) => route.fulfill({ json: { data: null } }));
  });

  test("KPIs exibem valores em BRL", async ({ page }) => {
    await gotoReady(page, "/dashboard");
    const kpis = page.getByRole("region", { name: "Indicadores principais" });
    await expect(kpis).toContainText(/R\$\s486\.320,45/);
    await expect(kpis).toContainText(/R\$\s312\.870,30/);
    await expect(kpis).toContainText("23,6%");
  });

  test("filtro de período recalcula o gráfico", async ({ page }) => {
    await gotoReady(page, "/dashboard");
    const card = page.locator(".fn-card", { hasText: "Receita × Despesas" });
    await expect(card).toContainText("em 12 meses");

    const threeMonths = card.getByRole("button", { name: "Últimos 3 meses" });
    await threeMonths.click();
    await expect(threeMonths).toHaveAttribute("aria-pressed", "true");
    await expect(card).toContainText("em 3 meses");
  });

  test("tooltip do gráfico mostra mês por extenso e resultado em BRL", async ({ page, isMobile }) => {
    test.skip(isMobile, "hover não se aplica a toque");
    await gotoReady(page, "/dashboard");
    const card = page.locator(".fn-card", { hasText: "Receita × Despesas" });
    const surface = card.locator(".recharts-surface").first();
    await surface.scrollIntoViewIfNeeded();
    const box = await surface.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width * 0.8, box!.y + box!.height * 0.5);

    const tooltip = card.locator(".recharts-tooltip-wrapper");
    await expect(tooltip).toContainText(/de 20\d\d/);
    await expect(tooltip).toContainText("Resultado");
    await expect(tooltip).toContainText(/R\$\s/);
  });
});

test.describe("navegação", () => {
  test("menu leva ao Faturamento (sidebar no desktop, drawer abaixo de 1024px)", async ({ page }) => {
    await gotoReady(page, "/dashboard");
    const width = page.viewportSize()!.width;

    if (width < 1024) {
      await page.getByRole("button", { name: "Abrir menu" }).click();
      const drawer = page.getByRole("dialog", { name: "Menu de navegação" });
      await drawer.getByRole("link", { name: "Faturamento" }).click();
      await expect(drawer).toBeHidden();
    } else {
      await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Faturamento" }).click();
    }

    await expect(page).toHaveURL(/\/billing$/);
    await expect(page.getByRole("heading", { level: 1, name: "Faturamento" })).toBeVisible();
  });

  test("busca de páginas: atalho / e Enter navegam", async ({ page }) => {
    test.skip(page.viewportSize()!.width < 640, "a busca fica oculta no celular");
    await gotoReady(page, "/dashboard");
    await expect(page.getByRole("heading", { level: 1, name: "Visão geral" })).toBeVisible();

    await page.keyboard.press("/");
    const search = page.getByRole("combobox", { name: "Buscar páginas" });
    await expect(search).toBeFocused();
    await search.fill("fatura");
    await expect(page.getByRole("option", { name: /Faturamento/ })).toBeVisible();
    await search.press("Enter");

    await expect(page).toHaveURL(/\/billing$/);
  });

  test("prévia RTL inverte a direção e restaura ao sair", async ({ page }) => {
    await gotoReady(page, "/rtl");
    await expect(page.locator("[dir=rtl]")).toHaveCount(1);
    await gotoReady(page, "/dashboard");
    await expect(page.locator("[dir=rtl]")).toHaveCount(0);
  });
});

test.describe("autenticação simulada", () => {
  test("login leva ao painel", async ({ page }) => {
    await gotoReady(page, "/sign-in");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("erro de validação da API aparece em PT-BR", async ({ page }) => {
    await gotoReady(page, "/sign-in");
    await page.getByLabel("Senha").fill("123");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText("A senha precisa ter pelo menos 6 caracteres.");
  });
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("KPIs aparecem com o valor final, sem contagem, e transições CSS ficam congeladas", async ({ page }) => {
    await page.route("**/api/integrations/summary", (route) => route.fulfill({ json: { data: null } }));
    await gotoReady(page, "/dashboard");
    const kpis = page.getByRole("region", { name: "Indicadores principais" });
    await kpis.getByText("Receita do mês").waitFor();

    // Sem animação, o valor já está final no primeiro frame em que o card existe.
    expect(await kpis.textContent()).toMatch(/486\.320,45/);

    const duration = await page
      .locator(".fn-card")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration));
    expect(duration).toBeLessThan(0.001);
  });
});
