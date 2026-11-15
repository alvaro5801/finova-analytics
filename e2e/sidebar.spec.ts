import { expect, test } from "@playwright/test";
import { gotoReady } from "./routes";

/** Sidebar retrátil: só existe no desktop (≥1024px); abaixo disso o menu é o drawer. */

test.describe("sidebar retrátil", () => {
  test("recolhe, navega pelo trilho de ícones e expande", async ({ page }) => {
    test.skip(page.viewportSize()!.width < 1024, "a sidebar retrátil só existe no desktop");
    await gotoReady(page, "/dashboard");

    const sidebar = page.locator("#sidebar-desktop");
    const nav = page.getByRole("navigation", { name: "Navegação principal" });
    const collapse = page.getByRole("button", { name: "Recolher menu" });

    await expect(collapse).toHaveAttribute("aria-expanded", "true");
    await expect(collapse).toHaveAttribute("aria-controls", "sidebar-desktop");
    const logout = sidebar.getByRole("button", { name: "Sair" });
    await expect(logout).toBeVisible();
    await expect(logout).not.toHaveAttribute("title");

    await collapse.click();
    const expand = page.getByRole("button", { name: "Expandir menu" });
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await expect.poll(async () => (await sidebar.boundingBox())!.width).toBe(80);
    await expect(logout).toHaveAttribute("title", "Sair");

    const billing = nav.getByRole("link", { name: "Faturamento" });
    await expect(billing).toHaveAttribute("title", "Faturamento");
    await billing.click();
    await expect(page).toHaveURL(/\/billing$/);
    await expect(page.getByRole("heading", { level: 1, name: "Faturamento" })).toBeVisible();
    await expect(billing).toHaveAttribute("aria-current", "page");
    await expect(expand).toBeVisible();

    await nav.getByRole("link", { name: "Relatórios" }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/tables$/);
    await expect(nav.getByRole("link", { name: "Relatórios" })).toHaveAttribute("aria-current", "page");
    await expect(expand).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "largura do documento excede a viewport").toBeLessThanOrEqual(0);

    await expand.click();
    await expect(page.getByRole("button", { name: "Recolher menu" })).toHaveAttribute("aria-expanded", "true");
    await expect.poll(async () => (await sidebar.boundingBox())!.width).toBe(256);
    await expect(page.getByText("Principal", { exact: true })).toBeVisible();
    await expect(logout).not.toHaveAttribute("title");
  });

  test("em /rtl, o trilho recolhido fica à direita, sem overflow", async ({ page }) => {
    test.skip(page.viewportSize()!.width < 1024, "a sidebar retrátil só existe no desktop");
    await gotoReady(page, "/rtl");
    await page.getByRole("button", { name: "Recolher menu" }).click();

    const sidebar = page.locator("#sidebar-desktop");
    await expect.poll(async () => (await sidebar.boundingBox())!.width).toBe(80);
    const box = (await sidebar.boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(box.x + box.width).toBeGreaterThan(viewport.width - 40);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "largura do documento excede a viewport").toBeLessThanOrEqual(0);
  });

  test("Sair leva a /sign-in (sidebar no desktop, drawer abaixo de 1024px)", async ({ page }) => {
    await gotoReady(page, "/dashboard");

    if (page.viewportSize()!.width < 1024) {
      await page.getByRole("button", { name: "Abrir menu" }).click();
      const drawer = page.getByRole("dialog", { name: "Menu de navegação" });
      await drawer.getByRole("button", { name: "Sair" }).click();
      await expect(drawer).toBeHidden();
    } else {
      await page.locator("#sidebar-desktop").getByRole("button", { name: "Sair" }).click();
    }

    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test("abaixo de 1024px, o botão de recolher não aparece", async ({ page }) => {
    test.skip(page.viewportSize()!.width >= 1024, "teste dos viewports sem sidebar fixa");
    await gotoReady(page, "/dashboard");
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Recolher menu|Expandir menu/ })).toBeHidden();
  });
});
