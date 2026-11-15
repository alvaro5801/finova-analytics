#!/usr/bin/env bash
# Reproduz localmente os gates do CI antes de abrir um PR (docs/operacao/ci-cd.md).
# Usa o prisma/dev.db versionado; o CI recria o banco com `npm run db:reset`.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▶ 1/5 Lint";                          npm run lint
echo "▶ 2/5 Tipos";                         npm run typecheck
echo "▶ 3/5 Testes unitários";              npm run test:unit
echo "▶ 4/5 Auditoria (crítico bloqueia)";  npm audit --omit=dev --audit-level=critical
echo "▶ 5/5 E2E (build de produção)";       npm run test:e2e

echo "✅ Todos os gates do CI passaram localmente."
