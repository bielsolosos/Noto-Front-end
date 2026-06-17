# Plan 005 — Unify Package Manager

## Overview

Remove `package-lock.json` since the project uses Yarn (Dockerfile runs `yarn install --frozen-lockfile`). Having both lockfiles causes confusion and potential install drift.

## Context

The project root has both `yarn.lock` and `package-lock.json`. The Dockerfile explicitly uses `yarn install --frozen-lockfile` (line 8 of Dockerfile), and the CI workflow also uses `yarn` (`.github/workflows/ci.yml` line 35: `cache-dependency-path: yarn.lock`). The `package-lock.json` is never used and creates a conflict.

## Files in scope

- `package-lock.json` (delete)

## Files out of scope

- `yarn.lock` (keep — this is the canonical lockfile)
- All other files

## Steps

### 1. Verify the project is using Yarn consistently

```bash
Test-Path yarn.lock
Test-Path package-lock.json
```

Both should exist. After this plan, only `yarn.lock` should remain.

### 2. Delete `package-lock.json`

```bash
Remove-Item -LiteralPath "package-lock.json" -Force
```

### 3. Verify

```bash
yarn install --frozen-lockfile
yarn tsc --noEmit && yarn build
```

The install should succeed from `yarn.lock` only, and the build should be unaffected.

### 4. Commit

If using git, the change is:
```
deleted:  package-lock.json
```

## Done criteria

1. `package-lock.json` does not exist
2. `yarn install --frozen-lockfile` still succeeds
3. `yarn tsc --noEmit && yarn build` still succeed

## Maintenance note

Going forward, always use `yarn add <package>` and `yarn remove <package>`. Never run `npm install` or `pnpm install` in this project.

---

**Parent finding:** #11 — `yarn.lock` + `package-lock.json` both present | **Commit:** `ccfa364`
