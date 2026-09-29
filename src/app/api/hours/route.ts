import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { hasIncompleteHours, invalidHoursDays } from "@/lib/hours-validation";
import { NextResponse } from "next/server";
import { TAGS, expire } from "@/lib/cache-tags";

type HoursInput = {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  afterHoursStart: string | null;
  isClosed: boolean;
};

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const validTime = (t: unknown) => t === null || (typeof t === "string" && TIME.test(t));

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { hours } = (await req.json()) as { hours: HoursInput[] };

  const wellFormed =
    Array.isArray(hours) &&
    hours.every(
      (h) =>
        Number.isInteger(h.dayOfWeek) &&
        h.dayOfWeek >= 0 &&
        h.dayOfWeek <= 6 &&
        typeof h.isClosed === "boolean" &&
        validTime(h.openTime) &&
        validTime(h.closeTime) &&
        validTime(h.afterHoursStart ?? null)
    );
  if (!wellFormed || hasIncompleteHours(hours) || invalidHoursDays(hours).length) {
    return NextResponse.json({ error: "Invalid hours" }, { status: 400 });
  }

  await prisma.$transaction(
    hours.map((h) => {
      const data = {
        openTime: h.isClosed ? null : h.openTime,
        closeTime: h.isClosed ? null : h.closeTime,
        afterHoursStart: h.isClosed ? null : (h.afterHoursStart ?? null),
        isClosed: h.isClosed,
      };
      return prisma.operatingHours.upsert({
        where: { dayOfWeek: h.dayOfWeek },
        update: data,
        create: { dayOfWeek: h.dayOfWeek, ...data },
      });
    })
  );

  expire(TAGS.hours);
  return NextResponse.json({ success: true });
}
