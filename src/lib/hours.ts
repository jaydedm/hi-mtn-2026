import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_SECONDS, CACHE_VERSION, TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";
import type { HoursRow } from "@/lib/hours-logic";

/**
 * Used only if the hours table is empty or unreachable, so the public site
 * still renders. Mon–Fri 11am–8pm with After Hours from 4pm, closed weekends.
 */
const FALLBACK_HOURS: HoursRow[] = [0, 1, 2, 3, 4, 5, 6].map((d) =>
  d === 0 || d === 6
    ? { dayOfWeek: d, openTime: null, closeTime: null, isClosed: true, afterHoursStart: null }
    : { dayOfWeek: d, openTime: "11:00", closeTime: "20:00", isClosed: false, afterHoursStart: "16:00" }
);

/** Hours rows from the DB, cached across requests until an admin save expires the tag. Throws on DB errors (never cached). */
const readHours = unstable_cache(
  async (): Promise<HoursRow[]> => {
    const rows = await prisma.operatingHours.findMany({ orderBy: { dayOfWeek: "asc" } });
    return rows.map(({ dayOfWeek, openTime, closeTime, isClosed, afterHoursStart }) => ({
      dayOfWeek,
      openTime,
      closeTime,
      isClosed,
      afterHoursStart,
    }));
  },
  ["hours", CACHE_VERSION],
  { tags: [TAGS.hours], revalidate: CACHE_SECONDS },
);

/** Weekly hours from the admin-managed table (cached; deduped per request). Server-only. */
export const getHours = cache(async (): Promise<HoursRow[]> => {
  try {
    const rows = await readHours();
    if (rows.length === 7) return rows;
  } catch (e) {
    console.error("getHours failed", e);
  }
  return FALLBACK_HOURS;
});
