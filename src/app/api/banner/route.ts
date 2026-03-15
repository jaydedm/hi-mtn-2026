import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, bannerText, bannerType, isActive, startDate, endDate } = await req.json();

  const data = {
    bannerText,
    bannerType: bannerType || "casual",
    isActive,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
  };

  if (id) {
    const updated = await prisma.globalBanner.update({ where: { id }, data });
    return NextResponse.json(updated);
  }

  const created = await prisma.globalBanner.create({ data });
  return NextResponse.json(created);
}
