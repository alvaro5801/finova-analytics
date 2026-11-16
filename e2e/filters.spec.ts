import { expect, test } from "@playwright/test";
import { gotoReady } from "./routes";

test.use({ reducedMotion: "reduce" });

test("filtros ativos viram chips removíveis, sem mexer na barra de controles", async ({ page }) => {
  await gotoReady(page, "/tables");
  const team = page.locator(".fn-card", { hasText: "Equipe financeira" });
  const search = team.getByRole("searchbox", { name: "Buscar na equipe" });
  const before = await search.boundingBox();

  await team.getByRole("button", { name: "Online", exact: true }).click();
  await team.getByRole("combobox", { name: "Departamento" }).selectOption("Tecnologia");
  const online = team.getByRole("button", { name: "Remover filtro: Online" });
  const department = team.getByRole("button", { name: "Remover filtro: Departamento: Tecnologia" });
  await expect(online).toBeVisible();
  await expect(department).toBeVisible();
  await expect(team).toContainText(/\d+ de 18 pessoas/);

  // A barra não pula: o campo de busca fica no mesmo lugar e com a mesma largura.
  const after = await search.boundingBox();
  expect(after!.y).toBe(before!.y);
  expect(after!.width).toBe(before!.width);

  // Remover um chip mantém os outros filtros.
  await online.click();
  await expect(online).toHaveCount(0);
  await expect(department).toBeVisible();

  await team.getByRole("button", { name: "Limpar tudo" }).click();
  await expect(team.getByText("Filtros:")).toHaveCount(0);
  await expect(team.getByRole("button", { name: "Online", exact: true })).toHaveAttribute("aria-pressed", "false");
});
