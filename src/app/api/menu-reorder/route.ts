import { prisma } from "@/lib/prisma";
import { validateIds } from "@/lib/menu-model";
import { badRequest, menuResponse, readJson, requireAdmin } from "@/lib/menu-api";

/**
 * Set display order. Body: { kind: "sections", ids } for every section, or
 * { kind: "items", sectionId, ids } for every item in one section.
 */
export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await readJson(req)) as { kind?: unknown; sectionId?: unknown; ids?: unknown } | null;
  const parsed = validateIds(body?.ids);
  if (!parsed.ok) return badRequest(parsed.error);
  const ids = parsed.value;

  if (body?.kind === "sections") {
    const count = await prisma.menuSection.count({ where: { id: { in: ids } } });
    if (count !== ids.length || count !== (await prisma.menuSection.count())) return badRequest("Order must list every section.");
    await prisma.$transaction(ids.map((id, sortOrder) => prisma.menuSection.update({ where: { id }, data: { sortOrder } })));
  } else if (body?.kind === "items" && typeof body.sectionId === "string") {
    const sectionId = body.sectionId;
    const count = await prisma.menuItem.count({ where: { sectionId, id: { in: ids } } });
    if (count !== ids.length || count !== (await prisma.menuItem.count({ where: { sectionId } })))
      return badRequest("Order must list every item in the section.");
    await prisma.$transaction(ids.map((id, sortOrder) => prisma.menuItem.update({ where: { id }, data: { sortOrder } })));
  } else {
    return badRequest("Unknown reorder kind.");
  }
  return menuResponse();
}
