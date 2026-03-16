/**
 * Determines whether the restaurant is currently open
 * based on the hours schedule and a Mountain Time date.
 */
export type HoursRow = {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
};

export function isOpenNow(hours: HoursRow[], mtNow: Date): boolean {
  const day = mtNow.getDay();
  const row = hours.find((h) => h.dayOfWeek === day);
  if (!row || row.isClosed || !row.openTime || !row.closeTime) return false;

  const currentMinutes = mtNow.getHours() * 60 + mtNow.getMinutes();
  const [oh, om] = row.openTime.split(":").map(Number);
  const [ch, cm] = row.closeTime.split(":").map(Number);

  return currentMinutes >= oh * 60 + om && currentMinutes < ch * 60 + cm;
}
