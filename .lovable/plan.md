# Make Secure Plant Vision a repeatable deck

Goal: turn this one-off microsite into a **template** that you and colleagues can copy on GitHub and re-content in the browser — no code editing required for a new pitch.

Three pieces, built in order.

## 1. One content file for the whole deck

Today the text is spread across four data files plus inline arrays inside eleven components. That is fine for one deck, fatal for a repeatable one.

- Add `src/content/deck.content.ts` — a single typed object holding every editable string in the deck: site meta (title, description, canonical), hero, why-now, segments, plant blocks, as-is, to-be, use cases, offerings, why-EY, credentials, closing CTA, footer.
- Each section component reads from that object instead of its own local arrays. No layout or styling changes; the JSX stays exactly as it is.
- Structural values that are not text — Tailwind classes, hex colours, map lat/lng, diagram `shape` coordinates, lucide icon names — stay where they are, keyed by id. Colleagues never touch them.
- Keep a `deck.schema.ts` with the types so a wrong shape fails the build loudly rather than rendering a broken slide.

## 2. Browser editor at `/edit`

A new route, not part of the deck itself and excluded from navigation and SEO.

- Left: section list. Right: a form generated from the content schema — text inputs, textareas, add/remove/reorder for list items (incidents, use cases, credentials, offerings phases).
- Live preview of the deck alongside, so a colleague sees the real slide as they type.
- Work is held in browser localStorage, so a session survives a refresh.
- Two exits:
  - **Download `deck.content.json`** — commit that one file to the repo; the site rebuilds and republishes automatically.
  - **Copy to clipboard** — paste into Lovable chat and I apply it.
- The deck reads `deck.content.json` as its source of truth at build time, so a colleague's edit is a one-file commit with zero chance of breaking TypeScript.

Note: GitHub Pages is static, so the editor cannot save directly to the repo. The download-and-commit step is the save. If you later want true one-click saving, that needs a small backend — out of scope here.

## 3. Template repo mechanics

- Add `docs/NEW_DECK.md`: copy the repo via GitHub's "Use this template", rename, set the Pages source to GitHub Actions, update the base path and canonical URL in one place, open `/edit`, replace the content, commit.
- Move the base path and published URL into a single `deck.config.ts` so a new deck needs exactly one line changed.
- Mark the repo as a template in GitHub settings (a checkbox on your side, I will point you to it).
- A `content/examples/` folder with the current EY deck kept as the reference sample, so a new deck starts from real content rather than blanks.

## Technical notes

- Content extraction is mechanical but touches every section component; I will do it section by section and verify the rendered page is pixel-identical after each one.
- `/edit` is a client-only route (`ClientOnly` + dynamic import) so the editor never runs during prerender and adds nothing to the published deck's payload.
- Version archive and the existing GitHub Actions deploy workflow are untouched.
- The active `presentation-content` skill will be rewritten at the end to describe the new single-file content model instead of the current per-component map.

## Suggested sequencing

1. Content extraction + schema (largest step, no visible change).
2. `/edit` editor with live preview and export.
3. Template docs, `deck.config.ts`, skill update.

Tell me if you would rather see the editor first on a couple of sections as a proof of concept before extracting all eleven.
