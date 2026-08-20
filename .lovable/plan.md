# Plan: Transport the Secure Plant Vision microsite into this Lovable project

## Why this works cleanly

The repo `archer2005byte/secure-plant-vision-2` is a **Lovable-built TanStack Start project** — the exact same stack as this blank project (same `package.json` template name, same dependency baseline). Lovable can't *import* a GitHub repo as a new project, but because the stacks match, transporting it is a **direct file copy**: clone the repo in the sandbox, then copy its source over the blank template here. No framework conversion, no rewrite.

## What the repo contains (confirmed by reading it)

- `src/routes/index.tsx` — composes 12 sections in order, with SEO `head()` (title/description/og/canonical).
- `src/components/site/*` — ~24 presentation components (Hero, WhyNowWithRails, Segments, PlantBlocks, AsIsAssessment, ToBeArchitecture, UseCases, Offerings, WhyEy, Credentials, ClosingCta, DeckNavigation, SiteNav, AccentCard, RiskLogicStrip, IndiaMap, etc.).
- **Content data files** (the editable text layer): `credentialsData.ts`, `toBeArchitectureData.ts`, `useCaseData.ts`, `plantMapData.ts`, `indiaGeo.ts` — content is already separated from structure.
- `src/styles.css` — a custom EY-themed design system (navy, ey-green, ey-gold, ey-cream tokens; Inter / Inter Tight fonts).
- `src/assets/*` — JPGs + ~80 SVG security-architecture icons.
- `design/` — QA screenshots and an icon contact sheet (not needed at runtime; will skip to keep the project clean).

## Migration steps (executed after approval)

1. **Clone** the repo into `/tmp` in the sandbox (read-only, public).
2. **Copy source over the blank template:**
   - `src/` (routes, components, assets, styles.css, hooks, lib) → replaces the placeholder `index.tsx` and template files.
   - `public/` (favicon, robots) if present.
   - Root configs that differ: `vite.config.ts`, `tsconfig.json`, `components.json`, `bunfig.toml`, `eslint.config.js` — copy where they add the project's settings.
3. **Install added dependencies** via `bun add`: `recharts`, `embla-carousel-react`, `react-resizable-panels`, `date-fns`, `react-day-picker`, `input-otp`, `cmdk`, `vaul` (and `@lovable.dev/mcp-js` if kept for dev tooling). The shared baseline deps already match, so only the extras are new.
4. **Fix the canonical/og URL** in `src/routes/index.tsx`: it currently points to `https://archer2005byte.github.io/secure-plant-vision-2/`. Switch it to this project's Lovable URL (or remove canonical until published) so SEO/og point at the right home.
5. **Verify**: build is green and `/` renders the deck (Hero → ClosingCta) with navigation working.
6. Skip the GitHub Pages workflow (`.github/workflows/deploy-pages.yml`) — Lovable handles publishing.

## Tie-in: the `presentation-content` skill (your original goal)

Your stated goal was a microsite with **stable structure but editable text**. The repo already implements exactly that — text lives in the data files, not in JSX. So after migration I'll create the **`presentation-content`** skill (drafted under `.agents/skills/`, then applied) that teaches future edits to:

- edit text in the right data file (`credentialsData.ts`, `useCaseData.ts`, `toBeArchitectureData.ts`, `plantMapData.ts`), never inline in components;
- the slide/section → data-file map and each data shape;
- reorder/add a section by editing `index.tsx`'s component list + the data file;
- republish via Lovable's publish flow;
- the hard guardrail: content edits touch only data files; structural changes get surfaced, not silently refactored.

This makes your recurring "edit wording and republish" workflow safe and repeatable.

## Decisions I need from you

1. **Canonical URL**: leave it as-is. The `<link rel="canonical">` and `og:url` in `index.tsx` keep pointing at `https://archer2005byte.github.io/secure-plant-vision-2/` so the existing GitHub Pages site remains the authoritative home. The Lovable copy coexists without competing for SEO ranking; the GitHub site stays unchanged.
2. **Skill too?** Build the `presentation-content` skill as part of this, or just do the migration first and revisit the skill later?

## Out of scope

- No database / auth / CMS — this is a static presentation microsite; code-as-content is correct.
- No visual redesign — we keep the repo's existing EY design system as-is.
- The `design/qa/` screenshots are reference-only and won't be copied in.
