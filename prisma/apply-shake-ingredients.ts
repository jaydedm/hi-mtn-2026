/**
 * One-off for existing databases (the seed only runs on empty ones):
 *  - fills in ingredients for shake flavors whose ingredients are still empty, and
 *  - adds the default search groups if there are none.
 * Never overwrites anything edited in the admin. Safe to re-run.
 *
 *   npx tsx prisma/apply-shake-ingredients.ts            # dry run: prints what would change
 *   npx tsx prisma/apply-shake-ingredients.ts --apply    # writes
 */
import { prisma } from "../src/lib/prisma";
import { SHAKE_INGREDIENTS, ingredientKey, ingredientsFor, isShakeFlavorList } from "./shake-ingredients";
import { seedSearchGroups } from "./seed-menu";

async function main() {
  const apply = process.argv.includes("--apply");
  const items = await prisma.menuItem.findMany({
    where: { section: { slug: "shakes" } },
    include: { section: { select: { slug: true } }, choices: true },
  });
  let updated = 0;
  let kept = 0;
  const unknown: string[] = [];
  for (const item of items) {
    if (!isShakeFlavorList(item.section.slug, item.name)) continue;
    for (const c of item.choices) {
      if (!SHAKE_INGREDIENTS[ingredientKey(c.name)]) {
        unknown.push(`${item.name}: ${c.name}`);
        continue;
      }
      if (c.ingredients.length) {
        kept++;
        continue;
      }
      updated++;
      if (apply) await prisma.menuChoice.update({ where: { id: c.id }, data: { ingredients: ingredientsFor(c.name) } });
    }
  }
  console.log(`${apply ? "Updated" : "Would update"} ${updated} flavors; ${kept} already had ingredients (left alone).`);
  if (unknown.length) console.log(`No SOP ingredients for: ${unknown.join(", ")}`);
  const groups = await prisma.searchGroup.count();
  if (groups) console.log(`${groups} search groups already present (left alone).`);
  else if (apply) console.log((await seedSearchGroups(prisma)) ? "Added the default search groups." : "");
  else console.log("Would add the default search groups.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
