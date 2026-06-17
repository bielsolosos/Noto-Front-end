# Plan 001 — Fix Quality Gates

## Overview

Remove `typescript.ignoreBuildErrors: true` from `next.config.mjs` so the build actually respects TypeScript errors, and make ESLint blocking in CI so warnings are never silently ignored.

## Context

The `next.config.mjs` currently has `typescript.ignoreBuildErrors: true` (line 10). This means `next build` will succeed even when TypeScript has type errors. The CI does run `tsc --noEmit` as a blocking step, but the build itself never fails on type errors — creating a false sense of safety.

Additionally, CI step `lint` in `.github/workflows/ci.yml` uses `continue-on-error: true` (line 42), making it purely informational. Warnings and errors are logged but never block merges.

## Files in scope

- `next.config.mjs`
- `.github/workflows/ci.yml`

## Files out of scope

All other files. Do not change ESLint rules yet (that's plan 003).

## Steps

### 1. Enable TypeScript errors in Next.js build

Open `next.config.mjs` and remove the `typescript.ignoreBuildErrors: true` line:

```js
// BEFORE (line 9-11):
  typescript: {
    ignoreBuildErrors: true,
  },

// AFTER:
  typescript: {
    // Default: fail build on TypeScript errors
  },
```

**Verification:**
```bash
npx tsc --noEmit
# Must pass with zero errors before proceeding
```

### 2. Make ESLint blocking in CI

Open `.github/workflows/ci.yml`. Change the lint step from informational to blocking:

```yaml
# BEFORE (lines 40-43):
      - name: Lint (informativo)
        id: lint
        continue-on-error: true
        run: yarn lint

# AFTER:
      - name: Lint
        id: lint
        run: yarn lint
```

Also update the job name from `Lint, Typecheck e Build` to `Lint, Typecheck e Build` (no change needed) and update the summary section accordingly:

```yaml
# BEFORE (lines 54-56):
            echo "- Lint: ${{ steps.lint.outcome == 'success' && 'concluido' || 'falhou (informativo, nao bloqueante)' }}"

# AFTER:
            echo "- Lint: ${{ steps.lint.outcome == 'success' && 'concluido' || 'falhou' }}"
```

**Verification:**
```bash
yarn lint
# Must pass with zero errors (warnings are allowed by --max-warnings=0)
```

### 3. Verify the full CI pipeline locally

```bash
yarn tsc --noEmit && yarn lint && yarn build
```

All three must succeed. If `yarn lint` now fails, it means there are existing lint errors that need to be fixed. Do not proceed to plan 002 until this passes.

## Known lint failures that must be fixed first

If `yarn lint` fails after making the above changes, the failures will be the same ESLint errors reported in the audit. Common patterns:
- `@typescript-eslint/no-unused-vars` — prefix unused error vars with `_`
- `@typescript-eslint/no-explicit-any` — use `unknown` or a typed interface instead
- `react-hooks/exhaustive-deps` — add missing dependencies or suppress with `// eslint-disable-next-line`

Fix these inline as part of this plan since they block the quality gate. Do not change ESLint rules (plan 003) — only fix the violations.

## Done criteria

1. `next.config.mjs` no longer has `ignoreBuildErrors: true`
2. `.github/workflows/ci.yml` lint step has no `continue-on-error: true`
3. `yarn tsc --noEmit` passes
4. `yarn lint` passes with zero warnings
5. `yarn build` succeeds

## Maintenance note

After this plan lands, every PR will fail CI if it introduces TypeScript errors or ESLint warnings. This is the intended behavior — it enforces the type safety and code quality standards from day one.

---

**Parent finding:** #1 — `next.config.mjs` silences TypeScript errors | **Commit:** `ccfa364`
