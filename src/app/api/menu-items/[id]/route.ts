import { prisma } from "@/lib/prisma";
import { validateItemInput } from "@/lib/menu-model";
import { badRequest, menuResponse, notFound, optionRows, readJson, requireAdmin } from "@/lib/menu-api";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Replace an item, including its price options and choice list (flavors etc.).
 * Optional `sectionId` moves it to the end of another section.
 */
export async function PUT(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const body = (await readJson(req)) as { sectionId?: unknown } | null;
  const parsed = validateItemInput(body);
  if (!parsed.ok) return badRequest(parsed.error);

  const current = await prisma.menuItem.findUnique({ where: { id }, select: { sectionId: true } });
  if (!current) return notFound();

  let move: { sectionId: string; sortOrder: number } | null = null;
  if (typeof body?.sectionId === "string" && body.sectionId !== current.sectionId) {
    if (!(await prisma.menuSection.findUnique({ where: { id: body.sectionId }, select: { id: true } }))) return notFound();
    const last = await prisma.menuItem.aggregate({ where: { sectionId: body.sectionId }, _max: { sortOrder: true } });
    move = { sectionId: body.sectionId, sortOrder: (last._max.sortOrder ?? -1) + 1 };
  }

  const { options, choices, ...data } = parsed.value;
  await prisma.$transaction([
    prisma.menuOption.deleteMany({ where: { itemId: id } }),
    prisma.menuChoice.deleteMany({ where: { itemId: id } }),
    prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        ...(move ?? {}),
        options: { create: optionRows(options) },
        choices: { create: choices.map((c, sortOrder) => ({ name: c.name, ingredients: c.ingredients, sortOrder })) },
      },
    }),
  ]);
  return menuResponse();
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const { count } = await prisma.menuItem.deleteMany({ where: { id } });
  return count ? menuResponse() : notFound();
}
