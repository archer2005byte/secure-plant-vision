import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Download, RotateCcw, Save, Search, ClipboardCopy, Check, Github } from "lucide-react";

import { DeckBody } from "@/components/site/DeckBody";
import { contentStore } from "@/content/contentStore";
import { deckConfig, overridesEditUrl } from "@/content/deck.config";

export const Route = createFileRoute("/edit")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Deck content editor" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Edit the text of this deck in the browser." },
    ],
  }),
  component: EditorPage,
});

function useContentVersion() {
  return useSyncExternalStore(
    (listener) => contentStore.subscribe(listener),
    () => contentStore.getVersion(),
    () => 0,
  );
}

/** "sections.hero.headline" -> "Sections / Hero / Headline" */
function humanisePath(path: string) {
  return path
    .split(".")
    .map((part) =>
      /^\d+$/.test(part)
        ? `#${Number(part) + 1}`
        : part.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase()),
    )
    .join(" / ");
}

function groupLabel(path: string) {
  const [namespace, second] = path.split(".");
  return `${humanisePath(namespace ?? "")}${second && !/^\d+$/.test(second) ? ` / ${humanisePath(second)}` : ""}`;
}

function EditorPage() {
  const version = useContentVersion();
  const [query, setQuery] = useState("");
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const fields = useMemo(() => contentStore.fields(), [version]);

  useEffect(() => {
    contentStore.loadDraft();
  }, []);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const map = new Map<string, typeof fields>();
    for (const field of fields) {
      if (
        needle &&
        !field.value.toLowerCase().includes(needle) &&
        !field.path.toLowerCase().includes(needle)
      )
        continue;
      const label = groupLabel(field.path);
      const bucket = map.get(label) ?? [];
      bucket.push(field);
      map.set(label, bucket);
    }
    return [...map.entries()];
  }, [fields, query]);

  const changedCount = Object.keys(contentStore.getOverrides()).filter(
    (key) => contentStore.getOverrides()[key] !== contentStore.getCommitted()[key],
  ).length;

  const overridesJson = JSON.stringify(contentStore.getOverrides(), null, 2);

  const download = () => {
    const blob = new Blob([`${overridesJson}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "deck.overrides.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(overridesJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const save = () => {
    contentStore.saveDraft();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside className="flex h-full w-[26rem] shrink-0 flex-col border-r border-hairline bg-surface">
        <header className="border-b border-hairline px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Deck content editor
          </p>
          <h1 className="mt-1 text-lg font-semibold">{deckConfig.repoName}</h1>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Edit any text below. The deck on the right updates as you type. Nothing is published
            until you paste the JSON into <code>deck.overrides.json</code> on GitHub and commit
            it — the site rebuilds itself from there.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 border-b border-hairline px-4 py-3">
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-xs font-semibold text-background"
          >
            {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? "Saved" : "Save draft"}
          </button>
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-2 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Download JSON
          </button>
          <button
            type="button"
            onClick={copyJson}
            className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-2 text-xs font-semibold"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy JSON"}
          </button>
          <a
            href={overridesEditUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-2 text-xs font-semibold"
          >
            <Github className="h-3.5 w-3.5" />
            Commit on GitHub
          </a>
          <button
            type="button"
            onClick={() => contentStore.clearDraft()}
            className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-2 text-xs font-semibold text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset all
          </button>
          <p className="w-full text-xs text-muted-foreground">
            {changedCount === 0 ? "No changes yet" : `${changedCount} text change(s)`} ·{" "}
            {fields.length} editable fields
          </p>
        </div>

        <div className="border-b border-hairline px-4 py-2">
          <label className="flex items-center gap-2 rounded-md border border-hairline px-2 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the deck text…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {groups.map(([label, items]) => {
            const open = openGroup === label || Boolean(query.trim());
            return (
              <section key={label} className="mb-2 rounded-md border border-hairline bg-background">
                <button
                  type="button"
                  onClick={() => setOpenGroup(open && !query.trim() ? null : label)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold"
                >
                  <span>{label}</span>
                  <span className="text-xs font-normal text-muted-foreground">{items.length}</span>
                </button>
                {open && (
                  <div className="space-y-3 border-t border-hairline px-3 py-3">
                    {items.map((field) => {
                      const isChanged = field.value !== field.base;
                      return (
                        <div key={field.path}>
                          <div className="flex items-baseline justify-between gap-2">
                            <label
                              htmlFor={field.path}
                              className="text-[11px] font-medium text-muted-foreground"
                            >
                              {humanisePath(field.path.split(".").slice(2).join(".") || field.path)}
                            </label>
                            {isChanged && (
                              <button
                                type="button"
                                onClick={() => contentStore.setOverride(field.path, null)}
                                className="text-[11px] font-semibold text-brand"
                              >
                                revert
                              </button>
                            )}
                          </div>
                          <textarea
                            id={field.path}
                            value={field.value}
                            rows={Math.min(6, Math.ceil(field.value.length / 46) || 1)}
                            onChange={(event) =>
                              contentStore.setOverride(field.path, event.target.value)
                            }
                            className={`mt-1 w-full resize-y rounded-md border px-2 py-1.5 text-sm leading-snug outline-none ${
                              isChanged ? "border-brand" : "border-hairline"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
          {groups.length === 0 && (
            <p className="px-2 py-6 text-sm text-muted-foreground">No text matches that search.</p>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1 overflow-y-auto">
        <DeckBody key={version} chrome={false} />
      </div>
    </div>
  );
}
