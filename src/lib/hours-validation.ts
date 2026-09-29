import { type HoursRow } from "./hours-logic";

/**
 * Returns true if any open day is missing an open or close time.
 */
export function hasIncompleteHours(rows: HoursRow[]): boolean {
  return rows.some((r) => !r.isClosed && (!r.openTime || !r.closeTime));
}

/**
 * Returns the days (0 = Sunday) whose hours are out of order: close not after open,
 * or an After Hours start that isn't strictly between open and close.
 */
export function invalidHoursDays(rows: HoursRow[]): number[] {
  return rows
    .filter((r) => {
      if (r.isClosed || !r.openTime || !r.closeTime) return false;
      if (r.closeTime <= r.openTime) return true;
      return !!r.afterHoursStart && (r.afterHoursStart <= r.openTime || r.afterHoursStart >= r.closeTime);
    })
    .map((r) => r.dayOfWeek);
}
