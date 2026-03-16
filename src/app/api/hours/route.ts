import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type HoursInput = {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
};

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { hours } = (await req.json()) as { hours: HoursInput[] };

  await prisma.$transaction(
    hours.map((h) =>
      prisma.operatingHours.upsert({
        where: { dayOfWeek: h.dayOfWeek },
        update: {
          openTime: h.openTime,
          closeTime: h.closeTime,
          isClosed: h.isClosed,
        },
        create: h,
      })
    )
  );

  return NextResponse.json({ success: true });
}
