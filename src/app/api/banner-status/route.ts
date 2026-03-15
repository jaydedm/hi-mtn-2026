import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const banner = await prisma.globalBanner.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!banner) return NextResponse.json(null);

  const now = new Date();
  if (banner.startDate && now < banner.startDate) return NextResponse.json(null);
  if (banner.endDate && now > banner.endDate) return NextResponse.json(null);

  return NextResponse.json({
    bannerText: banner.bannerText,
    bannerType: banner.bannerType,
  });
}
