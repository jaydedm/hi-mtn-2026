import { prisma } from "@/lib/prisma";

export async function Banner() {
  const banner = await prisma.globalBanner.findFirst({
    where: {
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!banner) return null;

  return (
    <div className="bg-mustard text-forest-dark text-center py-2 px-4 font-semibold text-sm">
      {banner.bannerText}
    </div>
  );
}
