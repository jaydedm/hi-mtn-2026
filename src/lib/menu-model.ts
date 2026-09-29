import type { MenuType } from "@/lib/menu-schedule";

/**
 * Online menu types, formatting, filtering and input validation. Pure and
 * client-safe; the database access lives in `menu-data.ts`.
 */

export type MenuOptionDto = { id: string; label: string; priceCents: number; isAddOn: boolean };
export type MenuChoiceDto = { id: string; name: string; ingredients: string[] };
export type MenuItemDto = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number | null;
  choicesLabel: string | null;
  onLunch: boolean;
  onAfterHours: boolean;
  isAvailable: boolean;
  options: MenuOptionDto[];
  choices: MenuChoiceDto[];
};
export type MenuSectionDto = {
  id: string;
  slug: string;
  title: string;
  intro: string | null;
  note: string | null;
  isVisible: boolean;
  options: MenuOptionDto[];
  items: MenuItemDto[];
};

// ---------- prices ----------

/** 750 → "7.50" */
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** "7.5" / "$7.50" / "7" → 750; "" → null; anything else → NaN. */
export function parsePrice(input: string): number | null {
  const s = input.trim().replace(/^\$/, "");
  if (s === "") return null;
  if (!/^\d{1,4}(\.\d{0,2})?$/.test(s)) return NaN;
  return Math.round(parseFloat(s) * 100);
}

/** "Add bacon +3.00" / "cup 6.50" as display text (without the currency sign). */
export function optionPriceLabel(o: Pick<MenuOptionDto, "priceCents" | "isAddOn">) {
  return `${o.isAddOn ? "+" : ""}${formatPrice(o.priceCents)}`;
}

// ---------- filtering ----------

export function isOnMenu(item: MenuItemDto, type: MenuType) {
  return item.isAvailable && (type === "lunch" ? item.onLunch : item.onAfterHours);
}

/** Visible sections with only the items served on `type`; empty sections dropped. */
export function sectionsForMenu(sections: MenuSectionDto[], type: MenuType): MenuSectionDto[] {
  return sections
    .filter((s) => s.isVisible)
    .map((s) => ({ ...s, items: s.items.filter((i) => isOnMenu(i, type)) }))
    .filter((s) => s.items.length > 0);
}

