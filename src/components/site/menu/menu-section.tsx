"use client";

import { useId, useMemo, useState } from "react";
import { matchChoice, searchKey, searchTerms, type ChoiceMatch, type MenuSectionDto, type SearchGroupDto } from "@/lib/menu-model";
import { ChoiceList, HouseMade, MenuItemRow, SectionHeader } from "./menu-parts";

/**
 * One menu section. Priced items list in two columns; items with choice lists
 * (shake tiers, dressings, toppings) render as cards. Sections with a lot of
 * choices get a search box ("Is there a key lime pie shake?").
 */
export function MenuSectionView({
  section,
  idPrefix,
  groups = [],
}: {
  section: MenuSectionDto;
  idPrefix: string;
  groups?: SearchGroupDto[];
}) {
  const plain = section.items.filter((i) => i.choices.length === 0);
  const lists = section.items.filter((i) => i.choices.length > 0);
  const totalChoices = lists.reduce((n, i) => n + i.choices.length, 0);

  return (
    <section id={`${idPrefix}-${section.slug}`} aria-labelledby={`${idPrefix}-${section.slug}-h`} className="scroll-mt-[var(--menu-anchor-offset,8rem)] py-12">
      <SectionHeader section={section} headingId={`${idPrefix}-${section.slug}-h`} />
      {plain.length > 0 && <ul className="grid gap-x-12 gap-y-5 md:grid-cols-2">{plain.map((i) => <MenuItemRow key={i.id} item={i} />)}</ul>}
      {lists.length > 0 &&
        (totalChoices > 30 ? (
          <SearchableLists section={section} groups={groups} />
        ) : (
          <ul className={`grid gap-6 ${plain.length ? "mt-8" : ""}`}>
            {lists.map((i) => (
              <ChoiceList key={i.id} item={i} />
            ))}
          </ul>
        ))}
      {section.note && (
        <p className="mt-8 text-center text-sm italic text-ds-ink/70">
          <HouseMade text={section.note} />
        </p>
      )}
    </section>
  );
}

function SearchableLists({ section, groups }: { section: MenuSectionDto; groups: SearchGroupDto[] }) {
  const [q, setQ] = useState("");
  const id = useId();
  const lists = section.items.filter((i) => i.choices.length > 0);
  const nouns = [...new Set(lists.map((i) => (i.choicesLabel ?? "choices").toLowerCase()))].join(" or ");

  const { matches, summary } = useMemo(() => {
    if (!searchKey(q)) return { matches: null, summary: "" };
    // Matches a flavor's name or any of its ingredients ("coconut" → German Chocolate Cake too);
    // group words expand one way ("chocolate" → hot fudge, brownie…; "nuts" → pecans, peanuts…).
    const terms = searchTerms(q, groups);
    const found = new Map<string, ChoiceMatch>();
    const where: string[] = [];
    for (const item of lists) {
      let n = 0;
      for (const c of item.choices) {
        const m = matchChoice(c, terms);
        if (m) {
          found.set(c.id, m);
          n++;
        }
      }
      if (n) where.push(`${n} in ${item.name}`);
    }
    return {
      matches: found,
      summary: found.size ? `${found.size} found: ${where.join(", ")}` : `No ${nouns} match “${q}”.`,
    };
  }, [q, lists, nouns, groups]);

  return (
    <>
      <div className="mx-auto mb-8 max-w-md">
        <label htmlFor={id} className="block text-center font-slab text-sm uppercase tracking-widest text-ds-blue mb-2">
          Find a flavor
        </label>
        <input
          id={id}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “cheesecake”, “coconut” or “nuts”"
          className="w-full rounded-full border-2 border-ds-ink/20 bg-white px-5 py-2.5 text-base outline-none focus-visible:border-ds-red focus-visible:ring-4 focus-visible:ring-ds-red/20"
        />
        <p aria-live="polite" className="mt-2 min-h-5 text-center text-sm italic text-ds-ink/70">
          {summary}
        </p>
        {groups.some((g) => g.showChip) && (
          <div className="mt-1 flex flex-wrap justify-center gap-1.5" role="group" aria-label="Quick searches">
            {groups
              .filter((g) => g.showChip)
              .map((g) => {
                const on = searchKey(q) === searchKey(g.name);
                return (
                  <button
                    key={g.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setQ(on ? "" : g.name)}
                    className={`rounded-full border px-3 py-1 font-slab text-xs uppercase tracking-wider transition ${
                      on ? "border-ds-red bg-ds-red text-white" : "border-ds-ink/20 bg-white/70 hover:border-ds-red hover:text-ds-red"
                    }`}
                  >
                    {g.name}
                  </button>
                );
              })}
          </div>
        )}
        <p className="mt-3 text-center text-xs text-ds-ink/55">
          Searches flavor names and ingredients. Allergies? Please confirm with us when you order.
        </p>
      </div>
      <ul className="grid gap-6">
        {lists.map((i) => (
          <ChoiceList key={i.id} item={i} highlight={matches} />
        ))}
      </ul>
    </>
  );
}
