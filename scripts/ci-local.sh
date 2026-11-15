#!/usr/bin/env bash
# Reproduz localmente os gates do CI antes de abrir um PR (docs/operacao/ci-cd.md).
# Usa o prisma/dev.db versionado; o CI recria o banco com `npm run db:reset`.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▶ 1/4 Lint";                          npm run lint
echo "▶ 2/4 Tipos";                         npm run typecheck
echo "▶ 3/4 Auditoria (crítico bloqueia)";  npm audit --omit=dev --audit-level=critical
echo "▶ 4/4 E2E (build de produção)";       npm run test:e2e

echo "✅ Todos os gates do CI passaram localmente."
