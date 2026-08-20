---
name: presentation-content
description: Edits text on the Secure Plant Vision microsite — which data file or component constant holds each section's text, the data shapes, editing guardrails, and the GitHub Pages republish flow.
type: feature
---

# Editing the Secure Plant Vision microsite text

The Secure Plant Vision microsite is a static TanStack Start site. Its **text is separated from its structure**: most content lives in typed data files or inline constants at the top of component files. The layout/JSX never needs to change for a text edit.

The site publishes to GitHub Pages at `https://archer2005byte.github.io/secure-plant-vision/`. Every commit to `main` (made here in Lovable, or directly on GitHub) triggers `.github/workflows/deploy-pages.yml`, which rebuilds and republishes automatically. There is no manual publish step.

## Preferred path: the content layer

Text is now overridable without touching components. Prefer this order:

1. **Browser editor at `/edit`** — the user edits text visually, downloads `deck.overrides.json`, and commits it. This is the normal workflow; point them here.
2. **`src/content/deck.overrides.json`** — a flat map of `namespace.path.to.string` -> replacement text. Overrides always win over the defaults in code. Editing this file is safe and never breaks layout.
3. **Defaults in code** — only when the *template itself* should change: `src/content/sectionCopy.ts` (section eyebrows, headings, leads, CTAs, page meta, footer) and the data files / inline `defineContent` blocks listed below.

`src/content/deck.config.ts` holds `repoName` + `owner`, which drive the Pages sub-path, canonical URL and OG URL. Changing the repo name means changing that file only. See `docs/NEW_DECK.md` for the full template-reuse flow.

Every editable string is registered through `defineContent(namespace, base)` in `src/content/contentStore.ts`. Non-string values (icons, colours, coordinates, numbers) pass through untouched, so overrides can never corrupt structure.

## The one rule

**Edit only the text inside string values.** Keep every surrounding token intact — quotes (`"`), brackets (`[]` `{}`), commas, trailing commas, ids, icon import names, type names, and numeric coordinates. A single missing comma or unbalanced quote fails the build and the site will not update until it is fixed.

If a structural change is actually wanted (adding/removing a section, a card, a marker), say so explicitly — do not silently refactor.

## Section order

The deck is composed in `src/routes/index.tsx` inside `<main>`, in this order:

1. Hero
2. WhyNowWithRails (wraps WhyNow)
3. Segments
4. PlantBlocks
5. AsIsAssessment
6. ToBeArchitecture
7. UseCases
8. Offerings
9. WhyEy
10. Credentials
11. ClosingCta

Plus a footer (disclaimer text, inline in `index.tsx`) and `<SiteNav />` / `<DeckNavigation />` at the top. To reorder sections, change the order of these components in `<main>`.

## Where each section's text lives

| Section | File | What to edit |
|---|---|---|
| SEO title, description, footer, all section headings/leads/CTAs | **`src/content/sectionCopy.ts`** | the `copy` object |
| Published URL / repo name | **`src/content/deck.config.ts`** | `repoName`, `owner` |
| Hero | `src/components/site/Hero.tsx` | `markers` array (focus labels); the `<h1>` headline and `<p>` strapline are inline JSX; the `<img alt>` text |
| WhyNow (why-now context) | `src/components/site/WhyNow.tsx` | inline `as const` arrays at top (headings, titles, details) |
| WhyNowWithRails (news + standards) | `src/components/site/WhyNowWithRails.tsx` | `incidents` array (tag, place, headline, detail, source); `standards` array (code, label, detail) |
| Segments | `src/components/site/Segments.tsx` | `legacy` / `integrated` arrays (icon+label); `pathways` array (number, title, strap, bullets[], stages[], target) |
| PlantBlocks | **`src/components/site/plantMapData.ts`** | `plantTypes`, `zoneMeta`, `PlantBlock[]` (see shapes below) |
| AsIsAssessment | `src/components/site/AsIsAssessment.tsx` | inline `as const` matrix/cards at top (labels, ranges, titles, evidence[]) |
| ToBeArchitecture | **`src/components/site/toBeArchitectureData.ts`** | `archLayers`, `flows`, `cyberRail`, `integrationRail`, `principles` |
| UseCases | **`src/components/site/useCaseData.ts`** | `groupOrder`, `useCases` |
| Offerings | `src/components/site/Offerings.tsx` | `phases` array (icon, name, statement, activities[], detail, output); `principles` array |
| WhyEy | `src/components/site/WhyEy.tsx` | `capabilities` (number, icon, title, description); `outcomes`; `evidenceSpans` |
| Credentials | **`src/components/site/credentialsData.ts`** | `categories`, `programmes`, `powerEngagements` |
| ClosingCta | `src/components/site/ClosingCta.tsx` | `propositions` array (number, title, copy, icon) |

