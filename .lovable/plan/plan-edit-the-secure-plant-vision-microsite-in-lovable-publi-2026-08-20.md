# Plan: Edit the Secure Plant Vision microsite in Lovable, publish on GitHub Pages

## Goal

Edit the microsite's text here in Lovable, then publish it live on **GitHub Pages** at the new repo `archer2005byte/secure-plant-vision` — not on Lovable hosting. The old `secure-plant-vision-2` repo and its `github.io` site stay live and untouched (both sites live separately). The multi-version archive feature is kept. Lovable's own `*.lovable.app` publish is **not** used.

## Why this works cleanly

The source repo `archer2005byte/secure-plant-vision-2` is a **Lovable-built TanStack Start project** — the exact same stack as this blank project. Lovable can't *import* a GitHub repo as a new project, but because the stacks match, transporting it is a **direct file copy**: clone in the sandbox, copy source over the blank template. No framework conversion.

## What the repo contains (confirmed by reading it)

- `src/routes/index.tsx` — composes 12 sections in order, with SEO `head()` (title/description/og/canonical).
- `src/components/site/*` — ~24 presentation components (Hero, Segments, PlantBlocks, AsIsAssessment, ToBeArchitecture, UseCases, Offerings, WhyEy, Credentials, ClosingCta, etc.).
- **Content data files** (the editable text layer): `credentialsData.ts`, `toBeArchitectureData.ts`, `useCaseData.ts`, `plantMapData.ts`, `indiaGeo.ts` — content is already separated from structure.
- `src/styles.css` — custom EY-themed design system (navy, ey-green, ey-gold, ey-cream; Inter / Inter Tight).
- `src/assets/*` — JPGs + ~80 SVG icons.
- `vite.config.ts` — already configured for GitHub Pages: `nitro: false`, prerender to static `dist/client`, base path via `VITE_PUBLIC_BASE` env var.
- `.github/workflows/deploy-pages.yml` — the GitHub Actions workflow that builds the static site (+ version archive) and deploys to GitHub Pages.

## Migration steps (executed after approval)

