# Plan: Make the Secure Plant Vision site's text editable

## Goal

You can already edit the site's text — it lives in clearly defined files, and the GitHub Actions workflow rebuilds and republishes automatically on every commit to `main`. The work here is to **build a `presentation-content` skill** that documents exactly which file holds which text, so edits (by you on GitHub, or by me in Lovable) always land in the right place and never break the layout.

## How editing works today (both paths)

The site's text is separated from its structure. There are two ways to change it; both end at the same place:

1. **Directly on GitHub** — open the file on `github.com/archer2005byte/secure-plant-vision`, click the ✏️ pencil, edit the text, commit. The `deploy-pages.yml` workflow rebuilds and republishes to `archer2005byte.github.io/secure-plant-vision/` automatically.
2. **Through Lovable** — tell me what to change; I edit the file here, it syncs to `main`, same workflow republishes.

Either way: **edit only text strings, keep the surrounding structure (quotes, brackets, commas, ids) intact.** A broken comma or quote will fail the build and the site won't update until it's fixed.

## What to build: the `presentation-content` skill

A skill is on-demand instructions surfaced when relevant. This one teaches any future edit to go to the right file. It will contain:

### 1. Section order (from `src/routes/index.tsx`)

The deck is 12 sections in this order: Hero → WhyNowWithRails → Segments → PlantBlocks → AsIsAssessment → ToBeArchitecture → UseCases → Offerings → WhyEy → Credentials → ClosingCta (+ footer). Reordering = editing the `<main>` block in `index.tsx`.

### 2. Section → file map (where each section's text lives)

Text lives in one of two places per section:

| Section | Where the text is | File |
|---|---|---|
| SEO title/description, og tags, canonical | top of route | `src/routes/index.tsx` |
| Hero (focus items, alt text) | inline constants | `src/components/site/Hero.tsx` |
| WhyNowWithRails (news items, rails) | inline constants | `src/components/site/WhyNowWithRails.tsx` |
| Segments (segment cards) | inline constants | `src/components/site/Segments.tsx` |
| PlantBlocks (plant types, zones, blocks) | **data file** | `src/components/site/plantMapData.ts` |
| AsIsAssessment (matrix, cards) | inline constants | `src/components/site/AsIsAssessment.tsx` |
| ToBeArchitecture (layers, components, rails) | **data file** | `src/components/site/toBeArchitectureData.ts` |
| UseCases (use cases, groups) | **data file** | `src/components/site/useCaseData.ts` |
| Offerings (phases, deliverables) | inline constants | `src/components/site/Offerings.tsx` |
| WhyEy (pillars, outcomes, sectors) | inline constants | `src/components/site/WhyEy.tsx` |
| Credentials (programmes, map markers, power engagements) | **data file** | `src/components/site/credentialsData.ts` |
| ClosingCta (phases copy) | inline constants | `src/components/site/ClosingCta.tsx` |
| Footer disclaimers | inline JSX | `src/routes/index.tsx` |

### 3. Data shapes (per file)

Each data file has a typed shape the skill documents, e.g.:
- `credentialsData.ts` — `programmes: Programme[]` (id, name, place, category, detail, lat, lng) + `powerEngagements` (client, project, capacity, role, units, stations, scope[]).
- `useCaseData.ts` — `useCases: UseCase[]` (id, name, group, zone, chain{detect,correlate,respond}, detects, matters, response[]).
- `toBeArchitectureData.ts` — `archLayers: ArchLayer[]` (layers with components {icon,label,detail}) + `cyberRail`/`integrationRail` + `principles`.
- `plantMapData.ts` — `plantTypes`, `zoneMeta`, `PlantBlock[]` (name, lines[], why, risks[], solutions[], shape).

For inline-constant components, the skill points to the typed array/object at the top of the file (e.g. `focusItems` in Hero, `phases` in Offerings).

### 4. Editing guardrails

- Edit only string values (the text inside quotes). Never change ids, icon names, type names, numeric coordinates, or array structure unless the edit is intentionally structural.
- Keep quotes balanced and trailing commas. A missing comma breaks the build.
- Don't touch `.css` files for text changes.
- After editing on GitHub: the Actions tab shows the build; a green check means the site updated, a red X means a syntax error to fix.

### 5. Republish flow

Edit → commit to `main` (directly or via Lovable sync) → `deploy-pages.yml` builds `dist/client` → deploys to GitHub Pages. No manual publish step. Version archive (`/versions/`) is separate and grows only when you freeze a version.

## Files created/changed

- `.agents/skills/presentation-content/SKILL.md` — the skill body (new), then applied via `skills--apply_draft` to activate it.
- No source code changes — the editing capability already exists; this only documents it reliably.

## Out of scope

- No CMS, database, or visual editor — code-as-content is correct for a static presentation microsite.
- No redesign — the EY design system stays as-is.
- No changes to the publishing workflow.
