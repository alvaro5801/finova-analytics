import { expect, test } from "@playwright/test";
import { gotoReady } from "./routes";

test.use({ reducedMotion: "reduce" });

test("fatura: pré-visualiza na tela e baixa o PDF pela prévia", async ({ page }) => {
  await gotoReady(page, "/billing");
  const firstView = page.getByRole("button", { name: /^Ver fatura #FN-\d{6}$/ }).first();
  const code = (await firstView.getAttribute("aria-label"))!.replace("Ver fatura ", "");
  await firstView.click();

  const dialog = page.getByRole("dialog", { name: "Pré-visualização da fatura" });
  const paper = dialog.getByRole("article", { name: `Prévia da fatura ${code}` });
  await expect(paper).toContainText("Finova Analytics");
  await expect(paper).toContainText("Forma de pagamento");
  await expect(paper).toContainText(/Total\s*R\$\s[\d.]+,\d{2}/);

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    dialog.getByRole("button", { name: "Baixar PDF" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe(`fatura-${code.replace(/\W/g, "")}.pdf`);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("faturamento sem banco conectado convida a importar os cartões", async ({ page }) => {
  // Resposta fixa: o estado do banco de dados é compartilhado com o teste de integração.
  await page.route("**/api/integrations", (route) =>
    route.fulfill({ json: { data: { mode: "demo", sandbox: false, connections: [] } } }),
  );
  await gotoReady(page, "/billing");
  const section = page.getByRole("region", { name: "Do seu banco" });
  await expect(section.getByRole("link", { name: "Conectar banco" })).toHaveAttribute("href", "/integrations");
});
