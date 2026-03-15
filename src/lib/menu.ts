import { prisma } from "@/lib/prisma";

export async function getActiveMenuUrl(): Promise<string> {
  const active = await prisma.menuPdf.findFirst({ where: { isActive: true } });
  return active ? `/menus/${active.filename}` : "/menu.pdf";
}
