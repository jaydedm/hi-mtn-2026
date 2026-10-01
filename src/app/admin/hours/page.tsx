import { prisma } from "@/lib/prisma";
import { PageHeader } from "../_components/ui";
import { HoursForm } from "./hours-form";

export default async function AdminHoursPage() {
  const hours = await prisma.operatingHours.findMany({
    orderBy: { dayOfWeek: "asc" },
  });

  const serialized = hours.map((h) => ({
    dayOfWeek: h.dayOfWeek,
    openTime: h.openTime ?? "",
    closeTime: h.closeTime ?? "",
    isClosed: h.isClosed,
    hasAfterHours: !!h.afterHoursStart,
    afterHoursStart: h.afterHoursStart ?? "",
  }));

  return (
    <div>
      <PageHeader
        title="Hours"
        description="When you’re open, and when the menu switches from Lunch to After Hours. All times are Mountain Time. The website updates as soon as you save."
      />
      <HoursForm initial={serialized} />
    </div>
  );
}
