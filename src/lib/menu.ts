import { prisma } from "@/lib/prisma";
import { unstable_noStore } from "next/cache";

export async function getActiveMenuUrl(): Promise<string> {
  unstable_noStore();
  const active = await prisma.menuPdf.findFirst({ where: { isActive: true } });
  return active ? `/menus/${active.filename}` : "/menu.pdf";
}
