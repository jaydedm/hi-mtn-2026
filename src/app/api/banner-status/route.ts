import { prisma } from "@/lib/prisma";
import { isBannerVisible } from "@/lib/banner-logic";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const banner = await prisma.globalBanner.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!isBannerVisible(banner)) return NextResponse.json(null);

  return NextResponse.json({
    // Changes whenever the banner is edited, so a visitor who closed it sees the new message.
    key: `${banner!.id}:${banner!.updatedAt.getTime()}`,
    label: banner!.label,
    bannerText: banner!.bannerText,
    details: banner!.details,
    linkUrl: banner!.linkUrl,
    linkText: banner!.linkText,
    bannerType: banner!.bannerType,
  });
}
