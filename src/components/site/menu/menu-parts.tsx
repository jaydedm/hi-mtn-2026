import { Fragment } from "react";
import { formatPrice, optionPriceLabel, houseMadeRuns, type ChoiceMatch, type MenuItemDto, type MenuSectionDto } from "@/lib/menu-model";

/** Little house with a heart in the window: marks house-made items. Decorative unless `label` is set. */
export function HouseIcon({ className = "", label }: { className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`inline-block h-[0.95em] w-[0.95em] ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {label && <title>{label}</title>}
      <path d="M8 1.6 1.4 7.2a.9.9 0 0 0 1.2 1.3l.4-.3v5.6c0 .6.5 1 1 1h8c.5 0 1-.4 1-1V8.2l.4.3a.9.9 0 0 0 1.2-1.3Z" fill="currentColor" />
      <path d="M8 12.3s-2.3-1.4-2.3-2.9c0-.8.6-1.3 1.2-1.3.5 0 .9.3 1.1.7.2-.4.6-.7 1.1-.7.6 0 1.2.5 1.2 1.3 0 1.5-2.3 2.9-2.3 2.9Z" className="fill-ds-paper" />
    </svg>
  );
}

/** Text with each "*"-marked term prefixed by the house icon. */
export function HouseMade({ text }: { text: string }) {
  return (
    <>
      {houseMadeRuns(text).map((r, i) =>
        r.houseMade ? (
          <span key={i} className="whitespace-nowrap">
            <span className="mr-0.5 inline-block -translate-y-px text-(--m-accent) not-italic" title="House-made">
              <HouseIcon />
              <span className="sr-only">(house-made) </span>
            </span>
            {r.text}
          </span>
        ) : (
          <Fragment key={i}>{r.text}</Fragment>
        ),
      )}
    </>
  );
}

/** Menu-board price: 7<sup>50</sup>, read as "$7.50". */
export function Price({ cents, plus = false, className = "" }: { cents: number; plus?: boolean; className?: string }) {
  const [d, c] = formatPrice(cents).split(".");
  return (
    <span className={`font-label whitespace-nowrap ${className}`}>
      <span className="sr-only">
        {plus ? "plus " : ""}${formatPrice(cents)}
      </span>
      <span aria-hidden="true">
        {plus ? "+" : ""}
        {d}
        <sup className="text-[0.6em] align-[0.6em] ml-px">{c}</sup>
      </span>
    </span>
  );
}

/** "HAMBURGER ········ 7.50" with a dotted leader. */
function NameLine({ name, cents }: { name: string; cents: number | null }) {
  return (
    <div className="flex items-baseline gap-2">
      <h3 className="font-label text-lg uppercase tracking-wide leading-tight">{name}</h3>
      {cents !== null && (
        <>
          <span className="flex-1 min-w-4 border-b-2 border-dotted border-ds-ink/35 translate-y-[-0.3em]" aria-hidden="true" />
          <Price cents={cents} className="text-lg" />
        </>
      )}
    </div>
  );
}

function Options({ options }: { options: MenuItemDto["options"] }) {
  if (!options.length) return null;
  return (
    <ul className="mt-1 space-y-0.5 text-sm">
      {options.map((o) => (
        <li key={o.id} className="flex items-baseline gap-2 italic">
          <span>{o.label}</span>
          <span className="flex-1 min-w-4 border-b border-dotted border-ds-ink/25" aria-hidden="true" />
          <Price cents={o.priceCents} plus={o.isAddOn} className="not-italic text-ds-secondary" />
        </li>
      ))}
    </ul>
  );
}

/** A plain priced item: name, price, ingredients, alternate prices. */
export function MenuItemRow({ item }: { item: MenuItemDto }) {
  return (
    <li className="break-inside-avoid">
      <NameLine name={item.name} cents={item.priceCents} />
      {item.description && (
        <p className="italic text-ds-ink/75 leading-snug">
          <HouseMade text={item.description} />
        </p>
      )}
      <Options options={item.options} />
    </li>
  );
}

/**
 * An item with a list (shake tiers, dressings, sundae toppings). Priced lists get a
 * card with the price up top; unpriced lists render as a quiet chip cloud.
 * `highlight` (choice id → match) dims non-matching choices and notes ingredient-only matches.
 */
export function ChoiceList({ item, highlight }: { item: MenuItemDto; highlight?: Map<string, ChoiceMatch> | null }) {
  const priced = item.priceCents !== null || item.options.length > 0;
  return (
    <li className={`break-inside-avoid ${priced ? "rounded-2xl bg-ds-card/70 p-5 ring-2 ring-ds-ink/10 shadow-sm" : ""}`}>
      {priced ? (
        <NameLine name={item.name} cents={item.priceCents} />
      ) : (
        <h3 className="font-label text-sm uppercase tracking-[0.2em] text-ds-secondary">{item.name}</h3>
      )}
      {item.description && (
        <p className="italic text-ds-ink/75">
          <HouseMade text={item.description} />
        </p>
      )}
      <Options options={item.options} />
      <p className="sr-only">
        {item.choices.length} {item.choicesLabel ?? "choices"}:
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {item.choices.map((c) => {
          const m = highlight?.get(c.id);
          const dim = highlight && !m;
          const via = m && !m.name && m.ingredients.length ? m.ingredients.join(", ") : null;
          return (
            <li
              key={c.id}
              className={`rounded-sm border px-2 py-0.5 text-sm italic transition ${
                dim ? "border-transparent opacity-25" : highlight ? "border-(--m-accent) bg-(--m-hit)" : "border-ds-ink/15 bg-ds-paper"
              }`}
            >
              <HouseMade text={c.name} />
              {via && <span className="ml-1 text-xs not-italic text-ds-ink/70">(has {via})</span>}
            </li>
          );
        })}
      </ul>
    </li>
  );
}

/** Section heading with dotted rules, the intro, and section-wide add-ons. */
export function SectionHeader({ section, headingId }: { section: MenuSectionDto; headingId?: string }) {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center gap-4">
        <span className="flex-1 border-b-4 border-dotted border-ds-ink/60" aria-hidden="true" />
        <h2 id={headingId} className="font-label text-3xl md:text-4xl uppercase text-ds-ink">{section.title}</h2>
        <span className="flex-1 border-b-4 border-dotted border-ds-ink/60" aria-hidden="true" />
      </div>
      {section.intro && <p className="mx-auto mt-4 max-w-2xl text-ds-ink/80">{section.intro}</p>}
      {section.options.length > 0 && (
        <p className="mt-3 flex flex-wrap justify-center gap-2">
          {section.options.map((o) => (
            <span key={o.id} className="ds-hut bg-ds-highlight/60 px-3 pb-0.5 font-label text-sm">
              {o.label} <span aria-hidden="true">{optionPriceLabel(o)}</span>
              <span className="sr-only">
                {o.isAddOn ? "plus " : ""}${formatPrice(o.priceCents)}
              </span>
            </span>
          ))}
        </p>
      )}
    </header>
  );
}
