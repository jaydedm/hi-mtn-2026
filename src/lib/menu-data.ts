import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_SECONDS, CACHE_VERSION, TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";
import { sectionsForMenu, type MenuSectionDto, type SearchGroupDto } from "@/lib/menu-model";
import { MENU_TYPES, type MenuType } from "@/lib/menu-schedule";

const include = {
  options: { orderBy: { sortOrder: "asc" as const } },
  items: {
    orderBy: { sortOrder: "asc" as const },
    include: {
      options: { orderBy: { sortOrder: "asc" as const } },
      choices: { orderBy: { sortOrder: "asc" as const } },
    },
  },
};

type Row = Awaited<ReturnType<typeof query>>[number];
const query = () => prisma.menuSection.findMany({ orderBy: { sortOrder: "asc" }, include });

const opt = (o: Row["options"][number]) => ({ id: o.id, label: o.label, priceCents: o.priceCents, isAddOn: o.isAddOn });

export function toDto(rows: Row[]): MenuSectionDto[] {
  return rows.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    intro: s.intro,
    note: s.note,
    isVisible: s.isVisible,
    options: s.options.map(opt),
    items: s.items.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      priceCents: i.priceCents,
      choicesLabel: i.choicesLabel,
      onLunch: i.onLunch,
      onAfterHours: i.onAfterHours,
      isAvailable: i.isAvailable,
      options: i.options.map(opt),
      choices: i.choices.map((c) => ({ id: c.id, name: c.name, ingredients: c.ingredients })),
    })),
  }));
}

/** Every section with items, options and choices, in display order. Server-only; [] on DB failure. */
// Cached across requests until an admin save expires the tag. Throws on DB errors (never cached).
const readMenu = unstable_cache(async () => toDto(await query()), ["menu", CACHE_VERSION], {
  tags: [TAGS.menu],
  revalidate: CACHE_SECONDS,
});

export const getMenu = cache(async (): Promise<MenuSectionDto[]> => {
  try {
    return await readMenu();
  } catch (e) {
    console.error("getMenu failed", e);
    return [];
  }
});

/** Which menus have at least one visible, available item online (used to link to /menu and list menus in structured data). */
export type OnlineMenus = Partial<Record<MenuType, boolean>>;

export const getOnlineMenus = cache(async (): Promise<OnlineMenus> => {
  const sections = await getMenu();
  return Object.fromEntries(MENU_TYPES.map((t) => [t, sectionsForMenu(sections, t).length > 0]));
});

/** Uncached read for admin pages and API responses (throws on failure). */
export async function loadMenu(): Promise<MenuSectionDto[]> {
  return toDto(await query());
}

const readSearchGroups = unstable_cache(
  async (): Promise<SearchGroupDto[]> =>
    (await prisma.searchGroup.findMany({ orderBy: { sortOrder: "asc" } })).map(({ id, name, keywords, members, showChip }) => ({
      id,
      name,
      keywords,
      members,
      showChip,
    })),
  ["search-groups", CACHE_VERSION],
  { tags: [TAGS.menu], revalidate: CACHE_SECONDS },
);

/** Ingredient search groups for the public flavor finder (cached with the menu). [] on DB failure. */
export const getSearchGroups = cache(async (): Promise<SearchGroupDto[]> => {
  try {
    return await readSearchGroups();
  } catch (e) {
    console.error("getSearchGroups failed", e);
    return [];
  }
});

/** Uncached read for the admin page. */
export async function loadSearchGroups(): Promise<SearchGroupDto[]> {
  return (await prisma.searchGroup.findMany({ orderBy: { sortOrder: "asc" } })).map(({ id, name, keywords, members, showChip }) => ({
    id,
    name,
    keywords,
    members,
    showChip,
  }));
}
