import { prisma } from "@/lib/prisma";
import { BannerForm } from "./banner-form";

export default async function AdminBannerPage() {
  const banner = await prisma.globalBanner.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const serialized = banner
    ? {
        id: banner.id,
        bannerText: banner.bannerText,
        isActive: banner.isActive,
        startDate: banner.startDate.toISOString().slice(0, 16),
        endDate: banner.endDate.toISOString().slice(0, 16),
      }
    : null;

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-forest-dark mb-6">
        Manage Global Banner
      </h1>
      <BannerForm initial={serialized} />
    </div>
  );
}
