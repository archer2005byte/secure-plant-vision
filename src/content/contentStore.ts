/**
 * Deck content layer.
 *
 * Every editable string in the deck is registered here through `defineContent`.
 * Components keep their own structure (icons, colours, coordinates, layout);
 * only string leaves are made overridable.
 *
 * Overrides are a flat map of `namespace.path.to.string` -> replacement text and
 * live in `src/content/deck.overrides.json`. That single JSON file is the whole
 * content payload of a deck: swap it and you have a new deck.
 */

import committedOverrides from "./deck.overrides.json";

export type Overrides = Record<string, string>;

const DRAFT_KEY = "deck-content-draft";

let current: Overrides = { ...(committedOverrides as Overrides) };
const committed: Overrides = { ...(committedOverrides as Overrides) };
const listeners = new Set<() => void>();
let version = 0;

/** Base (unedited) string values, discovered as content modules register. */
const baseValues = new Map<string, string>();
const registeredNamespaces = new Set<string>();

function notify() {
  version += 1;
  listeners.forEach((listener) => listener());
}

export const contentStore = {
  getVersion: () => version,
  getCommitted: () => ({ ...committed }),
  getOverrides: () => ({ ...current }),
  setOverrides(next: Overrides) {
    current = { ...next };
    notify();
  },
  setOverride(path: string, value: string | null) {
    const next = { ...current };
    if (value === null) delete next[path];
    else next[path] = value;
    current = next;
    notify();
  },
  reset() {
    current = { ...committed };
    notify();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** Editable string fields, in registration order. */
  fields(): { path: string; base: string; value: string }[] {
    return [...baseValues.entries()].map(([path, base]) => ({
      path,
      base,
      value: current[path] ?? base,
    }));
  },
  namespaces: () => [...registeredNamespaces],
  saveDraft() {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(current));
  },
  loadDraft() {
    if (typeof window === "undefined") return false;
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw) as Overrides;
      current = { ...committed, ...parsed };
      notify();
      return true;
    } catch {
      return false;
    }
  },
  clearDraft() {
    if (typeof window !== "undefined") window.localStorage.removeItem(DRAFT_KEY);
    contentStore.reset();
  },
};

function isPlainContainer(value: unknown): value is Record<string, unknown> | unknown[] {
  if (Array.isArray(value)) return true;
  if (typeof value !== "object" || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function wrap<T>(path: string, value: T): T {
  if (typeof value === "string") {
    return (current[path] ?? value) as unknown as T;
  }
  if (!isPlainContainer(value)) return value;

  return new Proxy(value as object, {
    get(target, prop, receiver) {
      const raw = Reflect.get(target, prop, receiver);
      if (typeof prop === "symbol") return raw;
      if (typeof raw === "function") return raw.bind(target);
      return wrap(`${path}.${prop}`, raw);
    },
  }) as T;
}

function collect(path: string, value: unknown) {
  if (typeof value === "string") {
    baseValues.set(path, value);
    return;
  }
  if (!isPlainContainer(value)) return;
  for (const [key, child] of Object.entries(value)) collect(`${path}.${key}`, child);
}

/**
 * Register a content object and return an overridable view of it.
 * Non-string values (icons, colours, coordinates, numbers) pass through untouched.
 */
export function defineContent<T>(namespace: string, base: T): T {
  registeredNamespaces.add(namespace);
  collect(namespace, base);
  return wrap(namespace, base);
}
