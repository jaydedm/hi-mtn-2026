import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, bannerText, isActive, startDate, endDate } = body;

  if (id) {
    const updated = await prisma.globalBanner.update({
      where: { id },
      data: { bannerText, isActive, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    return NextResponse.json(updated);
  }

  const created = await prisma.globalBanner.create({
    data: { bannerText, isActive, startDate: new Date(startDate), endDate: new Date(endDate) },
  });
  return NextResponse.json(created);
}
