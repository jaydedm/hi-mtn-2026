import type { HoursRow } from "@/lib/hours-logic";
import { DAY_SHORT, fmtTime, isRowOpen, rowLabel } from "@/lib/hours-format";

/**
 * Two menus, one dining room. Each open day runs the Lunch menu (the full grill)
 * from open until `afterHoursStart`, then "Hi-Mountain After Hours" (shakes, ice
 * cream, fryer dinner items) until close. Days without `afterHoursStart` serve
 * Lunch all day. Pure logic, safe for client components.
 */

export const MENU_TYPES = ["lunch", "after-hours"] as const;
export type MenuType = (typeof MENU_TYPES)[number];

export const MENU_INFO: Record<
  MenuType,
  { title: string; name: string; blurb: string }
> = {
  lunch: {
    title: "Lunch Menu",
    name: "Lunch",
    blurb:
      "The full grill: award-winning burgers, sandwiches, salads, sides, shakes and more.",
  },
  "after-hours": {
    title: "Hi-Mountain After Hours",
    name: "After Hours",
    blurb:
      "Our full shake and ice cream menu, plus comfy favorites, salads, and box combos.",
  },
};

export type TimeWindow = { start: string; end: string };
export type MenuWindows = Record<MenuType, TimeWindow | null>;

export function isMenuType(v: unknown): v is MenuType {
  return typeof v === "string" && (MENU_TYPES as readonly string[]).includes(v);
}

export const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** True if the After Hours start is set and falls strictly between open and close. */
export function hasValidAfterHours(r: HoursRow): boolean {
  if (!isRowOpen(r) || !r.afterHoursStart) return false;
  const s = toMinutes(r.afterHoursStart);
  return s > toMinutes(r.openTime) && s < toMinutes(r.closeTime);
}

/** When each menu is served on a given day. Both null when closed. */
export function menuWindows(r: HoursRow | undefined): MenuWindows {
  if (!r || !isRowOpen(r)) return { lunch: null, "after-hours": null };
  if (!hasValidAfterHours(r))
    return {
      lunch: { start: r.openTime, end: r.closeTime },
      "after-hours": null,
    };
  return {
    lunch: { start: r.openTime, end: r.afterHoursStart! },
    "after-hours": { start: r.afterHoursStart!, end: r.closeTime },
  };
}

/** Which menu is being served at a Mountain Time wall-clock time, given that day's row (assumes open). */
export function menuTypeAt(r: HoursRow | undefined, mtNow: Date): MenuType {
  const w = menuWindows(r)["after-hours"];
  if (!w) return "lunch";
  return mtNow.getHours() * 60 + mtNow.getMinutes() >= toMinutes(w.start)
    ? "after-hours"
    : "lunch";
}

export function fmtWindow(w: TimeWindow) {
  return `${fmtTime(w.start)} – ${fmtTime(w.end)}`;
}

/**
 * One-line summary of when a menu is served across the week, for menu cards:
 * "11am – 4pm" if every day that serves it uses the same window, "Times vary by day"
 * otherwise, null if no day serves it.
 */
export function menuWindowSummary(
  hours: HoursRow[],
  type: MenuType,
): string | null {
  const labels = new Set<string>();
  for (const r of hours) {
    const w = menuWindows(r)[type];
    if (w) labels.add(fmtWindow(w));
  }
  if (labels.size === 0) return null;
  return labels.size === 1 ? [...labels][0] : "Times vary by day";
}

export type ScheduleGroup = {
  days: string;
  /** Overall open–close, e.g. "11am–8pm", or "Closed". */
  hours: string;
  lunch: string | null;
  afterHours: string | null;
  /** Lunch window on any day it is served (even without After Hours), for the hours table. */
  dining: string | null;
};

/** Collapses consecutive days (Mon→Sun) with identical hours and menu windows. */
export function groupSchedule(hours: HoursRow[]): ScheduleGroup[] {
  const byDay = new Map(hours.map((h) => [h.dayOfWeek, h]));
  const groups: (ScheduleGroup & {
    first: number;
    last: number;
    key: string;
  })[] = [];
  for (const d of [1, 2, 3, 4, 5, 6, 0]) {
    const row = byDay.get(d);
    const w = menuWindows(row);
    const g = {
      hours: row ? rowLabel(row) : "Closed",
      lunch: w.lunch && w["after-hours"] ? fmtWindow(w.lunch) : null,
      afterHours: w["after-hours"] ? fmtWindow(w["after-hours"]) : null,
      dining: w.lunch ? fmtWindow(w.lunch) : null,
    };
    const key = `${g.hours}|${g.lunch}|${g.afterHours}`;
    const prev = groups[groups.length - 1];
    if (prev && prev.key === key) prev.last = d;
    else groups.push({ ...g, days: "", first: d, last: d, key });
  }
  return groups.map(({ first, last, hours, lunch, afterHours, dining }) => ({
    days:
      first === last
        ? DAY_SHORT[first]
        : `${DAY_SHORT[first]}–${DAY_SHORT[last]}`,
    hours,
    lunch,
    afterHours,
    dining,
  }));
}
