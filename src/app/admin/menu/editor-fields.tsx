"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownAZ, Plus, X } from "lucide-react";
import { formatPrice, parsePrice } from "@/lib/menu-model";

/** Editable draft of a price option: price kept as the typed string until save. */
export type OptionDraft = { key: string; label: string; price: string; isAddOn: boolean };

let seq = 0;
export const draftKey = () => `d${++seq}`;

export const toOptionDrafts = (o: { label: string; priceCents: number; isAddOn: boolean }[]): OptionDraft[] =>
  o.map((x) => ({ key: draftKey(), label: x.label, price: formatPrice(x.priceCents), isAddOn: x.isAddOn }));

/** Drafts → API payload, or an error message for the first bad row. */
export function fromOptionDrafts(drafts: OptionDraft[]) {
  const out: { label: string; priceCents: number; isAddOn: boolean }[] = [];
  for (const d of drafts) {
    if (!d.label.trim() && !d.price.trim()) continue;
    const cents = parsePrice(d.price);
    if (!d.label.trim()) return { error: "Every price option needs a label." };
    if (cents === null || Number.isNaN(cents)) return { error: `“${d.label}” needs a price like 1.25.` };
    out.push({ label: d.label.trim(), priceCents: cents, isAddOn: d.isAddOn });
  }
  return { options: out };
}

export const textareaClass =
  "w-full min-w-0 rounded-lg border border-input bg-card px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** "$" + text input that accepts 7.5 / 7.50 / $7.50. */
export function PriceInput({
  id,
  value,
  onChange,
  label,
  placeholder = "0.00",
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
}) {
  const bad = value.trim() !== "" && Number.isNaN(parsePrice(value));
  return (
    <div className="relative w-28 shrink-0 sm:w-auto">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" aria-hidden="true">
        $
      </span>
      <Input
        id={id}
        inputMode="decimal"
        aria-label={label}
        aria-invalid={bad || undefined}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 bg-card pl-5"
      />
    </div>
  );
}

/**
 * Rows of extra prices: add-ons ("Make it a malt +$1.00") or alternate prices
 * ("cup $6.50", "4 tenders $15.50").
 */
