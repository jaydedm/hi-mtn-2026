import { isOpenNow, type HoursRow } from "@/lib/hours-logic";
import { DAY_SHORT, fmtTime, isRowOpen } from "@/lib/hours-format";
import { MENU_INFO, menuTypeAt, menuWindows, toMinutes, type MenuType } from "@/lib/menu-schedule";

export type OpenStatus = {
  open: boolean;
  /** "Closes 8pm" / "Opens 11am" / "Opens tomorrow 11am" / "Opens Mon 11am" */
  detail: string;
  /** Day of week (0 = Sunday) in Mountain Time. */
  today: number;
  /** Menu being served right now, or null when closed. */
  serving: MenuType | null;
  /** "Lunch until 4pm" / "After Hours until 8pm", or null when closed. */
  servingDetail: string | null;
};

/** Open/closed status for a Mountain Time wall-clock date. Pure; safe for client use. */
export function openStatus(hours: HoursRow[], mtNow: Date): OpenStatus {
  const today = mtNow.getDay();
  const row = hours.find((h) => h.dayOfWeek === today);

  if (isOpenNow(hours, mtNow) && row?.closeTime) {
    const serving = menuTypeAt(row, mtNow);
    const until = menuWindows(row)[serving]?.end ?? row.closeTime;
    return {
      open: true,
      detail: `Closes ${fmtTime(row.closeTime)}`,
      today,
      serving,
      servingDetail: `${MENU_INFO[serving].name} until ${fmtTime(until)}`,
    };
  }

  const closed = (detail: string): OpenStatus => ({ open: false, detail, today, serving: null, servingDetail: null });

  const minutes = mtNow.getHours() * 60 + mtNow.getMinutes();
  if (row && isRowOpen(row) && minutes < toMinutes(row.openTime)) {
    return closed(`Opens ${fmtTime(row.openTime)}`);
  }

  for (let i = 1; i <= 7; i++) {
    const d = (today + i) % 7;
    const next = hours.find((h) => h.dayOfWeek === d);
    if (next && isRowOpen(next)) {
      return closed(`Opens ${i === 1 ? "tomorrow" : DAY_SHORT[d]} ${fmtTime(next.openTime)}`);
    }
  }
  return closed("Closed");
}
