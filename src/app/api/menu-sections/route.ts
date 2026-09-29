import { prisma } from "@/lib/prisma";
import { slugify, validateSectionInput } from "@/lib/menu-model";
import { badRequest, menuResponse, optionRows, readJson, requireAdmin } from "@/lib/menu-api";

/** Create a section at the end of the menu. */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = validateSectionInput(await readJson(req));
  if (!parsed.ok) return badRequest(parsed.error);
  const { options, ...data } = parsed.value;

  const base = slugify(data.title);
  const taken = new Set(
    (await prisma.menuSection.findMany({ where: { slug: { startsWith: base } }, select: { slug: true } })).map((s) => s.slug)
  );
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

  const last = await prisma.menuSection.aggregate({ _max: { sortOrder: true } });
  await prisma.menuSection.create({
    data: { ...data, slug, sortOrder: (last._max.sortOrder ?? -1) + 1, options: { create: optionRows(options) } },
  });
  return menuResponse(201);
}
