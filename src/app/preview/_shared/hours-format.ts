import type { HoursRow } from "@/lib/hours-logic";

/** Pure formatting helpers for hours; safe to import from client components. */

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hh = h % 12 || 12;
  return m ? `${hh}:${String(m).padStart(2, "0")}${suffix}` : `${hh}${suffix}`;
}

/** Collapses consecutive identical days into "Mon–Fri 11am–4pm" style ranges. */
export function groupHours(hours: HoursRow[]) {
  const label = (r: HoursRow) =>
    r.isClosed || !r.openTime || !r.closeTime ? "Closed" : `${fmtTime(r.openTime)}–${fmtTime(r.closeTime)}`;
  const ordered = [...hours.slice(1), hours[0]]; // Mon..Sun
  const groups: { days: string; value: string }[] = [];
  for (const r of ordered) {
    const v = label(r);
    const last = groups[groups.length - 1];
    if (last && last.value === v && !last.days.includes("Sun")) {
      const [start] = last.days.split("–");
      last.days = `${start}–${DAY_SHORT[r.dayOfWeek]}`;
    } else {
      groups.push({ days: DAY_SHORT[r.dayOfWeek], value: v });
    }
  }
  return groups;
}
