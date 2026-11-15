#!/usr/bin/env bash
# Burn-in: repete a suíte E2E sem retries para expor testes instáveis (flaky).
# Uso: ITERATIONS=10 bash scripts/burn-in.sh [args extras do playwright]
set -euo pipefail
cd "$(dirname "$0")/.."

ITERATIONS="${ITERATIONS:-10}"
echo "🔥 Burn-in: ${ITERATIONS} repetições de cada teste, sem retries"
npx playwright test --repeat-each="${ITERATIONS}" --retries=0 "$@"
echo "✅ Burn-in concluído: nenhum teste instável detectado"
