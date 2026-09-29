import { prisma } from "@/lib/prisma";
import { validateSectionInput } from "@/lib/menu-model";
import { badRequest, menuResponse, notFound, optionRows, readJson, requireAdmin } from "@/lib/menu-api";

type Ctx = { params: Promise<{ id: string }> };

/** Replace a section's title, intro, note, visibility and section-wide price options. */
export async function PUT(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const parsed = validateSectionInput(await readJson(req));
  if (!parsed.ok) return badRequest(parsed.error);
  const { options, ...data } = parsed.value;

  if (!(await prisma.menuSection.findUnique({ where: { id }, select: { id: true } }))) return notFound();
  await prisma.$transaction([
    prisma.menuOption.deleteMany({ where: { sectionId: id } }),
    prisma.menuSection.update({ where: { id }, data: { ...data, options: { create: optionRows(options) } } }),
  ]);
  return menuResponse();
}

/** Delete a section and everything in it. */
export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const { count } = await prisma.menuSection.deleteMany({ where: { id } });
  return count ? menuResponse() : notFound();
}
