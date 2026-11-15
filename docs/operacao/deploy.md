# Operação: deploy (Vercel + Turso)

## Visão geral

| Peça | Onde roda | Observação |
|---|---|---|
| App Next.js (frontend + rotas de API) | Vercel | Um único deploy, sem backend separado |
| Banco | Turso (libSQL) | O SQLite local não persiste no serverless |
| Conexão | `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` | Sem essas variáveis, o app cai para `prisma/dev.db` (só local) |

## Primeira configuração

1. Crie um banco no [Turso](https://turso.tech) e gere um token.
2. No projeto da Vercel, vá em **Settings → Environment Variables** e defina `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN` para *Production* e *Preview*.
3. Popule o banco a partir da sua máquina (veja a seção seguinte).

## Recriar o schema e o seed no Turso

> ⚠️ **Destrutivo:** apaga todos os dados do banco apontado. Use só em banco de demonstração.

Isso é necessário na primeira vez e sempre que o schema mudar. A fase 1 mudou o schema para valores em centavos ([ADR-0001](../decisoes/0001-dinheiro-em-centavos.md)).

```bash
TURSO_DATABASE_URL="libsql://<seu-banco>.turso.io" \
TURSO_AUTH_TOKEN="<token>" \
npm run db:reset
```

Confira o resultado com `curl https://<seu-deploy>/api/stats`. A resposta deve trazer `"format":"currency"` e valores inteiros.

## Checklist antes da demo

- [ ] `npm run lint` e `npm run test:e2e` verdes
- [ ] Banco Turso com o seed atual (`/api/stats` responde com centavos)
- [ ] Deploy de produção abre `/dashboard` sem erro no console
- [ ] Teste rápido em 390 px (DevTools)
