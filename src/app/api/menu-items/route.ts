import { prisma } from "@/lib/prisma";
import { validateItemInput } from "@/lib/menu-model";
import { badRequest, menuResponse, notFound, optionRows, readJson, requireAdmin } from "@/lib/menu-api";

/** Create an item at the end of a section. Body: { sectionId, ...item }. */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await readJson(req)) as { sectionId?: unknown } | null;
  const sectionId = typeof body?.sectionId === "string" ? body.sectionId : "";
  const parsed = validateItemInput(body);
  if (!parsed.ok) return badRequest(parsed.error);
  if (!(await prisma.menuSection.findUnique({ where: { id: sectionId }, select: { id: true } }))) return notFound();

  const { options, choices, ...data } = parsed.value;
  const last = await prisma.menuItem.aggregate({ where: { sectionId }, _max: { sortOrder: true } });
  await prisma.menuItem.create({
    data: {
      ...data,
      sectionId,
      sortOrder: (last._max.sortOrder ?? -1) + 1,
      options: { create: optionRows(options) },
      choices: { create: choices.map((c, sortOrder) => ({ name: c.name, ingredients: c.ingredients, sortOrder })) },
    },
  });
  return menuResponse(201);
}
