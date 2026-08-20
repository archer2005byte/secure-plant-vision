# Add "Edit this deck" link to the site footer

## Goal
Make the `/edit` route discoverable from the site itself, so the user (and collaborators) don't have to remember the `/edit` URL.

## Change
In `src/components/site/DeckBody.tsx`, add an "Edit this deck" link to the footer. It uses the `chrome` prop gate so it appears on the main deck but is hidden inside the editor's own preview (avoiding a recursive link).

```tsx
{chrome && (
  <a href={`${import.meta.env.BASE_URL}edit`} className="...">
    Edit this deck
  </a>
)}
```

`import.meta.env.BASE_URL` resolves to `/` on Lovable and to `/secure-plant-vision/` on GitHub Pages, so the link works in both environments without hardcoding a path.

## Files touched
- `src/components/site/DeckBody.tsx` — add the link to the footer row.

## Out of scope
- No changes to the editor itself, publishing flow, or content schema.