The four **bold data files** are the primary content layer. The inline-constant components hold their text in typed arrays marked `as const` at the top of the file — edit the string fields there, not in the JSX body.

## Data file shapes

### `credentialsData.ts`
- `categories: CategoryMeta[]` — `{ id, label, short, dot, text }`. `id` is a union literal; `dot`/`text` are Tailwind class names (do not change unless restyling).
- `programmes: Programme[]` — `{ id, name, place, category, detail, lat, lng, dx?, dy? }`. `category` must match a `CategoryMeta.id`. `lat`/`lng` are map coordinates; `dx`/`dy` are pixel nudges so co-located markers don't overlap.
- `powerEngagements[]` — `{ client, project, capacity, role, units, stations, scope[] }`.

### `useCaseData.ts`
- `groupOrder: string[]` — controls grouping/order; a use case's `group` must match one of these.
- `useCases: UseCase[]` — `{ id (number), name, group, zone, plantTypes?, chain: {detect, correlate, respond}, detects, matters, response[] }`.

### `toBeArchitectureData.ts`
- `archLayers: ArchLayer[]` — `{ id, number, title, subtitle, emphasis?, primary, components: Component[] }`. Each `Component = { icon, label, detail }`. `icon` is a lucide-react import name; `primary` is how many components show in the executive view.
- `flows: Record<string,string>` — keyed by layer id.
- `cyberRail`, `integrationRail`: `RailGroup[]` = `{ caption?, items: Component[] }`.
- `principles: string[]`.

### `plantMapData.ts`
- `plantTypes: {id,label}[]`.
- `zoneMeta: Record<zone, {label, fill, border}>` — `fill`/`border` are hex colors.
- `PlantBlock[]` — `{ id, name, lines[], icon, zone ("A"|"B"|"C"|"D"), zoneLabel, why, risks[], solutions[], shape:{x,y,w,h} }`. `shape` is the block's position on the diagram — change only to reposition a block on the map.

## Editing guardrails

1. Match the field type: a `string[]` wants each entry in quotes; a `string` wants one quoted value; a number stays a number.
2. Keep commas between array/object entries. Trailing commas are allowed and encouraged.
3. Do not remove an `id` — other code keys off it. To delete an item, remove the whole object cleanly (including its trailing comma).
4. Icon names (`Camera`, `ShieldCheck`, …) come from `lucide-react`. To change an icon, use another imported lucide name; do not invent names.
5. Never edit `.css` files for a text change.
6. Keep `lat`/`lng`/`shape`/`dx`/`dy` numeric — they position map markers and diagram blocks.

## Republish flow

Edit → commit to `main` (Lovable auto-syncs; or commit directly on github.com) → GitHub Actions builds `dist/client` → deploys to GitHub Pages. Check the repo's **Actions** tab: a green check = site updated; a red ✕ = a syntax error to fix in the file. The version archive at `/versions/` is separate and only grows when you freeze a version (add a `{ref,name,date,desc}` entry to `VERSIONS_JSON` in the workflow).

## Quick reference: common edits

- **Change a programme's detail text** → `credentialsData.ts`, `programmes`, the `detail` field.
- **Change a use case's "why it matters"** → `useCaseData.ts`, `useCases`, the `matters` field.
- **Change an architecture component label** → `toBeArchitectureData.ts`, `archLayers[].components[]`, the `label`/`detail` fields.
- **Change a Hero focus label** → `Hero.tsx`, `markers`, the `label` field.
- **Change the page title / SEO** → `index.tsx`, `title` / `description` / `publishedUrl`.
