# Making a new deck from this one

This repo is a reusable presentation template. The code (layout, diagrams, maps,
navigation) stays fixed; the **text** is a separate content layer.

## 1. Copy the repo

On GitHub: **Use this template** (or fork), name the new repo, e.g. `plant-vision-clientx`.

## 2. Point it at the new repo

Edit `src/content/deck.config.ts`:

```ts
export const deckConfig = {
  repoName: "plant-vision-clientx", // must match the GitHub repo name
  owner: "archer2005byte",
};
```

This drives the GitHub Pages sub-path, the canonical URL and the OG URL.
Then in the new repo: **Settings → Pages → Source = GitHub Actions**.

## 3. Edit the text in the browser

Open `/edit` on the running site (locally: `http://localhost:8080/edit`,
published: `https://<owner>.github.io/<repo>/edit/`).

- Every editable string in the deck is listed in the left panel, grouped by section.
- Search filters by text or field name.
- The deck on the right updates live as you type.
- **Save draft** keeps your edits in this browser only (nothing published).
- **Download JSON** (or **Copy JSON**) gives you `deck.overrides.json`.

## 4. Publish

Click **Copy JSON**, then **Commit on GitHub** in the editor — it opens
`src/content/deck.overrides.json` in GitHub's file editor. Select all, paste, and
**Commit changes**. (You can also drag the downloaded file into the repo instead.)

The Actions workflow rebuilds and republishes automatically. Green check in the
**Actions** tab = live. The workflow derives the Pages sub-path from the repo
name, so a copied repo needs no workflow edits.

## What lives where

| Layer | File(s) | Change when |
| --- | --- | --- |
| Text overrides | `src/content/deck.overrides.json` | Every new deck |
| Deck identity | `src/content/deck.config.ts` | Every new deck |
| Section headings/CTAs (defaults) | `src/content/sectionCopy.ts` | Changing the template's defaults |
| Structured content (defaults) | `src/components/site/*Data.ts` and inline `defineContent` blocks | Changing the template's defaults |
| Layout, diagrams, styling | `src/components/site/*.tsx`, `*.css` | Rarely — structural changes |

Overrides always win over defaults, so a new deck never needs to touch component code.
