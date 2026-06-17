# Plan 004 — Clean Up Legacy Artifacts

## Overview

Remove the `.angular/` directory (dead artifact from a past Angular proof-of-concept) and add it and other common artifact directories to `.gitignore`.

## Context

The `.angular/` directory at the project root contains only a `cache/` subdirectory — it's a leftover from a past attempt to use Angular or Angular tooling on this project, which is now a Next.js app. It serves no purpose and adds noise.

Additionally, `.gitignore` is missing several standard artifact directories:
- `.angular/` (current issue)
- `.cursor/` (AI editor cache)
- `.idea/` (JetBrains IDE)
- `dist/` (used by many bundlers; currently NOT in gitignore)

## Files in scope

- `.angular/` directory (delete recursively)
- `.gitignore` (edit)

## Files out of scope

All other files.

## Steps

### 1. Delete the `.angular/` directory

```bash
rm -Recurse -Force .angular
```

**Verification:**
```bash
Test-Path .angular
# Must return False
```

### 2. Update `.gitignore`

Open `.gitignore` and append:

```
# Editor and AI tool caches
.angular/
.cursor/
.idea/

# Build outputs
dist/
```

Ensure the existing `.gitignore` entries for `node_modules`, `.next/`, `out/`, and `build/` are preserved.

**Verification:**
```bash
git status
# .angular/ should appear as deleted
# .gitignore should appear as modified
```

## Done criteria

1. `.angular/` directory does not exist
2. `.gitignore` includes `.angular/`, `.cursor/`, `.idea/`, and `dist/`
3. `git status` shows clean changes for this plan

## Maintenance note

If you ever use Angular CLI or Angular tools again in this project, re-add `.angular/` to git tracking. Otherwise, it stays dead.

---

**Parent finding:** #10 — `.angular/` directory in Next.js project | **Commit:** `ccfa364`
