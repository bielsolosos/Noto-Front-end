# CI/CD Guide - Noto Front-end

## Objetivo
Este documento descreve o CI do front-end em Next.js, com foco em checks de qualidade, build e analise informativa.

## Workflow
- Arquivo: `.github/workflows/ci.yml`
- Nome: `CI - Frontend Next.js`
- Gatilhos:
  - Push: `main`, `develop`
  - Pull request: `main`

## Jobs e Steps

### 1) quality
Objetivo: validar qualidade do codigo e build de producao.

Steps principais:
1. Checkout do codigo
2. Setup Node.js 20 LTS + cache Yarn
3. `yarn install --frozen-lockfile`
4. Lint (informativo)
5. Typecheck (bloqueante)
6. Build de producao (bloqueante)
7. Resumo no `GITHUB_STEP_SUMMARY`

Env usado:
- `NEXT_PUBLIC_API_URL` via `vars.NEXT_PUBLIC_API_URL`
- Fallback: `http://localhost:8080`

### 2) sonarcloud (informativo)
Objetivo: analise adicional sem bloquear merge.

Comportamento:
- Depende de `quality`
- Roda somente se `SONAR_TOKEN`, `SONAR_PROJECT_KEY` e `SONAR_ORGANIZATION` estiverem configurados
- Etapa de scan usa `continue-on-error: true`
- Se faltar configuracao, registra resumo e pula a analise

## Bloqueio de merge
Checks bloqueantes:
- Typecheck
- Build

Checks informativos:
- Lint
- SonarCloud

## Secrets e Variaveis

### Secrets
- `SONAR_TOKEN` (opcional, para SonarCloud)

### Variables
- `NEXT_PUBLIC_API_URL` (recomendado)
- `SONAR_PROJECT_KEY` (opcional para Sonar)
- `SONAR_ORGANIZATION` (opcional para Sonar)

## Como rodar localmente

Comandos equivalentes ao CI:
```bash
yarn install --frozen-lockfile
yarn lint
yarn tsc --noEmit
yarn build
```

## Troubleshooting rapido

### 1) `yarn tsc --noEmit` falha com referencias em `.next/types`
- Remova `.next` e execute novamente o typecheck

Exemplo:
```bash
rm -rf .next
yarn tsc --noEmit
```

### 2) Lint com muitos erros
- No CI atual, lint e informativo
- Corrija gradualmente e, quando estiver estavel, torne lint bloqueante

### 3) Build falha por variavel de ambiente
- Defina `NEXT_PUBLIC_API_URL` em variables do repositiorio
- Em local, use `.env.local` conforme o fluxo do projeto

### 4) SonarCloud nao executa
- Configure `SONAR_TOKEN`, `SONAR_PROJECT_KEY` e `SONAR_ORGANIZATION`
- Sem isso, o job e pulado por design
