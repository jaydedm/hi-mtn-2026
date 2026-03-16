import { prisma } from "@/lib/prisma";
import { MenuManager } from "./menu-manager";

export default async function AdminMenuPage() {
  const menus = await prisma.menuPdf.findMany({ orderBy: { createdAt: "desc" } });

  const serialized = menus.map((m) => ({
    id: m.id,
    filename: m.filename,
    url: m.url,
    isActive: m.isActive,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="font-brand text-3xl font-bold text-forest-dark mb-6">
        Manage Menu PDFs
      </h1>
      <MenuManager initial={serialized} />
    </div>
  );
}
