# Plan 003 — ESLint Hardening

## Overview

Extend the ESLint flat config to include rules that enforce consistent code quality: banning `any` types, unused variables, unused imports, and enforcing a consistent component export pattern.

## Context

The current `eslint.config.mjs` is minimal — it only extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. There are no rules for:
- Banning `any` (`@typescript-eslint/no-explicit-any` — currently set to `error` in the config but 10 files still violate it)
- Unused variables (`@typescript-eslint/no-unused-vars`)
- Unused imports (`no-unused-vars` with `varsIgnorePattern`)
- Import ordering (`import/order`)
- Consistent component function declarations

This plan does NOT add rules for React hooks exhaustive deps — those violations are extensive and warrant a dedicated effort after the baseline is clean.

## Files in scope

- `eslint.config.mjs`

## Files out of scope

All source files. Do not fix ESLint violations in this plan — only add the rules. The violations will surface after the config is updated, and they should be fixed incrementally in batches.

## Steps

### 1. Replace `eslint.config.mjs` with an extended config

Read the current `eslint.config.mjs` first, then overwrite it with:

```js
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-import";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint,
      import: unusedImports,
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // TypeScript rules from next/typescript (keep)
      ...nextTypeScript[0].rules,

      // Stricter any type
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off", // Handled by @typescript-eslint

      // Import ordering
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling"],
            ["index"],
          ],
          pathGroups: [
            { pattern: "@/**", group: "internal" },
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-unresolved": "off", // Handled by TypeScript
    },
  },
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]),
]);
```

### 2. Install the new ESLint plugin

```bash
yarn add -D eslint-plugin-import @typescript-eslint/eslint-plugin
```

### 3. Run ESLint to see the new violations

```bash
yarn lint 2>&1 | Select-Object -First 100
```

This will surface violations of the new rules across the codebase. The output will be noisy — that is expected.

### 4. Create a tracking issue for violations (optional but recommended)

Do not fix all violations in this plan. Instead, document them as a follow-up:

> After this config change, the following files have ESLint violations that need to be cleaned up in batches:
> - `app/login/page.tsx` — unused `error` variable
> - `app/media/page.tsx` — unused `error`, `any` type
> - `app/settings/page.tsx` — `any` types
> - `components/admin/UserForm.tsx` — `any` type
> - `components/admin/UserManagement.tsx` — unused `error`, `any` types
> - `components/notes/NoteEditor.tsx` — unused imports, unused variables

Fix them incrementally — 1-2 files per PR — to avoid large, hard-to-review diffs.

## Done criteria

1. `eslint.config.mjs` includes the rules above
2. `eslint-plugin-import` and `@typescript-eslint/eslint-plugin` are in `devDependencies`
3. `yarn lint` runs without crashing (it will report errors, that's expected)
4. All new rules (`no-explicit-any`, `no-unused-vars`, `import/order`) are configured

## Escape hatch

If `eslint-plugin-import` is not compatible with the ESLint 9 flat config API (it had historical issues), fall back to using only the built-in TypeScript ESLint rules and skip the `import/order` rule. Test by running `yarn lint` after the install.

## Maintenance note

Going forward, all new code must pass the ESLint rules. The `import/order` rule is particularly noisy on existing codebases — consider disabling it for a grace period (set to `"warn"` instead of `"error"`) and promoting to `"error"` after the initial cleanup.

---

**Parent finding:** #6 — ESLint flat config is minimal | **Commit:** `ccfa364`
