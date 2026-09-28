import { prisma } from "@/lib/prisma";
import type { HoursRow } from "@/lib/hours-logic";

export { groupHours, fmtTime, DAY_SHORT } from "./hours-format";

/**
 * Hours used by the prototypes. Reads the real table when available and
 * falls back to the current summer schedule if the local DB is empty or down.
 * Server-only (imports prisma).
 */
const FALLBACK_HOURS: HoursRow[] = [
  { dayOfWeek: 0, openTime: null, closeTime: null, isClosed: true },
  { dayOfWeek: 1, openTime: "11:00", closeTime: "16:00", isClosed: false },
  { dayOfWeek: 2, openTime: "11:00", closeTime: "16:00", isClosed: false },
  { dayOfWeek: 3, openTime: "11:00", closeTime: "16:00", isClosed: false },
  { dayOfWeek: 4, openTime: "11:00", closeTime: "16:00", isClosed: false },
  { dayOfWeek: 5, openTime: "11:00", closeTime: "16:00", isClosed: false },
  { dayOfWeek: 6, openTime: null, closeTime: null, isClosed: true },
];

export async function getPreviewHours(): Promise<HoursRow[]> {
  try {
    const rows = await prisma.operatingHours.findMany({ orderBy: { dayOfWeek: "asc" } });
    if (rows.length === 7) {
      return rows.map((r) => ({
        dayOfWeek: r.dayOfWeek,
        openTime: r.openTime,
        closeTime: r.closeTime,
        isClosed: r.isClosed,
      }));
    }
  } catch {
    // local prototype without a database
  }
  return FALLBACK_HOURS;
}
