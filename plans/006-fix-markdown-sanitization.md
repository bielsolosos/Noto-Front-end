# Plan 006 — Fix Markdown Sanitization

## Overview

Sanitize all `dangerouslySetInnerHTML` usages with `DOMPurify` — the landing page demo and `NoteEditor` preview render user-authored markdown as raw HTML without sanitization, while `NoteViewer` correctly uses `DOMPurify`.

## Context

The codebase uses `markdownParser.ts` to convert markdown to HTML, then renders it with `dangerouslySetInnerHTML`. Three locations render markdown:

| File | Line | Uses DOMPurify? |
|------|------|-----------------|
| `app/page.tsx` (landing page) | 218 | **NO** |
| `components/notes/NoteEditor.tsx` | 770 | **NO** |
| `components/notes/NoteViewer.tsx` | 17 | **YES** |

`DOMPurify` is already a dependency (`dompurify@^3.3.1`) and `NoteViewer` already demonstrates the correct pattern.

The risk is XSS if any markdown content contains malicious `<script>` tags, `<iframe>` elements, or event handler attributes like `onclick`.

## Files in scope

- `app/page.tsx`
- `components/notes/NoteEditor.tsx`

## Files out of scope

- `components/notes/NoteViewer.tsx` (already correct)
- `lib/markdownParser.ts` (do not modify — it just renders markdown, sanitization is the consumer's responsibility)

## Steps

### 1. Update `app/page.tsx` — landing page demo

Open `app/page.tsx` and find the preview section around line 213-223:

```tsx
// CURRENT (lines 216-222):
<div
  dangerouslySetInnerHTML={{
    __html: demoContent
      ? parseMarkdown(demoContent)
      : "<p class='text-muted-foreground italic'>Preview aparecerá aqui...</p>",
  }}
/>
```

Replace with:

```tsx
import DOMPurify from "dompurify";

// ...

<div
  dangerouslySetInnerHTML={{
    __html: demoContent
      ? DOMPurify.sanitize(parseMarkdown(demoContent))
      : "<p class='text-muted-foreground italic'>Preview aparecerá aqui...</p>",
  }}
/>
```

Note: `DOMPurify` is already imported in this file via `lib/markdownParser.ts` chain — but to be explicit and safe, add the direct import.

**Verification:** `app/page.tsx` must have `import DOMPurify from "dompurify";` at the top.

### 2. Update `components/notes/NoteEditor.tsx` — live preview

Open `components/notes/NoteEditor.tsx` and find the preview section around line 766-779:

```tsx
// CURRENT (lines 766-779):
<div
  className={`p-6 prose prose-sm prose-neutral dark:prose-invert max-w-none ${
    previewMode === "split" ? "prose-sm" : "prose-base"
  }`}
  dangerouslySetInnerHTML={{
    __html: editContent
      ? parseMarkdown(editContent)
      : `<p class='text-muted-foreground italic'>${
          previewMode === "split"
            ? "Preview aparecerá aqui..."
            : "Preview aparecerá aqui quando você escrever algo..."
        }</p>`,
  }}
  onClick={handleContentClick}
/>
```

Replace with:

```tsx
import DOMPurify from "dompurify";

// ...

<div
  className={`p-6 prose prose-sm prose-neutral dark:prose-invert max-w-none ${
    previewMode === "split" ? "prose-sm" : "prose-base"
  }`}
  dangerouslySetInnerHTML={{
    __html: editContent
      ? DOMPurify.sanitize(parseMarkdown(editContent))
      : `<p class='text-muted-foreground italic'>${
          previewMode === "split"
            ? "Preview aparecerá aqui..."
            : "Preview aparecerá aqui quando você escrever algo..."
        }</p>`,
  }}
  onClick={handleContentClick}
/>
```

### 3. Verify

```bash
yarn tsc --noEmit && yarn lint && yarn build
```

All must pass. Check that `DOMPurify` is imported in both files (it will be caught by `no-unused-vars` if the import is wrong, and by TypeScript if the import path is wrong).

## Done criteria

1. `app/page.tsx` imports `DOMPurify` and uses `DOMPurify.sanitize()` around `parseMarkdown()`
2. `components/notes/NoteEditor.tsx` imports `DOMPurify` and uses `DOMPurify.sanitize()` around `parseMarkdown()`
3. `yarn tsc --noEmit && yarn lint && yarn build` all pass

## Maintenance note

When adding new `dangerouslySetInnerHTML` usages that render markdown, always wrap with `DOMPurify.sanitize()`. If rendering HTML from other sources (API responses, user uploads), sanitize those too. Consider adding an ESLint rule to catch unsanitized `dangerouslySetInnerHTML` — this can be done as a follow-up to plan 003.

## Escape hatch

If `DOMPurify` is not available in a server-side rendering context (it requires `window`), use this pattern:

```ts
const sanitizedContent = typeof window !== "undefined" 
  ? DOMPurify.sanitize(rawHtml) 
  : rawHtml;
```

Both files are `"use client"` so this is not an issue here.

---

**Parent finding:** #12 — `dangerouslySetInnerHTML` without `DOMPurify` on landing page and NoteEditor | **Commit:** `ccfa364`