1. **Clone** the repo into `/tmp` in the sandbox (read-only, public).
2. **Copy source over the blank template:**
   - `src/` (routes, components, assets, styles.css, hooks, lib) → replaces the placeholder `index.tsx` and template files.
   - `public/` (favicon, robots) if present.
   - Root configs that differ: `vite.config.ts`, `tsconfig.json`, `components.json`, `bunfig.toml`, `eslint.config.js`.
   - `.github/workflows/deploy-pages.yml` — **keep** (it's the publishing mechanism; adapted below).
3. **Install added dependencies** via `bun add`: `recharts`, `embla-carousel-react`, `react-resizable-panels`, `date-fns`, `react-day-picker`, `input-otp`, `cmdk`, `vaul`.
4. **Update the base path** in `vite.config.ts`: default `VITE_PUBLIC_BASE` from `/secure-plant-vision-2/` → `/secure-plant-vision/` (the new repo's Pages path). The `VITE_PUBLIC_BASE` override stays so version sub-builds can use `/secure-plant-vision/versions/<v>/`.
5. **Fix canonical/og URL** in `src/routes/index.tsx`: switch from `https://archer2005byte.github.io/secure-plant-vision-2/` to `https://archer2005byte.github.io/secure-plant-vision/` — the new site's own URL, since both sites live separately and the new site publishes there.
6. **Harden the Pages workflow** (details in next section).
7. **Verify**: Lovable preview build is green and `/` renders the deck (Hero → ClosingCta) with navigation working.

## GitHub Pages publishing setup (the core of this request)

This is the part that was hard last time. The fix is to make the workflow **robust** and document the one-time GitHub step.

**Workflow** `.github/workflows/deploy-pages.yml` — adapted from the old one:

```text
On push to main:
  1. Checkout main.
  2. npm ci && npm run build            -> dist/client  (base /secure-plant-vision/)
  3. For each version ref in a VERSIONS list:
       - git ls-remote to check the ref exists
       - if missing: log "skipping <v>, ref not found" and continue  (no failure)
       - if exists: checkout, build with VITE_PUBLIC_BASE=/secure-plant-vision/versions/<v>/
                    -> dist/client, copy into site/versions/<v>/
  4. Generate site/versions/index.html from the versions that actually built.
  5. cp current dist/client -> site/  ;  touch site/.nojekyll
  6. Upload Pages artifact (include-hidden-files) ; deploy to github-pages environment.
```

Key improvements over the old workflow:
- **Graceful skip of missing version refs** — the old workflow hard-failed if a version branch didn't exist; the new one logs and continues. So on day one, with only `main`, the workflow is green and serves the current site; the archive index shows "current" until versions are added.
- **Base path + canonical point at the new URL** (`/secure-plant-vision/`).
- Same static prerender path (`dist/client`) and `.nojekyll` as before.

**Version archive, going forward:**
- The old site keeps its existing v1/v2/v2.1 archive (both live separately).
- The new site's archive starts empty (current only) and grows as you freeze versions.
- To freeze a version: create a branch/tag in the new repo at the desired state, add its `{ref, name, date, desc}` to the `VERSIONS` list in the workflow, push. The next deploy includes it under `/versions/<v>/`.

**One-time GitHub setup you do in the new repo** (this is the step that's easy to miss and likely caused the trouble last time — I'll spell it out exactly):
1. After Lovable creates the `secure-plant-vision` repo, open it on GitHub.
2. **Settings → Pages → Build and deployment → Source = "GitHub Actions"**. (Not "Deploy from a branch".)
3. That's it — the workflow handles the rest on every push to `main`.

## After migration: connect Lovable to the new GitHub repo

1. Rename the Lovable project to **"secure-plant-vision"** (so the created repo gets that name), via project settings, or rename the repo on GitHub afterward.
2. Connect via the **`+` menu → GitHub → Connect project** → authorize the Lovable GitHub app → select the `archer2005byte` account → **Create Repository** (`secure-plant-vision`).
3. Two-way sync: Lovable edits push to `main` on the new repo; commits to `main` sync back. Each push triggers the Pages workflow → live at `archer2005byte.github.io/secure-plant-vision/`.

**Publishing flow going forward:** edit text in Lovable → save → Lovable syncs to `main` → GitHub Actions builds & deploys to GitHub Pages. Lovable hosting is not used.

## Tie-in: the `presentation-content` skill (your "stable structure, editable text" goal)

The repo already separates text into data files, not JSX. After migration I'll create the **`presentation-content`** skill (drafted under `.agents/skills/`, then applied) teaching future edits to:

- edit text in the right data file (`credentialsData.ts`, `useCaseData.ts`, `toBeArchitectureData.ts`, `plantMapData.ts`), never inline in components;
- the slide/section → data-file map and each data shape;
- reorder/add a section by editing `index.tsx`'s component list + the data file;
- republish by syncing to GitHub (the Pages workflow deploys);
- guardrail: content edits touch only data files; structural changes get surfaced, not silently refactored.

## Decisions (resolved)

- **Publish target**: GitHub Pages at the new repo `secure-plant-vision` only — no Lovable `*.lovable.app` hosting.
- **Both sites live separately**: old `secure-plant-vision-2` github.io site stays untouched and live; new site publishes independently.
- **Canonical/og:url**: point at `https://archer2005byte.github.io/secure-plant-vision/` (the new site).
- **Multi-version archive**: kept — robust workflow; new site's archive starts empty and grows as you freeze versions; old site keeps its existing v1/v2/v2.1.

## Decisions I still need from you

1. **Skill now or later?** Build the `presentation-content` skill as part of this, or migrate + set up publishing first and revisit the skill after you've done one real edit?

## Out of scope

- No database / auth / CMS — static presentation microsite; code-as-content is correct.
- No visual redesign — keep the existing EY design system.
- The `design/qa/` screenshots are reference-only and won't be copied in.
- No seeding of the old v1/v2/v2.1 content into the new repo (it stays on the old site); add to the new archive only as you freeze new versions.
