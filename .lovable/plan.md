# One-click "Save & Publish" in the deck editor

## Goal
After editing text in the editor, a single button commits the change to GitHub and triggers the republish. No downloading JSON, no pasting into GitHub, no manual steps.

## How it works
The editor at `/edit/` gets a **Save & Publish** button. Clicking it:

1. Sends the current overrides to a Lovable server function.
2. The server function commits `src/content/deck.overrides.json` to the `main` branch of `archer2005byte/secure-plant-vision` using the GitHub connector.
3. GitHub Actions sees the commit, rebuilds, and republishes GitHub Pages.
4. The button reports progress in-place: *Saving → Committed → Publishing (~1 min)*, with a link to the Actions run.

You click one button; steps 2-4 happen on their own.

## Where it works
Editing happens in the **Lovable editor** — that is where the server lives, so that is where the one-click button is active.

On the public GitHub Pages copy of `/edit/` there is no server, so the button cannot commit there. That copy will show a short note ("Open this deck in Lovable to save changes") instead of a dead button, and keeps Copy JSON / Download JSON as a manual escape hatch.

## Colleagues
Since saving runs through Lovable, colleagues who need to edit and publish must be invited to the Lovable project. Once invited, they use the same editor and the same single button — the GitHub credential stays on the workspace connection and is never handed out.

## Steps

### 1. Connect GitHub
Link the GitHub connector to this project so the server function can commit. This opens a connect card; authorise the `archer2005byte` account with repository write access.

### 2. Server function — `src/lib/publishDeck.functions.ts`
- `publishDeck` created with `createServerFn({ method: "POST" })`.
- Input validated with Zod: an object of `string -> string` overrides, plus an optional commit message.
- Handler reads `LOVABLE_API_KEY` and `GITHUB_API_KEY` inside the handler body, then, through the connector gateway:
  - `GET repos/{owner}/{repo}/contents/src/content/deck.overrides.json?ref=main` to read the current file SHA.
  - `PUT` the same path with the new base64 content, the SHA, and the commit message.
- Non-OK gateway responses are surfaced with status and body so failures are readable, not a generic 500.
- Returns the commit URL and the repo's Actions URL.

### 3. Editor UI — `src/routes/edit.tsx`
- Add a primary **Save & Publish** button in the editor toolbar, next to the existing actions.
- Wire it with `useServerFn(publishDeck)`, passing `contentStore.getOverrides()`.
- Button states: idle / saving / success (with "View build" link to Actions) / error (shows the returned message).
- Detect the static build: when running on GitHub Pages the button is replaced by the "Open in Lovable to save" note. Detection uses the existing `basePath` from `deck.config.ts` compared against `window.location.pathname`, evaluated after hydration.
- Keep **Copy JSON** and **Download JSON**; drop the now-redundant **Commit on GitHub** button from the Lovable view (it stays in the static-site fallback).

### 4. Local file stays in sync
After a successful commit, GitHub is the source of truth and Lovable's GitHub sync pulls the new `deck.overrides.json` back into the project automatically, so the editor and the repo do not drift.

## Technical notes
- The commit goes through the Lovable connector gateway at `https://connector-gateway.lovable.dev/github/...`; no GitHub token is stored in the app or in the browser.
- `LOVABLE_API_KEY` and `GITHUB_API_KEY` are read inside `.handler()`, never at module scope, and never reach client code.
- `publishDeck.functions.ts` stays a thin wrapper: only imports, types, and the exported server function; the gateway helper lives in a separate `.server.ts` module.
- No change to `vite.config.ts`, the Actions workflow, or the deployed site's structure.

## Verification
- `bun run build` succeeds and still prerenders `/` and `/edit/`.
- In the Lovable preview: change one string, click Save & Publish, confirm a new commit appears on `main` and the Actions run goes green.
