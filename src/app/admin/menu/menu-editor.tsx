"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  EyeOff,
  ListChecks,
  Pencil,
  Plus,
  Search,
  Settings2,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MenuItemRow } from "@/components/site/menu/menu-parts";
import { formatPrice, optionPriceLabel, parsePrice, type MenuItemDto, type MenuSectionDto } from "@/lib/menu-model";
import { ChoiceCard, ConfirmButton, MenuBadge, PageHeader, SaveToast, Segmented, Sheet, type SaveState } from "../_components/ui";
import { ChoicesEditor, Field, type ChoiceDraft, OptionsEditor, PriceInput, fromOptionDrafts, textareaClass, toOptionDrafts, type OptionDraft } from "./editor-fields";

type Filter = "all" | "lunch" | "after-hours";
type Api = (url: string, method: string, body?: unknown) => Promise<string | null>;

type ItemBody = {
  name: string;
  description: string;
  priceCents: number | null;
  choicesLabel: string;
  onLunch: boolean;
  onAfterHours: boolean;
  isAvailable: boolean;
  options: { label: string; priceCents: number; isAddOn: boolean }[];
  choices: { name: string; ingredients: string[] }[];
  sectionId?: string;
};
type SectionBody = { title: string; intro: string; note: string; isVisible: boolean; options: ItemBody["options"] };

/** Full PUT body for an existing item, with a few fields changed (used for quick toggles). */
const itemBody = (it: MenuItemDto, patch: Partial<ItemBody> = {}): ItemBody => ({
  name: it.name,
  description: it.description ?? "",
  priceCents: it.priceCents,
  choicesLabel: it.choices.length ? it.choicesLabel ?? "" : "",
  onLunch: it.onLunch,
  onAfterHours: it.onAfterHours,
  isAvailable: it.isAvailable,
  options: it.options.map((o) => ({ label: o.label, priceCents: o.priceCents, isAddOn: o.isAddOn })),
  choices: it.choices.map((c) => ({ name: c.name, ingredients: c.ingredients })),
  ...patch,
});

type Editing =
  | { kind: "item"; sectionId: string; item?: MenuItemDto }
  | { kind: "section"; section?: MenuSectionDto }
  | null;

