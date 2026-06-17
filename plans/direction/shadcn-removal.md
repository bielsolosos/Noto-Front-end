# Direction: shadcn/ui Removal

> **Status:** Not an implementation plan — this is a reference document for a possible future migration.
> **Do not execute until explicitly requested.**

## Summary

Remove shadcn/ui as a dependency and replace its 48+ components with either hand-written Tailwind components or a different component library. This decision is a prerequisite for the Vite migration (cleaner to migrate without shadcn's Next.js-specific tooling).

## Why Consider This

**Arguments for removal:**
- 42 `@radix-ui/react-*` packages currently installed
- shadcn/ui adds a CLI dependency (`npx shadcn@latest`) and component copy-paste workflow
- The components are already copied locally — they are not imported from a library
- The project has its own design system in `app/globals.css` (CSS variables for colors, `tertiary` color scale, etc.) that shadcn partially but not fully respects

**Arguments against:**
- 48+ components would need hand-written alternatives
- Radix UI provides accessible primitives that are non-trivial to replicate
- The current components are already styled with Tailwind — a rewrite is pure effort with no runtime benefit

## What Would Change

If removed, each component in `components/ui/` must be either:
1. **Replaced with custom Tailwind + Radix** — if keeping Radix (recommended for accessibility)
2. **Replaced with custom Tailwind only** — drop Radix, build primitives from scratch (high effort)
3. **Replaced with a different library** (e.g., Headless UI, Ark UI) — still requires migration effort

## Components Used

From the codebase audit, the following shadcn/ui components are actually imported and used:

| Component | Used in |
|-----------|---------|
| `button` | Most pages and components |
| `input` | Login, Settings, Admin |
| `dialog` | Settings (image crop) |
| `dropdown-menu` | Sidebar, Header |
| `avatar` | Sidebar, Settings |
| `sheet` | Sidebar (mobile) |
| `scroll-area` | Sidebar |
| `slider` | Settings (image zoom) |
| `separator` | Various layouts |
| `alert-dialog` | Admin (delete confirmations) |
| `badge` | Admin (user roles) |
| `card` | Admin (user management) |
| `table` | Admin (user list) |
| `tabs` | NoteEditor toolbar |
| `tooltip` | Possibly via shadcn |
| `sonner` | Toast notifications |
| `skeleton` | Loading states |

Components in `components/ui/` that are **not imported anywhere** (dead weight):
- `accordion`, `alert`, `aspect-ratio`, `breadcrumb`, `calendar`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `drawer`, `hover-card`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `select`, `switch`, `toggle`, `toggle-group`

## Related

- `direction/vite-migration.md` — Vite migration that should follow or run in parallel
- `plans/003-eslint-hardening.md` — ESLint rules should be in place before a large refactor
