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
    bannerText: banner!.bannerText,
    bannerType: banner!.bannerType,
  });
}