/** Admin editor for the online menu: sections → items, edited in a side sheet. */
export function MenuEditor({ initial }: { initial: MenuSectionDto[] }) {
  const [sections, setSections] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const [editing, setEditing] = useState<Editing>(null);
  const dismiss = useCallback(() => setSave({ kind: "idle" }), []);

  /** Calls a menu API, resyncs from its response, returns an error message or null. */
  const api: Api = async (url, method, body) => {
    setSave({ kind: "saving" });
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.error ?? "Something went wrong. Please try again.";
        setSave({ kind: "error", message });
        return message;
      }
      setSections(data.sections);
      setSave({ kind: "saved" });
      return null;
    } catch {
      const message = "Couldn’t reach the server. Check your connection and try again.";
      setSave({ kind: "error", message });
      return message;
    }
  };

  const q = query.trim().toLowerCase();
  const view = useMemo(
    () =>
      sections.map((s) => ({
        section: s,
        items: s.items.filter(
          (it) =>
            (filter === "all" || (filter === "lunch" ? it.onLunch : it.onAfterHours)) &&
            (!q || it.name.toLowerCase().includes(q) || it.choices.some((c) => c.name.toLowerCase().includes(q))),
        ),
      })),
    [sections, filter, q],
  );
  const shown = q ? view.filter((v) => v.items.length > 0) : view;
  const totals = useMemo(() => {
    const items = sections.flatMap((s) => s.items);
    return { items: items.length, off: items.filter((i) => !i.isAvailable).length };
  }, [sections]);

  const moveSection = (i: number, dir: -1 | 1) => {
    const ids = sections.map((s) => s.id);
    [ids[i], ids[i + dir]] = [ids[i + dir], ids[i]];
    return api("/api/menu-reorder", "PUT", { kind: "sections", ids });
  };
  const moveItem = (s: MenuSectionDto, id: string, dir: -1 | 1) => {
    const ids = s.items.map((x) => x.id);
    const i = ids.indexOf(id);
    [ids[i], ids[i + dir]] = [ids[i + dir], ids[i]];
    return api("/api/menu-reorder", "PUT", { kind: "items", sectionId: s.id, ids });
  };
  const canReorder = filter === "all" && !q;

  return (
    <>
      <PageHeader
        title="Menu"
        description={
          <>
            Changes go live on the website as soon as you save. {totals.items} items across {sections.length} sections
            {totals.off > 0 && <> · <strong className="text-foreground">{totals.off} marked unavailable</strong></>}.
          </>
        }
        actions={
          <>
          <Link href="/admin/menu/search" className={buttonVariants({ variant: "outline" })}>
            <Search aria-hidden="true" /> Search groups
          </Link>
          <Button onClick={() => setEditing({ kind: "section" })}>
            <Plus aria-hidden="true" /> New section
          </Button>
          </>
        }
      />

      {/* Toolbar */}
      <div className="sticky top-[6.25rem] z-20 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:top-0 md:mx-0 md:rounded-xl md:border md:px-3">
        <Segmented
          label="Show items on"
          value={filter}
          onChange={setFilter}
          options={[
            ["all", "All items"],
            ["lunch", "Dining Room"],
            ["after-hours", "After Hours"],
          ]}
        />
        <label className="relative min-w-48 flex-1">
          <span className="sr-only">Find an item or flavor</span>
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find an item or flavor…" className="h-9 bg-card pl-8" />
        </label>
      </div>

      <div className="grid gap-8 lg:grid-cols-[12rem_1fr]">
        {/* Section index */}
        <nav aria-label="Sections" className="hidden lg:block">
          <ol className="sticky top-24 space-y-0.5">
            {view.map(({ section, items }) => (
              <li key={section.id}>
                <a
                  href={`#section-${section.id}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-card hover:text-foreground"
                >
                  <span className={`truncate ${section.isVisible ? "" : "line-through"}`}>{section.title}</span>
                  <span className="text-xs tabular-nums">{items.length}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 space-y-6">
          {shown.length === 0 && (
            <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Nothing matches “{query}”.
            </p>
          )}
          {shown.map(({ section, items }) => {
            const i = sections.indexOf(section);
            return (
              <section
                key={section.id}
                id={`section-${section.id}`}
                aria-labelledby={`h-${section.id}`}
                className="scroll-mt-40 overflow-hidden rounded-xl border border-border bg-card shadow-sm md:scroll-mt-24"
              >
                <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-5 py-4">
                  <h2 id={`h-${section.id}`} className="font-brand text-lg font-bold">
                    {section.title}
                  </h2>
                  {!section.isVisible && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                      <EyeOff className="size-3" aria-hidden="true" /> Hidden from website
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {section.items.length} item{section.items.length === 1 ? "" : "s"}
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    {canReorder && (
                      <>
                        <Button size="icon-sm" variant="ghost" disabled={i === 0} title="Move section up" aria-label={`Move ${section.title} up`} onClick={() => moveSection(i, -1)}>
                          <ArrowUp aria-hidden="true" />
                        </Button>
                        <Button size="icon-sm" variant="ghost" disabled={i === sections.length - 1} title="Move section down" aria-label={`Move ${section.title} down`} onClick={() => moveSection(i, 1)}>
                          <ArrowDown aria-hidden="true" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setEditing({ kind: "section", section })}>
                      <Settings2 aria-hidden="true" /> Section settings
                    </Button>
                    <Button size="sm" onClick={() => setEditing({ kind: "item", sectionId: section.id })}>
                      <Plus aria-hidden="true" /> Add item
                    </Button>
                  </div>
                </header>

                {(section.intro || section.options.length > 0) && (
                  <div className="space-y-2 border-b border-border bg-muted/40 px-5 py-3 text-sm">
                    {section.intro && <p className="line-clamp-2 italic text-muted-foreground">{section.intro}</p>}
                    {section.options.length > 0 && (
                      <p className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Every item:</span>
                        {section.options.map((o) => (
                          <span key={o.id} className="rounded-full border border-border bg-card px-2 py-0.5 text-xs">
                            {o.label} <strong>{optionPriceLabel(o)}</strong>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                )}

                <ul className="divide-y divide-border">
                  {items.map((item) => {
                    const idx = section.items.indexOf(item);
                    return (
                      <ItemRow
                        key={item.id}
                        item={item}
                        onEdit={() => setEditing({ kind: "item", sectionId: section.id, item })}
                        onToggleAvailable={(v) => api(`/api/menu-items/${item.id}`, "PUT", itemBody(item, { isAvailable: v }))}
                        onMove={canReorder ? (dir) => moveItem(section, item.id, dir) : undefined}
                        first={idx === 0}
                        last={idx === section.items.length - 1}
                      />
                    );
                  })}
                  {items.length === 0 && (
                    <li className="px-5 py-6 text-center text-sm text-muted-foreground">
                      {filter === "all" ? "No items yet." : `No ${filter === "lunch" ? "Dining Room" : "After Hours"} items in this section.`}
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <Sheet
        open={editing?.kind === "item"}
        onClose={() => setEditing(null)}
        title={editing?.kind === "item" ? (editing.item ? `Edit ${editing.item.name}` : "New item") : ""}
        description={
          editing?.kind === "item" ? `In ${sections.find((s) => s.id === editing.sectionId)?.title ?? "section"}` : undefined
        }
      >
        {editing?.kind === "item" && (
          <ItemForm
            key={editing.item?.id ?? `new-${editing.sectionId}`}
            item={editing.item}
            sections={sections}
            sectionId={editing.sectionId}
            defaults={{ onLunch: filter !== "after-hours", onAfterHours: filter === "after-hours" }}
            onCancel={() => setEditing(null)}
            onSave={async (body) => {
              const err = editing.item
                ? await api(`/api/menu-items/${editing.item.id}`, "PUT", body)
                : await api("/api/menu-items", "POST", { ...body, sectionId: editing.sectionId });
              if (!err) setEditing(null);
              return err;
            }}
            onDelete={
              editing.item
                ? async () => {
                    const err = await api(`/api/menu-items/${editing.item!.id}`, "DELETE");
                    if (!err) setEditing(null);
                    return err;
                  }
                : undefined
            }
          />
        )}
      </Sheet>

      <Sheet
        open={editing?.kind === "section"}
        onClose={() => setEditing(null)}
        title={editing?.kind === "section" && editing.section ? `${editing.section.title} settings` : "New section"}
      >
        {editing?.kind === "section" && (
          <SectionForm
            key={editing.section?.id ?? "new"}
            section={editing.section}
            onCancel={() => setEditing(null)}
            onSave={async (body) => {
              const err = editing.section
                ? await api(`/api/menu-sections/${editing.section.id}`, "PUT", body)
                : await api("/api/menu-sections", "POST", body);
              if (!err) setEditing(null);
              return err;
            }}
            onDelete={
              editing.section
                ? async () => {
                    const err = await api(`/api/menu-sections/${editing.section!.id}`, "DELETE");
                    if (!err) setEditing(null);
                    return err;
                  }
                : undefined
            }
          />
        )}
      </Sheet>

      <SaveToast state={save} onDismiss={dismiss} />
    </>
  );
}

function ItemRow({
  item,
  onEdit,
  onToggleAvailable,
  onMove,
  first,
  last,
}: {
  item: MenuItemDto;
  onEdit: () => void;
  onToggleAvailable: (v: boolean) => void;
  onMove?: (dir: -1 | 1) => void;
  first: boolean;
  last: boolean;
}) {
  const switchId = `avail-${item.id}`;
  return (
    <li className={`group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40 ${item.isAvailable ? "" : "bg-muted/30"}`}>
      <button type="button" onClick={onEdit} className="min-w-0 flex-1 text-left" aria-label={`Edit ${item.name}`}>
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className={`font-semibold ${item.isAvailable ? "" : "text-muted-foreground line-through"}`}>{item.name}</span>
          {item.priceCents !== null && <span className="text-sm tabular-nums text-muted-foreground">${formatPrice(item.priceCents)}</span>}
        </span>
        {item.description && <span className="mt-0.5 block truncate text-sm text-muted-foreground">{item.description}</span>}
        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {item.onLunch && <MenuBadge menu="lunch" />}
          {item.onAfterHours && <MenuBadge menu="after-hours" />}
          {!item.onLunch && !item.onAfterHours && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">Not on either menu</span>
          )}
          {item.options.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Tag className="size-3" aria-hidden="true" /> {item.options.length} extra price{item.options.length === 1 ? "" : "s"}
            </span>
          )}
          {item.choices.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ListChecks className="size-3" aria-hidden="true" /> {item.choices.length} {(item.choicesLabel ?? "choices").toLowerCase()}
            </span>
          )}
        </span>
      </button>

      <div className="flex shrink-0 items-center gap-2">
        <Switch id={switchId} checked={item.isAvailable} onCheckedChange={onToggleAvailable} aria-label={`${item.name} available`} />
        <label htmlFor={switchId} className={`hidden w-20 text-xs sm:block ${item.isAvailable ? "text-muted-foreground" : "font-semibold text-amber-700"}`}>
          {item.isAvailable ? "Available" : "Unavailable"}
        </label>
      </div>
      {onMove && (
        <div className="hidden shrink-0 flex-col sm:flex">
          <Button size="icon-xs" variant="ghost" disabled={first} title="Move up" aria-label={`Move ${item.name} up`} onClick={() => onMove(-1)}>
            <ArrowUp aria-hidden="true" />
          </Button>
          <Button size="icon-xs" variant="ghost" disabled={last} title="Move down" aria-label={`Move ${item.name} down`} onClick={() => onMove(1)}>
            <ArrowDown aria-hidden="true" />
          </Button>
        </div>
      )}
      <Button size="sm" variant="outline" onClick={onEdit} className="shrink-0" aria-hidden="true" tabIndex={-1}>
        <Pencil aria-hidden="true" /> <span className="hidden sm:inline">Edit</span>
      </Button>
    </li>
  );
}

/** Numbered group inside the item/section sheet. */
function Group({ n, title, description, children }: { n?: number; title: string; description?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3 rounded-xl border border-border p-4">
      <legend className="-ml-1 flex items-center gap-2 px-1 text-sm font-semibold">
        {n !== undefined && (
          <span className="grid size-5 place-items-center rounded-full bg-foreground text-[11px] text-background" aria-hidden="true">
            {n}
          </span>
        )}
        {title}
      </legend>
      {description && <p className="-mt-1 text-xs text-muted-foreground">{description}</p>}
      {children}
    </fieldset>
  );
}

function ItemForm({
  item,
  sections,
  sectionId,
  defaults,
  onSave,
  onCancel,
  onDelete,
}: {
  item?: MenuItemDto;
  sections: MenuSectionDto[];
  sectionId: string;
  defaults: { onLunch: boolean; onAfterHours: boolean };
  onSave: (body: ItemBody) => Promise<string | null>;
  onCancel: () => void;
  onDelete?: () => Promise<string | null>;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item?.priceCents != null ? formatPrice(item.priceCents) : "");
  const [onLunch, setOnLunch] = useState(item?.onLunch ?? defaults.onLunch);
  const [onAfterHours, setOnAfterHours] = useState(item?.onAfterHours ?? defaults.onAfterHours);
  const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);
  const [options, setOptions] = useState<OptionDraft[]>(toOptionDrafts(item?.options ?? []));
  const [hasChoices, setHasChoices] = useState((item?.choices.length ?? 0) > 0);
  const [choicesLabel, setChoicesLabel] = useState(item?.choicesLabel ?? "Flavors");
  const [choices, setChoices] = useState<ChoiceDraft[]>(item?.choices.map((c) => ({ name: c.name, ingredients: c.ingredients })) ?? []);
  const [moveTo, setMoveTo] = useState(sectionId);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const cents = parsePrice(price);
  const opts = fromOptionDrafts(options);
  const preview: MenuItemDto = {
    id: "preview",
    name: name || "Item name",
    description: description || null,
    priceCents: Number.isNaN(cents) ? null : cents,
    choicesLabel: hasChoices ? choicesLabel : null,
    onLunch,
    onAfterHours,
    isAvailable,
    options: opts.options ? opts.options.map((o, i) => ({ id: `p${i}`, ...o })) : [],
    choices: [],
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number.isNaN(cents)) return setError("Price should look like 7.50.");
    if ("error" in opts) return setError(opts.error!);
    setBusy(true);
    const err = await onSave({
      name,
      description,
      priceCents: cents,
      choicesLabel: hasChoices ? choicesLabel : "",
      onLunch,
      onAfterHours,
      isAvailable,
      options: opts.options ?? [],
      choices: hasChoices ? choices : [],
      ...(item && moveTo !== sectionId ? { sectionId: moveTo } : {}),
    });
    setBusy(false);
    setError(err ?? "");
  };

  const noun = (choicesLabel || "choice").toLowerCase().replace(/s$/, "");

  return (
    <form onSubmit={submit} className="space-y-5" aria-label={item ? `Edit ${item.name}` : "New item"}>
      <div className="rounded-xl bg-ds-cream p-4 ring-1 ring-ds-ink/10">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ds-ink/60">Preview on the website</p>
        <ul className="text-ds-ink">
          <MenuItemRow item={preview} />
        </ul>
        {hasChoices && choices.length > 0 && (
          <p className="mt-2 text-xs text-ds-ink/70">
            + {choicesLabel || "Choices"}: {choices.slice(0, 5).map((c) => c.name).join(", ")}
            {choices.length > 5 ? ` and ${choices.length - 5} more` : ""}
          </p>
        )}
      </div>

      <Group n={1} title="Basics">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-56 flex-1">
            <Field label="Name">{(id) => <Input id={id} value={name} onChange={(e) => setName(e.target.value)} required className="h-9" />}</Field>
          </div>
          <Field label="Price" hint="Optional">
            {(id) => <PriceInput id={id} value={price} onChange={setPrice} />}
          </Field>
        </div>
        <Field label="Description" hint="Shown in italics under the name. Type * after a house-made ingredient to add the house icon.">
          {(id) => <textarea id={id} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={textareaClass} />}
        </Field>
      </Group>

      <Group n={2} title="Where it shows">
        <div className="grid gap-2 sm:grid-cols-2">
          <ChoiceCard tone="blue" checked={onLunch} onChange={setOnLunch} title="Dining Room menu" description="The full menu, before After Hours starts" />
          <ChoiceCard tone="ink" checked={onAfterHours} onChange={setOnAfterHours} title="After Hours menu" description="Shakes, ice cream and box combos" />
        </div>
        {!onLunch && !onAfterHours && <p className="text-xs font-medium text-amber-700">Pick at least one menu, or this item won’t appear anywhere.</p>}
        <label className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <span>
            <span className="block text-sm font-semibold">Available today</span>
            <span className="block text-xs text-muted-foreground">Turn off when you run out. It hides the item without deleting it.</span>
          </span>
          <Switch checked={isAvailable} onCheckedChange={setIsAvailable} aria-label="Available" />
        </label>
      </Group>

      <Group n={3} title="Extra prices" description="Add-ons like “Add bacon +3.00”, or other sizes like “Cup 6.50” or “4 tenders 15.50”.">
        <OptionsEditor value={options} onChange={setOptions} />
      </Group>

      <Group n={4} title="Flavor or topping list">
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm">This item has a list of flavors, toppings or other choices</span>
          <Switch checked={hasChoices} onCheckedChange={setHasChoices} aria-label="Has a choice list" />
        </label>
        {hasChoices && (
          <>
            <Field label="List heading" hint="Shown above the list, e.g. Flavors, Toppings, Dressings">
              {(id) => <Input id={id} value={choicesLabel} onChange={(e) => setChoicesLabel(e.target.value)} className="h-9 w-56" />}
            </Field>
            <ChoicesEditor value={choices} onChange={setChoices} noun={noun} />
          </>
        )}
      </Group>

      {item && sections.length > 1 && (
        <Group title="Section">
          <Field label="Move to another section">
            {(id) => (
              <select id={id} value={moveTo} onChange={(e) => setMoveTo(e.target.value)} className="h-9 w-full rounded-lg border border-input bg-card px-2 text-sm sm:w-72">
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </Group>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="sticky -bottom-5 -mx-6 flex flex-wrap items-center gap-2 border-t border-border bg-card px-6 py-3">
        <Button type="submit" size="lg" disabled={busy || !name.trim()}>
          {busy ? "Saving…" : item ? "Save changes" : "Add item"}
        </Button>
        <Button type="button" size="lg" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {onDelete && (
          <ConfirmButton
            className="ml-auto"
            prompt="Delete for good?"
            onConfirm={async () => {
              const err = await onDelete();
              if (err) setError(err);
            }}
          >
            Delete item
          </ConfirmButton>
        )}
      </div>
    </form>
  );
}

function SectionForm({
  section,
  onSave,
  onCancel,
  onDelete,
}: {
  section?: MenuSectionDto;
  onSave: (body: SectionBody) => Promise<string | null>;
  onCancel: () => void;
  onDelete?: () => Promise<string | null>;
}) {
  const [title, setTitle] = useState(section?.title ?? "");
  const [intro, setIntro] = useState(section?.intro ?? "");
  const [note, setNote] = useState(section?.note ?? "");
  const [isVisible, setIsVisible] = useState(section?.isVisible ?? true);
  const [options, setOptions] = useState<OptionDraft[]>(toOptionDrafts(section?.options ?? []));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const opts = fromOptionDrafts(options);
    if ("error" in opts) return setError(opts.error!);
    setBusy(true);
    const err = await onSave({ title, intro, note, isVisible, options: opts.options });
    setBusy(false);
    setError(err ?? "");
  };

  return (
    <form onSubmit={submit} className="space-y-5" aria-label={section ? `Edit section ${section.title}` : "New section"}>
      <Group n={1} title="Title and text">
        <Field label="Section title">{(id) => <Input id={id} value={title} onChange={(e) => setTitle(e.target.value)} required className="h-9" />}</Field>
        <Field label="Intro" hint="Optional. Shown under the section title.">
          {(id) => <textarea id={id} rows={3} value={intro} onChange={(e) => setIntro(e.target.value)} className={textareaClass} />}
        </Field>
        <Field label="Footnote" hint="Optional. Shown at the end of the section, e.g. “We feature Leatherby’s ice cream.”">
          {(id) => <Input id={id} value={note} onChange={(e) => setNote(e.target.value)} className="h-9" />}
        </Field>
      </Group>

      <Group n={2} title="Add-ons for every item" description="Shown once for the whole section, e.g. “Add bacon +3.00” or “Make it a malt +1.00”.">
        <OptionsEditor value={options} onChange={setOptions} addLabel="Add an add-on" />
      </Group>

      <Group n={3} title="Visibility">
        <label className="flex items-center justify-between gap-3">
          <span>
            <span className="block text-sm font-semibold">Show on the website</span>
            <span className="block text-xs text-muted-foreground">Turn off to hide the whole section without deleting it.</span>
          </span>
          <Switch checked={isVisible} onCheckedChange={setIsVisible} aria-label="Show on the website" />
        </label>
      </Group>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="sticky -bottom-5 -mx-6 flex flex-wrap items-center gap-2 border-t border-border bg-card px-6 py-3">
        <Button type="submit" size="lg" disabled={busy || !title.trim()}>
          {busy ? "Saving…" : section ? "Save changes" : "Add section"}
        </Button>
        <Button type="button" size="lg" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {onDelete && section && (
          <ConfirmButton
            className="ml-auto"
            prompt={`Delete it and its ${section.items.length} items?`}
            onConfirm={async () => {
              const err = await onDelete();
              if (err) setError(err);
            }}
          >
            Delete section
          </ConfirmButton>
        )}
      </div>
    </form>
  );
}