export function OptionsEditor({
  value,
  onChange,
  addLabel = "Add a price",
}: {
  value: OptionDraft[];
  onChange: (v: OptionDraft[]) => void;
  addLabel?: string;
}) {
  const set = (key: string, patch: Partial<OptionDraft>) => onChange(value.map((o) => (o.key === key ? { ...o, ...patch } : o)));
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="hidden grid-cols-[1fr_7rem_11rem_2rem] gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
          <span>Label</span>
          <span>Price</span>
          <span>Type</span>
          <span className="sr-only">Remove</span>
        </div>
      )}
      {value.map((o, i) => (
        <div key={o.key} className="grid grid-cols-[1fr_7rem] items-center gap-2 rounded-lg bg-muted/40 p-2 sm:grid-cols-[1fr_7rem_11rem_2rem] sm:bg-transparent sm:p-0">
          <Input
            aria-label={`Option ${i + 1} label`}
            value={o.label}
            placeholder="e.g. Add bacon"
            onChange={(e) => set(o.key, { label: e.target.value })}
            className="h-9 bg-card"
          />
          <PriceInput label={`Option ${i + 1} price`} value={o.price} onChange={(price) => set(o.key, { price })} />
          <div role="radiogroup" aria-label={`Option ${i + 1} type`} className="inline-flex rounded-lg bg-muted p-0.5 text-xs">
            {(
              [
                [true, "Add-on +"],
                [false, "Other size"],
              ] as const
            ).map(([add, text]) => (
              <button
                key={text}
                type="button"
                role="radio"
                aria-checked={o.isAddOn === add}
                onClick={() => set(o.key, { isAddOn: add })}
                className={`flex-1 rounded-md px-2 py-1.5 font-medium ${o.isAddOn === add ? "bg-card shadow-sm" : "text-muted-foreground"}`}
              >
                {text}
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove option ${o.label || i + 1}`}
            title="Remove"
            onClick={() => onChange(value.filter((x) => x.key !== o.key))}
            className="justify-self-end text-muted-foreground hover:text-destructive"
          >
            <X aria-hidden="true" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, { key: draftKey(), label: "", price: "", isAddOn: true }])}
      >
        <Plus aria-hidden="true" /> {addLabel}
      </Button>
    </div>
  );
}

export type ChoiceDraft = { name: string; ingredients: string[] };

const splitList = (raw: string) => raw.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);

/** Tag input for one flavor's ingredients: Enter or comma to add, paste a list, ✕ to remove. */
function IngredientsInput({
  flavor,
  value,
  onChange,
  suggestions,
}: {
  flavor: string;
  value: string[];
  onChange: (v: string[]) => void;
  suggestions: string[];
}) {
  const [draft, setDraft] = useState("");
  const listId = useId();
  const add = (raw: string) => {
    const next = [...value];
    for (const i of splitList(raw.toLowerCase())) if (!next.includes(i)) next.push(i);
    onChange(next);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      <ul className="flex flex-wrap gap-1.5" aria-label={`Ingredients in ${flavor}`}>
        {value.map((i) => (
          <li key={i} className="inline-flex items-center gap-1 rounded-md bg-ds-blue/10 py-0.5 pr-1 pl-2 text-sm text-ds-blue">
            {i}
            <button
              type="button"
              aria-label={`Remove ${i} from ${flavor}`}
              onClick={() => onChange(value.filter((x) => x !== i))}
              className="grid size-4 place-items-center rounded hover:bg-ds-blue/20"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </li>
        ))}
        {value.length === 0 && <li className="text-sm text-muted-foreground">No ingredients yet.</li>}
      </ul>
      <div className="flex gap-2">
        <Input
          aria-label={`Add an ingredient to ${flavor}`}
          list={listId}
          value={draft}
          placeholder="Add an ingredient and press Enter"
          onChange={(e) => {
            const v = e.target.value;
            if (v.endsWith(",")) add(v);
            else setDraft(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            }
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (/[\n,]/.test(text)) {
              e.preventDefault();
              add(draft + text);
            }
          }}
          className="h-9 flex-1 bg-card"
        />
        <Button type="button" variant="outline" className="h-9" onClick={() => add(draft)} disabled={!draft.trim()}>
          Add
        </Button>
      </div>
      <datalist id={listId}>
        {suggestions.filter((x) => !value.includes(x)).map((x) => (
          <option key={x} value={x} />
        ))}
      </datalist>
    </div>
  );
}

/**
 * Chip list for flavors / toppings / dressings. Type one and press Enter, or paste a comma- or
 * line-separated list. "*" marks house-made. Click a flavor to edit its ingredients, which
 * power ingredient search ("coconut" finds German Chocolate Cake) and allergy lookups.
 */
export function ChoicesEditor({ value, onChange, noun }: { value: ChoiceDraft[]; onChange: (v: ChoiceDraft[]) => void; noun: string }) {
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [copyFrom, setCopyFrom] = useState("");
  const inputId = useId();

  const add = (raw: string) => {
    const existing = new Set(value.map((v) => v.name.toLowerCase()));
    const next = [...value];
    for (const name of splitList(raw)) {
      if (!existing.has(name.toLowerCase())) {
        existing.add(name.toLowerCase());
        next.push({ name, ingredients: [] });
      }
    }
    onChange(next);
    setDraft("");
  };
  const setIngredients = (name: string, ingredients: string[]) =>
    onChange(value.map((c) => (c.name === name ? { ...c, ingredients } : c)));

  const f = filter.toLowerCase();
  const shown = f ? value.filter((v) => v.name.toLowerCase().includes(f) || v.ingredients.some((i) => i.includes(f))) : value;
  const plural = `${noun}${value.length === 1 ? "" : "s"}`;
  const tracked = value.some((c) => c.ingredients.length > 0);
  const missing = tracked ? value.filter((c) => c.ingredients.length === 0).length : 0;
  const suggestions = useMemo(() => [...new Set(value.flatMap((c) => c.ingredients))].sort(), [value]);
  const current = open ? value.find((c) => c.name === open) : null;

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={inputId} className="mb-1 block text-sm font-semibold">
          Add {noun}s
        </label>
        <div className="flex gap-2">
          <Input
            id={inputId}
            value={draft}
            placeholder={`Type a ${noun} and press Enter`}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add(draft);
              }
            }}
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              if (/[\n,]/.test(text)) {
                e.preventDefault();
                add(draft + text);
              }
            }}
            className="h-9 flex-1"
          />
          <Button type="button" variant="outline" className="h-9" onClick={() => add(draft)} disabled={!draft.trim()}>
            <Plus aria-hidden="true" /> Add
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Tip: paste a whole list separated by commas or new lines. Type * after a name to mark it house-made. Click a {noun} to edit its
          ingredients.
        </p>
      </div>

      <div className="rounded-xl border border-border">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
          <span className="text-sm font-semibold" aria-live="polite">
            {value.length} {plural}
          </span>
          {missing > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">{missing} without ingredients</span>
          )}
          <div className="ml-auto flex items-center gap-2">
            {value.length > 12 && (
              <Input
                aria-label={`Filter ${noun}s`}
                value={filter}
                placeholder="Filter by name or ingredient…"
                onChange={(e) => setFilter(e.target.value)}
                className="h-8 w-52"
              />
            )}
            {value.length > 1 && (
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange([...value].sort((a, b) => a.name.localeCompare(b.name)))}>
                <ArrowDownAZ aria-hidden="true" /> Sort A–Z
              </Button>
            )}
          </div>
        </div>
        {value.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">No {noun}s yet.</p>
        ) : (
          <ul className="flex max-h-72 flex-wrap gap-1.5 overflow-y-auto p-3">
            {shown.map((c) => {
              const on = open === c.name;
              return (
                <li
                  key={c.name}
                  className={`inline-flex items-center rounded-full border text-sm transition ${
                    on ? "border-ds-blue bg-ds-blue text-white" : "border-border bg-card"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : c.name)}
                    aria-expanded={on}
                    title="Edit ingredients"
                    className="inline-flex items-center gap-1.5 rounded-l-full py-0.5 pl-3"
                  >
                    {c.name}
                    {tracked && (
                      <span
                        className={`rounded-full px-1.5 text-[10px] font-semibold tabular-nums ${
                          on ? "bg-white/20" : c.ingredients.length ? "bg-muted text-muted-foreground" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {c.ingredients.length}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${c.name}`}
                    onClick={() => {
                      onChange(value.filter((v) => v.name !== c.name));
                      if (on) setOpen(null);
                    }}
                    className={`mx-1 grid size-5 place-items-center rounded-full ${on ? "hover:bg-white/20" : "text-muted-foreground hover:bg-red-100 hover:text-red-700"}`}
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
            {shown.length === 0 && <li className="text-sm text-muted-foreground">No matches.</li>}
          </ul>
        )}

        {current && (
          <div className="space-y-3 border-t border-border bg-muted/40 px-3 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">Ingredients in {current.name}</p>
              <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(null)}>
                Done
              </Button>
            </div>
            <IngredientsInput
              flavor={current.name}
              value={current.ingredients}
              onChange={(v) => setIngredients(current.name, v)}
              suggestions={suggestions}
            />
            {value.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>Copy from</span>
                <select
                  aria-label="Copy ingredients from another flavor"
                  value={copyFrom}
                  onChange={(e) => setCopyFrom(e.target.value)}
                  className="h-8 rounded-lg border border-input bg-card px-2 text-sm text-foreground"
                >
                  <option value="">another {noun}…</option>
                  {value
                    .filter((c) => c.name !== current.name && c.ingredients.length)
                    .map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                </select>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!copyFrom}
                  onClick={() => {
                    const src = value.find((c) => c.name === copyFrom);
                    if (src) setIngredients(current.name, [...new Set([...current.ingredients, ...src.ingredients])]);
                    setCopyFrom("");
                  }}
                >
                  Add them
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Used for the website’s flavor search and allergy lookups. Ingredient groups (Fruit, Nuts…) are set up under Menu → Search
              groups.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
