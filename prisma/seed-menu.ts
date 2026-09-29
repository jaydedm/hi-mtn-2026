import { ingredientsFor, isShakeFlavorList } from "./shake-ingredients";
import type { PrismaClient } from "@prisma/client";
import { MENU_SEED } from "./menu-seed-data";
import { DEFAULT_SEARCH_GROUPS } from "./search-groups";

/**
 * Loads the transcribed menu if (and only if) there are no menu sections yet,
 * so it never overwrites the owner's edits. Returns whether it seeded.
 */
export async function seedMenu(prisma: PrismaClient): Promise<boolean> {
  if ((await prisma.menuSection.count()) > 0) return false;

  await prisma.$transaction(async (tx) => {
    for (const [si, s] of MENU_SEED.entries()) {
      await tx.menuSection.create({
        data: {
          slug: s.slug,
          title: s.title,
          intro: s.intro ?? null,
          note: s.note ?? null,
          sortOrder: si,
          options: {
            create: (s.options ?? []).map((o, oi) => ({
              label: o.label,
              priceCents: o.price,
              isAddOn: o.addOn !== false,
              sortOrder: oi,
            })),
          },
          items: {
            create: s.items.map((i, ii) => ({
              name: i.name,
              description: i.description ?? null,
              priceCents: i.price ?? null,
              choicesLabel: i.choicesLabel ?? null,
              onLunch: i.lunch ?? true,
              onAfterHours: i.afterHours ?? s.afterHours,
              sortOrder: ii,
              options: {
                create: (i.options ?? []).map((o, oi) => ({
                  label: o.label,
                  priceCents: o.price,
                  isAddOn: o.addOn !== false,
                  sortOrder: oi,
                })),
              },
              choices: {
                create: (i.choices ?? []).map((name, ci) => ({
                  name,
                  ingredients: isShakeFlavorList(s.slug, i.name) ? ingredientsFor(name) : [],
                  sortOrder: ci,
                })),
              },
            })),
          },
        },
      });
    }
  }, { timeout: 60_000 });
  return true;
}

/** Seeds the default ingredient search groups when there are none. Returns true if it seeded. */
export async function seedSearchGroups(prisma: PrismaClient): Promise<boolean> {
  if ((await prisma.searchGroup.count()) > 0) return false;
  await prisma.searchGroup.createMany({
    data: DEFAULT_SEARCH_GROUPS.map((g, sortOrder) => ({
      name: g.name,
      keywords: g.keywords ?? [],
      members: g.members,
      showChip: g.showChip !== false,
      sortOrder,
    })),
  });
  return true;
}
