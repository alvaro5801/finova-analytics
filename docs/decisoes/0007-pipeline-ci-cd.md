# ADR-0007: Pipeline de CI/CD com GitHub Actions e deploy pela Vercel CLI

- **Status:** Aceita
- **Data:** 2026-11-15
- **Decisores:** Alvaro Silva (proposta de Murat/QA, seguindo o workflow de CI do módulo TEA do BMAD)

## Contexto

O projeto vai para a Vercel e mora num **repositório privado no GitHub Free**. Isso tem três consequências:

- Não há *branch protection* nem *environments*.
- CodeQL e Dependency Review exigem GitHub Advanced Security.
- O orçamento é de 2.000 minutos de Actions por mês.

Com a integração Git nativa da Vercel, todo push vira deploy, **sem esperar os testes**. No plano atual, não há como exigir checks antes desse deploy.

A primeira auditoria da pipeline encontrou **vulnerabilidades críticas no Next.js 16.2.11**: RCE sem autenticação na Image Optimization (SVG/AVIF), em `use cache` e em `next/og`. A correção estava na 16.4.6, dentro da mesma versão major.

## Decisão

1. **GitHub Actions com gates** (`quality`, `security`, `e2e`), dos quais o deploy depende via `needs`.
2. **Deploy pela Vercel CLI** dentro da pipeline: preview em PR e produção em push na `main`, com smoke test pós-deploy. O `vercel.json` desliga o deploy automático da integração Git.
3. **Política de vulnerabilidades:** crítica em dependência de produção bloqueia; alta vira aviso. O Dependabot cuida das atualizações.
4. **Correção imediata:** Next.js e `eslint-config-next` atualizados para 16.4.6, revalidados com lint, tipos e os 49 cenários E2E.
5. **Adaptações ao template do TEA:**
   - **sem sharding:** a suíte leva cerca de 35 s, e 4 shards fariam 4 builds;
   - **burn-in com 5 iterações**, e não 10, rodando semanalmente, sob demanda ou com o rótulo `burn-in` em PR, por causa do orçamento de minutos.

## Alternativas consideradas

- **Integração Git da Vercel + Actions só como checagem:** é o padrão mais simples, mas sem branch protection o deploy não espera o CI. Vira opção quando o repositório for público ou estiver no Pro.
- **CodeQL e Dependency Review:** indisponíveis sem GitHub Advanced Security no privado. No lugar, entraram gitleaks (gratuito para conta pessoal) e `npm audit`.
- **Aceitar a vulnerabilidade crítica até "depois da demo":** descartado. O deploy é público.

## Consequências

- ✅ Nada chega à produção sem lint, tipos, varredura de segredos, auditoria e E2E verdes.
- ✅ Cada PR recebe uma URL de preview.
- ⚠️ É preciso configurar `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID`. Sem eles, o deploy é ignorado com aviso, e os gates continuam.
- ⚠️ Sem branch protection, a disciplina de PR é manual até a mudança de plano ou de visibilidade.
- ⚠️ Restam 3 vulnerabilidades altas no Prisma 6. A correção exige migrar para o Prisma 7 (major), o que fica para uma fase própria.
