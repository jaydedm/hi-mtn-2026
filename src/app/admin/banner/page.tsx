import { prisma } from "@/lib/prisma";
import { PageHeader } from "../_components/ui";
import { BannerForm } from "./banner-form";

export default async function AdminBannerPage() {
  const banner = await prisma.globalBanner.findFirst({ orderBy: { createdAt: "desc" } });

  // Dates go to the form as ISO strings; the (client) form converts them to local datetime-local values.
  const serialized = banner
    ? {
        id: banner.id,
        label: banner.label ?? "",
        bannerText: banner.bannerText,
        details: banner.details ?? "",
        linkUrl: banner.linkUrl ?? "",
        linkText: banner.linkText ?? "",
        bannerType: banner.bannerType === "emergency" ? ("emergency" as const) : ("casual" as const),
        isActive: banner.isActive,
        startDate: banner.startDate?.toISOString() ?? "",
        endDate: banner.endDate?.toISOString() ?? "",
      }
    : null;

  return (
    <div>
      <PageHeader title="Banner" description="A short message bar across the top of every page on the website." />
      <BannerForm initial={serialized} />
    </div>
  );
}