/** Lowercased, accent/®/*-free text for flavor search. "Piña Colada®" → "pina colada" */
export function searchKey(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[®™*]/g, "")
    .replace(/[’']/g, "'")
    .toLowerCase()
    .trim();
}

/** A run of text; `houseMade` runs get the house icon placed before them. */
export type TextRun = { text: string; houseMade: boolean };

// A house-made term starts after the last list separator or connecting word before its "*".
const TERM_START = /^([^]*(?:[,;:(]|\b(?:or|and|with|in|on|of|our|plus)\b)\s*)([^]*)$/i;

/**
 * Splits text on "*" markers into runs, isolating the term each "*" follows so the icon can
 * sit in front of it: "scone, chili*, greens" → ["scone, ", chili (house-made), ", greens"].
 */
export function houseMadeRuns(text: string): TextRun[] {
  const parts = text.split("*");
  const runs: TextRun[] = [];
  parts.forEach((part, i) => {
    if (i === parts.length - 1) {
      if (part) runs.push({ text: part, houseMade: false });
      return;
    }
    const m = part.match(TERM_START);
    const [before, term] = m ? [m[1], m[2]] : ["", part];
    const lead = term.match(/^\s*/)![0];
    if (before + lead) runs.push({ text: before + lead, houseMade: false });
    if (term.trim()) runs.push({ text: term.trim(), houseMade: true });
  });
  return runs;
}

export function slugify(s: string) {
  return (
    searchKey(s)
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "section"
  );
}

// ---------- validation (shared by admin UI and API) ----------

export const LIMITS = { name: 80, description: 500, label: 40, intro: 1000, choices: 200, options: 20, ingredients: 30, maxCents: 100_000 };

export type OptionInput = { label: string; priceCents: number; isAddOn: boolean };
export type ItemInput = {
  name: string;
  description: string | null;
  priceCents: number | null;
  choicesLabel: string | null;
  onLunch: boolean;
  onAfterHours: boolean;
  isAvailable: boolean;
  options: OptionInput[];
  choices: ChoiceInput[];
};
export type ChoiceInput = { name: string; ingredients: string[] };
export type SectionInput = {
  title: string;
  intro: string | null;
  note: string | null;
  isVisible: boolean;
  options: OptionInput[];
};

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const optStr = (v: unknown) => str(v) || null;
const validCents = (v: unknown): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= LIMITS.maxCents;

function validateOptions(raw: unknown): Result<OptionInput[]> {
  if (raw === undefined) return { ok: true, value: [] };
  if (!Array.isArray(raw) || raw.length > LIMITS.options) return { ok: false, error: "Too many price options." };
  const out: OptionInput[] = [];
  for (const o of raw) {
    const label = str(o?.label);
    if (!label || label.length > LIMITS.label) return { ok: false, error: "Each price option needs a short label." };
    if (!validCents(o?.priceCents)) return { ok: false, error: `“${label}” needs a valid price.` };
    out.push({ label, priceCents: o.priceCents, isAddOn: o?.isAddOn !== false });
  }
  return { ok: true, value: out };
}

export function validateItemInput(raw: unknown): Result<ItemInput> {
  const r = (raw ?? {}) as Record<string, unknown>;
  const name = str(r.name);
  if (!name) return { ok: false, error: "Name is required." };
  if (name.length > LIMITS.name) return { ok: false, error: "Name is too long." };
  const description = optStr(r.description);
  if (description && description.length > LIMITS.description) return { ok: false, error: "Description is too long." };
  const priceCents = r.priceCents ?? null;
  if (priceCents !== null && !validCents(priceCents)) return { ok: false, error: "Price must be between 0 and 1000." };
  const choicesLabel = optStr(r.choicesLabel);
  if (choicesLabel && choicesLabel.length > LIMITS.label) return { ok: false, error: "List heading is too long." };

  const options = validateOptions(r.options);
  if (!options.ok) return options;

  const rawChoices = r.choices ?? [];
  if (!Array.isArray(rawChoices) || rawChoices.length > LIMITS.choices) return { ok: false, error: "Too many choices." };
  const seen = new Set<string>();
  const choices: ChoiceInput[] = [];
  // Each choice is a name string, or { name, ingredients } for flavors with ingredients.
  for (const c of rawChoices) {
    const obj = c && typeof c === "object" ? (c as Record<string, unknown>) : null;
    const n = str(obj ? obj.name : c);
    if (!n) continue;
    if (n.length > LIMITS.name) return { ok: false, error: `“${n.slice(0, 20)}…” is too long.` };
    const k = searchKey(n);
    if (seen.has(k)) continue;
    seen.add(k);
    const rawIng = obj?.ingredients ?? [];
    if (!Array.isArray(rawIng) || rawIng.length > LIMITS.ingredients) return { ok: false, error: `“${n}” has too many ingredients.` };
    const ingSeen = new Set<string>();
    const ingredients: string[] = [];
    for (const i of rawIng) {
      const v = str(i).toLowerCase();
      if (!v || ingSeen.has(v)) continue;
      if (v.length > LIMITS.label) return { ok: false, error: `Ingredient “${v.slice(0, 20)}…” is too long.` };
      ingSeen.add(v);
      ingredients.push(v);
    }
    choices.push({ name: n, ingredients });
  }

  return {
    ok: true,
    value: {
      name,
      description,
      priceCents: priceCents as number | null,
      choicesLabel: choicesLabel ?? (choices.length ? "Choices" : null),
      onLunch: r.onLunch !== false,
      onAfterHours: r.onAfterHours === true,
      isAvailable: r.isAvailable !== false,
      options: options.value,
      choices,
    },
  };
}

export function validateSectionInput(raw: unknown): Result<SectionInput> {
  const r = (raw ?? {}) as Record<string, unknown>;
  const title = str(r.title);
  if (!title) return { ok: false, error: "Title is required." };
  if (title.length > LIMITS.name) return { ok: false, error: "Title is too long." };
  const intro = optStr(r.intro);
  const note = optStr(r.note);
  if ((intro?.length ?? 0) > LIMITS.intro || (note?.length ?? 0) > LIMITS.intro)
    return { ok: false, error: "Intro or note is too long." };
  const options = validateOptions(r.options);
  if (!options.ok) return options;
  return { ok: true, value: { title, intro, note, isVisible: r.isVisible !== false, options: options.value } };
}

/** Validates a reorder payload: a non-empty list of unique ids. */
export function validateIds(raw: unknown): Result<string[]> {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 500) return { ok: false, error: "Invalid order." };
  if (!raw.every((id) => typeof id === "string" && id.length > 0 && id.length < 64))
    return { ok: false, error: "Invalid order." };
  if (new Set(raw).size !== raw.length) return { ok: false, error: "Duplicate ids." };
  return { ok: true, value: raw as string[] };
}

/** Admin-editable search group, e.g. Nuts → [tree nuts, peanuts]; Fruit → [strawberry, banana…]. */
export type SearchGroupDto = { id: string; name: string; keywords: string[]; members: string[]; showChip: boolean };

/** "berries" → "berry", "cherries" → "cherry", "pecans" → "pecan" (enough for menu words). */
const singular = (w: string) => (w.endsWith("ies") ? `${w.slice(0, -3)}y` : w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);
/** Search-normalized text with each word singularized, for plural-insensitive matching. */
export const normTerm = (t: string) => searchKey(t).trim().split(/\s+/).map(singular).join(" ");

/**
 * The terms a query should match: the query itself, plus, when it names a group (by name or
 * keyword), every member of that group. Members may name other groups (Nuts → Tree nuts,
 * Peanuts), which expand too. Expansion is one-way: "chocolate" pulls in hot fudge, but
 * "hot fudge" is just hot fudge.
 */
export function searchTerms(query: string, groups: SearchGroupDto[] = []): string[] {
  const q = normTerm(query);
  if (!q) return [];
  const byWord = new Map<string, SearchGroupDto>();
  for (const g of groups) for (const w of [g.name, ...g.keywords]) if (normTerm(w)) byWord.set(normTerm(w), g);
  const terms = new Set([q]);
  const seen = new Set<string>();
  const expand = (g: SearchGroupDto) => {
    if (seen.has(g.id)) return;
    seen.add(g.id);
    for (const m of g.members) {
      const t = normTerm(m);
      if (!t) continue;
      const nested = byWord.get(t);
      // A member naming another group expands it; a member that's this group's own word is a plain term.
      if (nested && nested.id !== g.id) expand(nested);
      else terms.add(t);
    }
  };
  const g = byWord.get(q);
  if (g) expand(g);
  return [...terms];
}

export type ChoiceMatch = { name: boolean; ingredients: string[] };

/**
 * Does a menu choice match any of the search terms (from `searchTerms`)? Checks the choice's
 * name and each ingredient. Terms match at the start of a word, plurals ignored, so "nut"
 * doesn't match "coconut" and "pecan" matches "pecans". Returns which ingredients matched.
 */
export function matchChoice(choice: { name: string; ingredients?: string[] }, terms: string[]): ChoiceMatch | null {
  if (!terms.length) return null;
  const hit = (text: string) => {
    const t = ` ${normTerm(text)}`;
    return terms.some((term) => t.includes(` ${term}`));
  };
  const name = hit(choice.name);
  const ingredients = (choice.ingredients ?? []).filter(hit);
  return name || ingredients.length ? { name, ingredients } : null;
}

/** Validates the admin's full list of search groups (PUT /api/search-groups). */
export function validateSearchGroups(raw: unknown): Result<Omit<SearchGroupDto, "id">[]> {
  if (!Array.isArray(raw) || raw.length > 50) return { ok: false, error: "Too many search groups." };
  const seen = new Set<string>();
  const words = (v: unknown, what: string, max: number): Result<string[]> => {
    if (v === undefined) return { ok: true, value: [] };
    if (!Array.isArray(v) || v.length > max) return { ok: false, error: `Too many ${what}.` };
    const out = [...new Set(v.map((x) => str(x).toLowerCase()).filter(Boolean))];
    if (out.some((x) => x.length > LIMITS.label)) return { ok: false, error: `One of the ${what} is too long.` };
    return { ok: true, value: out };
  };
  const out: Omit<SearchGroupDto, "id">[] = [];
  for (const g of raw) {
    const r = (g ?? {}) as Record<string, unknown>;
    const name = str(r.name);
    if (!name || name.length > LIMITS.label) return { ok: false, error: "Every group needs a short name." };
    const key = normTerm(name);
    if (seen.has(key)) return { ok: false, error: `There are two groups called “${name}”.` };
    seen.add(key);
    const keywords = words(r.keywords, "other words", 20);
    if (!keywords.ok) return keywords;
    const members = words(r.members, "ingredients", 100);
    if (!members.ok) return members;
    if (!members.value.length) return { ok: false, error: `“${name}” needs at least one ingredient.` };
    out.push({ name, keywords: keywords.value, members: members.value, showChip: r.showChip !== false });
  }
  return { ok: true, value: out };
}
