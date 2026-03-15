import { prisma } from "@/lib/prisma";
import { HoursForm } from "./hours-form";

export default async function AdminHoursPage() {
  const hours = await prisma.operatingHours.findMany({
    orderBy: { dayOfWeek: "asc" },
  });

  const serialized = hours.map((h: { dayOfWeek: number; openTime: string | null; closeTime: string | null; isClosed: boolean }) => ({
    dayOfWeek: h.dayOfWeek,
    openTime: h.openTime ?? "",
    closeTime: h.closeTime ?? "",
    isClosed: h.isClosed,
  }));

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-forest-dark mb-6">
        Edit Operating Hours
      </h1>
      <HoursForm initial={serialized} />
    </div>
  );
}
