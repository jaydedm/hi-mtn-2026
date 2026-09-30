"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { matchChoice, normTerm, searchTerms, type SearchGroupDto } from "@/lib/menu-model";
import { Panel, SaveToast, type SaveState } from "../../_components/ui";

export type Flavor = { name: string; list: string; ingredients: string[] };
type Draft = SearchGroupDto & { key: string };

let seq = 0;
const newKey = () => `new-${++seq}`;
const toDrafts = (g: SearchGroupDto[]): Draft[] => g.map((x) => ({ ...x, key: x.id }));

/** Tag input: Enter or comma adds, paste a list, ✕ removes. Suggestions via <datalist>. */
function TagInput({
  label,
  value,
  onChange,
  suggestions = [],
  placeholder,
  tone = "neutral",
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  suggestions?: string[];
  placeholder: string;
  tone?: "neutral" | "blue";
}) {
  const [draft, setDraft] = useState("");
  const id = useId();
  const add = (raw: string) => {
    const next = [...value];
    for (const w of raw.toLowerCase().split(/[\n,]/).map((x) => x.trim()).filter(Boolean)) if (!next.includes(w)) next.push(w);
    onChange(next);
    setDraft("");
  };
  const chip = tone === "blue" ? "bg-ds-secondary/10 text-ds-secondary" : "bg-muted text-foreground";
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {value.map((w) => (
            <li key={w} className={`inline-flex items-center gap-1 rounded-md py-0.5 pr-1 pl-2 text-sm ${chip}`}>
              {w}
              <button type="button" aria-label={`Remove ${w}`} onClick={() => onChange(value.filter((x) => x !== w))} className="grid size-4 place-items-center rounded hover:bg-black/10">
                <X className="size-3" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Input
        id={id}
        list={`${id}-list`}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => (e.target.value.endsWith(",") ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          }
        }}
        onBlur={() => draft.trim() && add(draft)}
        onPaste={(e) => {
          const t = e.clipboardData.getData("text");
          if (/[\n,]/.test(t)) {
            e.preventDefault();
            add(draft + t);
          }
        }}
        className="h-9 bg-card"
      />
      <datalist id={`${id}-list`}>
        {suggestions.filter((s) => !value.includes(s)).map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
}

export function SearchGroupsEditor({ initial, flavors }: { initial: SearchGroupDto[]; flavors: Flavor[] }) {
  const [saved, setSaved] = useState<Draft[]>(() => toDrafts(initial));
  const [groups, setGroups] = useState<Draft[]>(saved);
  const [test, setTest] = useState("");
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const dismiss = useCallback(() => setSave({ kind: "idle" }), []);

  const strip = (g: Draft[]) => g.map(({ name, keywords, members, showChip }) => ({ name, keywords, members, showChip }));
  const dirty = JSON.stringify(strip(groups)) !== JSON.stringify(strip(saved));
  const patch = (key: string, p: Partial<Draft>) => setGroups((gs) => gs.map((g) => (g.key === key ? { ...g, ...p } : g)));
  const move = (i: number, dir: -1 | 1) =>
    setGroups((gs) => {
      const next = [...gs];
      [next[i], next[i + dir]] = [next[i + dir], next[i]];
      return next;
    });

  const allIngredients = useMemo(() => [...new Set(flavors.flatMap((f) => f.ingredients))].sort(), [flavors]);
  const groupNames = groups.map((g) => g.name.toLowerCase()).filter(Boolean);
  const memberSuggestions = [...new Set([...groupNames, ...allIngredients])];

  // Ingredients no group reaches, so a new one (say, macadamia) doesn't go unnoticed.
  const unassigned = useMemo(() => {
    const terms = new Set(groups.flatMap((g) => searchTerms(g.name, groups)));
    const covered = (ing: string) => [...terms].some((t) => ` ${normTerm(ing)}`.includes(` ${t}`));
    return allIngredients.filter((i) => !covered(i));
  }, [groups, allIngredients]);

  const results = useMemo(() => {
    const terms = searchTerms(test, groups);
    if (!terms.length) return null;
    return { terms, hits: flavors.map((f) => ({ f, m: matchChoice(f, terms) })).filter((x) => x.m) };
  }, [test, groups, flavors]);

  const submit = async () => {
    setSave({ kind: "saving" });
    try {
      const res = await fetch("/api/search-groups", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groups: strip(groups) }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Couldn’t save. Please try again.");
      const next = toDrafts(body.groups);
      setSaved(next);
      setGroups(next);
      setSave({ kind: "saved" });
    } catch (e) {
      setSave({ kind: "error", message: e instanceof Error ? e.message : "Couldn’t save. Please try again." });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="space-y-4">
        {groups.map((g, i) => {
          const nested = g.members.filter((m) => groupNames.includes(m) && m !== g.name.toLowerCase());
          return (
            <Panel
              key={g.key}
              title={
                <span className="flex items-center gap-2">
                  {g.name || "New group"}
                  {nested.length > 0 && <span className="text-xs font-normal text-muted-foreground">includes {nested.join(", ")}</span>}
                </span>
              }
              actions={
                <>
                  <Button size="icon-sm" variant="ghost" disabled={i === 0} aria-label={`Move ${g.name} up`} onClick={() => move(i, -1)}>
                    <ArrowUp aria-hidden="true" />
                  </Button>
                  <Button size="icon-sm" variant="ghost" disabled={i === groups.length - 1} aria-label={`Move ${g.name} down`} onClick={() => move(i, 1)}>
                    <ArrowDown aria-hidden="true" />
                  </Button>
                  <Button size="icon-sm" variant="ghost" aria-label={`Delete ${g.name}`} className="text-muted-foreground hover:text-destructive" onClick={() => setGroups((gs) => gs.filter((x) => x.key !== g.key))}>
                    <Trash2 aria-hidden="true" />
                  </Button>
                </>
              }
            >
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
                  <label className="text-sm font-medium">
                    Group name
                    <Input value={g.name} onChange={(e) => patch(g.key, { name: e.target.value })} placeholder="e.g. Nuts" className="mt-1 h-9 bg-card" />
                  </label>
                  <TagInput
                    label="Other words people might search"
                    value={g.keywords}
                    onChange={(keywords) => patch(g.key, { keywords })}
                    placeholder="e.g. nut, tree nut"
                  />
                </div>
                <TagInput
                  label="Ingredients in this group"
                  tone="blue"
                  value={g.members}
                  onChange={(members) => patch(g.key, { members })}
                  suggestions={memberSuggestions}
                  placeholder="Type an ingredient (or another group’s name) and press Enter"
                />
                <p className="-mt-2 text-xs text-muted-foreground">
                  Matches the start of any ingredient word, plurals included: “cherry” covers cherry syrup and maraschino cherries.
                </p>
                <label className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2">
                  <span className="text-sm">Show as a quick-search button on the website</span>
                  <Switch checked={g.showChip} onCheckedChange={(showChip) => patch(g.key, { showChip })} aria-label={`Show ${g.name} as a quick search`} />
                </label>
              </div>
            </Panel>
          );
        })}
        <Button
          variant="outline"
          onClick={() => setGroups((gs) => [...gs, { key: newKey(), id: "", name: "", keywords: [], members: [], showChip: true }])}
        >
          <Plus aria-hidden="true" /> New group
        </Button>
      </div>

      <div className="space-y-4 lg:sticky lg:top-10">
        <Panel title="Test a search" description="See exactly what visitors get. Uses your unsaved changes.">
          <label className="relative block">
            <span className="sr-only">Test search</span>
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input value={test} onChange={(e) => setTest(e.target.value)} placeholder="Try fruit, nuts, hot fudge…" className="h-9 pl-8" />
          </label>
          {results && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold">
                {results.hits.length} flavor{results.hits.length === 1 ? "" : "s"}
              </p>
              {results.terms.length > 1 && <p className="text-xs text-muted-foreground">Looks for: {results.terms.join(", ")}</p>}
              <ul className="max-h-80 space-y-1 overflow-y-auto text-sm">
                {results.hits.map(({ f, m }) => (
                  <li key={`${f.list}-${f.name}`} className="flex justify-between gap-2">
                    <span>{f.name}</span>
                    <span className="truncate text-right text-xs text-muted-foreground">{m!.name ? "name" : m!.ingredients.join(", ")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>

        <Panel title="Not in any group" description="Ingredients no group covers. Add any that visitors might search for.">
          {unassigned.length ? (
            <ul className="flex flex-wrap gap-1.5">
              {unassigned.map((i) => (
                <li key={i} className="rounded-md bg-amber-50 px-2 py-0.5 text-sm text-amber-900 ring-1 ring-amber-200">
                  {i}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-emerald-700">Every ingredient is in at least one group.</p>
          )}
        </Panel>

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
          <span className="text-sm text-muted-foreground">{dirty ? "Unsaved changes" : "All changes saved"}</span>
          <div className="ml-auto flex gap-2">
            {dirty && (
              <Button variant="ghost" onClick={() => setGroups(saved)}>
                Discard
              </Button>
            )}
            <Button onClick={submit} disabled={!dirty || save.kind === "saving"}>
              {save.kind === "saving" ? "Saving…" : "Save groups"}
            </Button>
          </div>
        </div>
      </div>

      <SaveToast state={save} onDismiss={dismiss} />
    </div>
  );
}
