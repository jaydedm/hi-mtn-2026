import type { HoursRow } from "@/lib/hours-logic";

/** Pure formatting helpers for hours; safe to import from client components. */

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "16:00" → "4pm", "11:30" → "11:30am" */
export function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hh = h % 12 || 12;
  return m ? `${hh}:${String(m).padStart(2, "0")}${suffix}` : `${hh}${suffix}`;
}

export function isRowOpen(r: HoursRow): r is HoursRow & { openTime: string; closeTime: string } {
  return !r.isClosed && !!r.openTime && !!r.closeTime;
}

export function rowLabel(r: HoursRow) {
  return isRowOpen(r) ? `${fmtTime(r.openTime)}–${fmtTime(r.closeTime)}` : "Closed";
}

/**
 * Collapses consecutive identical days (Mon→Sun order) into ranges,
 * e.g. [{ days: "Mon–Fri", value: "11am–8pm" }, { days: "Sat–Sun", value: "Closed" }].
 */
export function groupHours(hours: HoursRow[]) {
  const byDay = new Map(hours.map((h) => [h.dayOfWeek, h]));
  const order = [1, 2, 3, 4, 5, 6, 0];
  const groups: { first: number; last: number; value: string }[] = [];
  for (const d of order) {
    const row = byDay.get(d);
    const value = row ? rowLabel(row) : "Closed";
    const prev = groups[groups.length - 1];
    if (prev && prev.value === value) prev.last = d;
    else groups.push({ first: d, last: d, value });
  }
  return groups.map((g) => ({
    days: g.first === g.last ? DAY_SHORT[g.first] : `${DAY_SHORT[g.first]}–${DAY_SHORT[g.last]}`,
    value: g.value,
  }));
}
