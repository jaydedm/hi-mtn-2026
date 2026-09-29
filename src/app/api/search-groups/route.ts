import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSearchGroups } from "@/lib/menu-model";
import { loadSearchGroups } from "@/lib/menu-data";
import { TAGS, expire } from "@/lib/cache-tags";
import { badRequest, readJson, requireAdmin } from "@/lib/menu-api";

/** Replaces the full list of search groups (order = list order). Returns the saved list. */
export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await readJson(req);
  const parsed = validateSearchGroups((body as { groups?: unknown } | null)?.groups);
  if (!parsed.ok) return badRequest(parsed.error);

  await prisma.$transaction([
    prisma.searchGroup.deleteMany({}),
    prisma.searchGroup.createMany({ data: parsed.value.map((g, sortOrder) => ({ ...g, sortOrder })) }),
  ]);
  expire(TAGS.menu);
  return NextResponse.json({ groups: await loadSearchGroups() });
}
