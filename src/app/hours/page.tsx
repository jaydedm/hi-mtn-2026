import { prisma } from "@/lib/prisma";
import { HoursClient } from "./hours-client";

export const revalidate = 60;

export default async function HoursPage() {
  const hours = await prisma.operatingHours.findMany({
    orderBy: { dayOfWeek: "asc" },
  });

  const serialized = hours.map((h: { dayOfWeek: number; openTime: string | null; closeTime: string | null; isClosed: boolean }) => ({
    dayOfWeek: h.dayOfWeek,
    openTime: h.openTime,
    closeTime: h.closeTime,
    isClosed: h.isClosed,
  }));

  return <HoursClient hours={serialized} />;
}
