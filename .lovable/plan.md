# Add a visible "Edit this deck" link on the site

## Goal
Make the `/edit/` page discoverable from the published site itself, so you never need to remember or copy the URL — just click a link on the deck to open the in-browser editor.

## Where the link goes
The site already has a footer in `src/components/site/DeckBody.tsx` (navy bar at the bottom with two lines of copy). The edit preview page renders `DeckBody` with `chrome={false}`, which hides the top nav and section nav — so gating the new link on `chrome` keeps it off the editor's own preview (no self-referential link).

## Changes

### 1. `src/components/site/DeckBody.tsx`
- Import `basePath` from `@/content/deck.config`.
- Add an "Edit this deck" link to the footer, shown only when `chrome` is true.
- Place it as a third element in the existing footer flex row (below the two copy lines on mobile, inline on desktop).
- The link uses `target="_blank" rel="noopener"` and points to `${basePath}edit/` so it resolves correctly on both:
  - Lovable preview (`/` → `/edit/`)
  - GitHub Pages (`/secure-plant-vision/` → `/secure-plant-vision/edit/`)
- Small, muted styling using existing design tokens (`text-navy-muted`, hover `text-ey-yellow`), with a `Pencil` icon from `lucide-react` (already a project dependency).

### 2. No other files change
- `deck.config.ts` already exports `basePath` and `overridesEditUrl` — no config edits needed.
- The `presentation-content` skill already documents the `/edit/` flow; no update required.

## Why this is safe
- The footer link is gated by `chrome`, so it never appears on the `/edit/` preview.
- `basePath` is derived from `deck.config.repoName`, so a template clone gets the right link automatically with no manual edits.
- The edit route is already prerendered (the build asserts `dist/client/edit/index.html`), so the link always points to a live page.

## Verification
- `bun run build` succeeds.
- Playwright: open `http://localhost:8080/`, confirm the "Edit this deck" link is visible in the footer and clicking it navigates to `/edit/`.
