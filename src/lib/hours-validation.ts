import { type HoursRow } from "./hours-logic";

/**
 * Returns true if any open day is missing an open or close time.
 */
export function hasIncompleteHours(rows: HoursRow[]): boolean {
  return rows.some((r) => !r.isClosed && (!r.openTime || !r.closeTime));
}
