# Plans Index

**Audit commit:** `ccfa364` | **Generated:** 2026-06-17

## Status Table

| # | Plan | Finding | Status | Dependencies |
|---|------|---------|--------|-------------|
| 001 | Fix Quality Gates | #1 — `ignoreBuildErrors: true` silences TypeScript in build | TODO | — |
| 002 | Eliminate Duplicate Hooks | #2 — 3 duplicate `useMobile` implementations | TODO | — |
| 003 | ESLint Hardening | #6 — Minimal flat config, no rules | TODO | 001 |
| 004 | Clean Up Legacy Artifacts | #10 — `.angular/` dead directory | TODO | — |
| 005 | Unify Package Manager | #11 — `package-lock.json` conflict | TODO | — |
| 006 | Fix Markdown Sanitization | #12 — Unsanitized `dangerouslySetInnerHTML` | TODO | — |

## Recommended Execution Order

```
001 (Fix Quality Gates)
    ↓
003 (ESLint Hardening)     ← depends on 001 passing first

002, 004, 005, 006         ← independent of each other, run in parallel after 001
```

## Dependency Graph

```
001-fix-quality-gates
       ↓
003-eslint-hardening

002-eliminate-duplicate-hooks  ─┐
004-cleanup-legacy-artifacts   ─┼─  all independent, can run parallel
005-unify-package-manager      ─┤
006-fix-markdown-sanitization  ─┘
```

## Not Planned (Deferred or Direction)

These findings were audited but not planned for immediate execution:

| Finding | Reason |
|---------|--------|
| #3 — `filteredPageSummaries` is a misleading no-op alias | Low impact, can be addressed in a future context refactor |
| #4 — `window.location.href` in axios interceptor | Correctness issue, fix is in the API refactor direction |
| #5 — `markdownParser.ts` mutates `window` on import | Tech debt, fix is in the Vite direction |
| #7 — Inconsistent component exports | Deferred — pattern discussion needed first |
| #8 — React Compiler memoization warning | Low impact, performance optimization |
| #9 — Radix UI version fragmentation | Dependencies issue, fix when removing shadcn |
| #13 — No tests | Requires establishing test infrastructure first |

## Direction Notes

See `direction/vite-migration.md` for the Vite migration exploration — not an implementation plan, but a reference for future work.

## Updating Status

When a plan is executed, update its row in the table above:
- `TODO` → `IN_PROGRESS` → `DONE`
- Add the PR/merge commit hash when merged
- Mark superseded plans as `STALE` if direction changes

## How to Execute

Each plan is self-contained. An executor with no context from this audit can read the plan file and follow the steps directly. Every plan includes:
- Exact file paths
- Before/after code snippets
- Verification commands with expected output
- Hard boundaries (what is and is not in scope)
- Escape hatches (when to stop and report back)
