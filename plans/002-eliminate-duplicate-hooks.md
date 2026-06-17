# Plan 002 — Eliminate Duplicate Hooks

## Overview

Remove the three duplicate `useMobile` implementations and the dead `Header.tsx` component that duplicates `Sidebar.tsx` functionality.

## Context

The codebase has three implementations of the same hook for detecting mobile viewports:

| File | Export name | Uses |
|------|-------------|------|
| `hooks/use-mobile.tsx` | `useIsMobile()` | Uses `matchMedia` with event listener (better) |
| `hooks/useMobile.tsx` | `useMobile()` | Uses `window.innerWidth` with `resize` listener |
| `components/ui/use-mobile.tsx` | `useIsMobile()` | Exact copy of `hooks/use-mobile.tsx` |

`hooks/use-mobile.tsx` (from shadcn) is the best implementation — it uses `matchMedia` which properly handles orientation changes and is more performant. The other two are redundant.

Additionally, `components/layout/Header.tsx` renders a top navigation bar with the same user menu, theme toggle, and save/edit buttons that already exist in `components/layout/Sidebar.tsx` and `components/layout/MainContent.tsx`. The `Header.tsx` appears to be unused — `MainLayout.tsx` never imports it, and the sidebar handles all user navigation.

## Files in scope

- `hooks/useMobile.tsx` (to be deleted)
- `hooks/use-mobile.tsx` (keep — shadcn version)
- `components/ui/use-mobile.tsx` (to be deleted — duplicate of shadcn version)
- `components/layout/Header.tsx` (to be deleted — unused)

## Files out of scope

All other files. Do not touch any imports or usages yet — this plan only removes the files.

## Steps

### 1. Find all imports of the files being deleted

```bash
rg "from ['\"]@/hooks/useMobile|from ['\"]@/hooks/use-mobile|from ['\"]@/components/layout/Header" --files-with-matches
```

Read each file and understand how they import these modules. Record the results — this determines step 2.

### 2. Update all imports to use the canonical `useIsMobile` from shadcn

If any file imports from `hooks/useMobile.tsx`, update it to import from `hooks/use-mobile.tsx` and rename the hook call from `useMobile()` to `useIsMobile()`.

If any file imports from `components/ui/use-mobile.tsx`, this is already the same as `hooks/use-mobile.tsx` — just remove the duplicate import and use the hook from `hooks/use-mobile.tsx`.

Example migration:
```ts
// BEFORE:
import { useMobile } from "@/hooks/useMobile";
const isMobile = useMobile();

// AFTER:
import { useIsMobile } from "@/hooks/use-mobile";
const isMobile = useIsMobile();
```

### 3. Delete the duplicate files

```bash
rm hooks/useMobile.tsx
rm components/ui/use-mobile.tsx
rm components/layout/Header.tsx
```

### 4. Verify

```bash
yarn tsc --noEmit && yarn lint && yarn build
```

All must pass. If imports were missed, TypeScript will catch them.

## Done criteria

1. `hooks/useMobile.tsx` does not exist
2. `components/ui/use-mobile.tsx` does not exist
3. `components/layout/Header.tsx` does not exist
4. All remaining files still compile and build successfully
5. No references to `useMobile` (the deleted hook) exist in any file

## Maintenance note

Use `hooks/use-mobile.tsx` (`useIsMobile`) going forward. If you need to add mobile detection logic, extend that file — never create a new one.

---

**Parent finding:** #2 — 3 duplicate `useMobile` implementations | **Commit:** `ccfa364`
