import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * Smoke E2E (D5 da Quick Spec Finova): 7 rotas × 3 viewports, contra o build de produção,
 * como recomenda o guia de testes do Next.js.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  // No CI: anotações inline no PR (github) + relatório HTML publicado como artefato em falhas.
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "pt-BR",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "tablet-768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
    {
      name: "mobile-390",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/api/stats`,
    reuseExistingServer: !process.env.CI,
    // Os testes usam sempre o banco de demonstração, mesmo com chaves da Pluggy no .env.local.
    env: { BANKING_PROVIDER: "demo" },
    timeout: 240_000,
  },
});
