# Direction: Vite + React SPA Migration

> **Status:** Not an implementation plan — this is a reference document for a possible future migration.
> **Do not execute until explicitly requested.**

## Summary

Remove Next.js and migrate to a **Vite + React SPA**. Every page in the project uses `"use client"` — zero SSR features are being used. The app is structurally a single-page application that Next.js serves as a heavy framework wrapper.

## Why Consider This

**Arguments for the migration:**
- Eliminate the Next.js bundle overhead (~40kb gzip for the framework runtime)
- Faster cold starts (Vite's dev server is instant, Next.js has overhead)
- Simpler deployment (static hosting, no server needed)
- The entire app is client-side — SSR provides no benefit currently
- CI currently uses `output: "standalone"` meaning it still needs a Node server

**Arguments against:**
- Major migration effort (routing, layouts, image optimization, environment variables)
- `next/image` provides automatic image optimization — needs replacement
- `next/link` provides prefetching — needs replacement
- API routes (if any) need to be moved to a separate backend
- `next-themes` (used in `ThemeContext.tsx`) is framework-agnostic — can keep it
- Authentication is already API-based, not Next.js-specific — compatible

## What Would Change

### Components that need replacement

| Next.js feature | Replacement | Effort |
|-----------------|-------------|--------|
| `app/` directory (App Router) | `src/pages/` or `src/routes/` | High — all file-based routes |
| `next/link` | `<a>` or `wouter` | Low |
| `next/image` | Standard `<img>` + manual optimization | Medium |
| `next/font/google` | Google Fonts direct import | Low |
| `next/navigation` (`useRouter`) | `wouter` or `react-router` | Medium |
| `next.config.mjs` | `vite.config.ts` | Medium |
| Environment variables (`NEXT_PUBLIC_`) | Vite `import.meta.env` | Low |
| `output: "standalone"` | Static hosting (Vercel, Netlify, S3) | Low |

### Components that can be kept as-is

- `ThemeContext.tsx` using `next-themes` — works in any React app
- `lib/api.ts` using `axios` — no Next.js dependency
- All contexts (`AuthContext`, `NotesContext`, `SidebarContext`) — pure React
- All shadcn/ui components — work in any React app
- CodeMirror 6 editor — works in any React app
- `lib/markdownParser.ts` — pure JS

## Scope Estimate

**High confidence estimate:**
- Routing migration: 1-2 days
- Image replacement: 1 day
- Build tooling migration: 1 day
- Testing and polish: 2-3 days
- **Total: ~1 week for a basic migration**

**The actual migration would require:**
1. Setting up a new Vite project
2. Copying components and adapting imports
3. Replacing `next/link` → `<a>`, `next/image` → `<img>`, `useRouter` → `wouter`
4. Updating environment variable access patterns
5. Updating CI/CD (`.github/workflows/ci.yml` uses `yarn build` which runs `next build`)

## Prerequisites Before Migrating

1. **Plan 001 (Quality Gates)** must be completed — to ensure the codebase is in a clean state before a large refactor
2. **ESLint hardening (Plan 003)** should be in place
3. **Test coverage** should exist for critical paths (at minimum: login, editor, page creation/deletion)
4. A decision on whether to keep shadcn/ui or replace it (see `direction/shadcn-removal.md`)

## How to Explore Further

To get accurate effort estimates, run:
```bash
rg "\"use client\"" --files-with-matches | wc -l   # How many client-only files
rg "next/" --files-with-matches | wc -l            # How many files import next/
```

## Related

- `plans/001-fix-quality-gates.md` — must be completed first
- `plans/003-eslint-hardening.md` — should be completed before migration
- `direction/shadcn-removal.md` — decision needed before migrating UI layer
