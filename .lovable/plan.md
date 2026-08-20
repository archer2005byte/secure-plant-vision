# Plan: A "presentation-content" skill for your editable presentation microsite

## What you're building

A microsite that hosts web-based presentations. The **coded structure is stable** (layout, slide mechanics, navigation, styling), but the **text content is editable** so you can revise wording and republish on demand.

The recurring job — "change some text, then republish" — is exactly what a skill is for: it's repeatable, it has a fixed schema, and there's a hard guardrail (don't restructure code for a content change). That's worth encoding as a skill so every future edit lands in the right place without the agent re-architecting the app.

## The architecture the skill assumes

Content and structure must be separated, or the skill has nothing stable to point at:

- **Structure (code, stable):** React components for slides, layout shell, navigation, transitions. Lives in `src/routes/` and `src/components/`.
- **Content (data, editable):** One content module per presentation — a typed data file (e.g. `src/content/<deck>.ts`) exporting an array of slide objects. Text lives here, not in JSX.
- **Schema:** a `Slide` type (title, subtitle, bullets, body, notes, optional media ref) defined once in `src/content/types.ts`. Adding a slide = adding one object to the array.
- **Republish:** since content is just code/data, editing + republish is the normal Lovable publish flow — no CMS, no database needed for a single-deck microsite. (If you later need non-technical editors or many decks, we revisit with Lovable Cloud; out of scope now.)

## The skill: `presentation-content`

**Purpose / when it triggers:** any task that touches presentation text — adding/editing/removing a slide, rewording copy, reordering slides, or republishing a deck.

**What the skill teaches a future agent:**

1. **Where content lives** — `src/content/<deck>.ts`, never inline in components. Map the exact file + the `Slide[]` shape.
2. **The content schema** — the `Slide` type and which fields are required vs. optional, so edits don't break typing.
3. **The edit workflow** — add/edit/remove/reorder slide objects; how to add a new deck; how to republish.
4. **The hard guardrail** — content changes touch ONLY `src/content/*` and `types.ts`. Never restructure components, routing, or styling for a wording change. If a change seems to need structure, surface that to the user rather than silently refactoring.
5. **Visual sanity check** — after a content edit, verify the deck still renders (build OK, no layout breakage) before declaring done.

**File layout:**

```
.agents/skills/presentation-content/
├── SKILL.md            # the workflow + guardrail, the high-leverage description
└── references/
    └── content-schema.md   # the Slide type + a worked before/after edit example
```

## Build steps

1. Build the presentation microsite itself at `/`:
   - Stable slide component + layout shell + keyboard/arrow navigation.
   - `src/content/types.ts` with the `Slide` type.
   - `src/content/home.ts` with a starter deck (a few real-ish slides) so `/` renders content from data, not hardcoded JSX.
2. Author the `presentation-content` skill draft under `.agents/skills/presentation-content/`.
3. Apply the skill so it's active and auto-surfaces on future content edits.

## Out of scope

- No database / auth / CMS for now (single-deck, code-as-content is the right starting point).
- No design-direction exploration here — we'll use the existing design tokens; a distinctive visual pass can be a separate step if you want it.
- The skill documents the workflow; it does not change the app at runtime.

## Open question for you

One thing decides the skill's schema: **does a slide ever need media** (images/video per slide), or is it text-only for now? I'll assume text + optional image ref unless you say otherwise.
