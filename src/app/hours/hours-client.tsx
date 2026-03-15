"use client";

import { useEffect, useState } from "react";
import { toZonedTime } from "date-fns-tz";
import { format, getDay } from "date-fns";

const MOUNTAIN_TZ = "America/Denver";
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type HoursRow = {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
};

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return format(d, "h:mm a");
}

function isOpenNow(hours: HoursRow[], mtNow: Date): boolean {
  const day = getDay(mtNow);
  const row = hours.find((h) => h.dayOfWeek === day);
  if (!row || row.isClosed || !row.openTime || !row.closeTime) return false;

  const currentMinutes = mtNow.getHours() * 60 + mtNow.getMinutes();
  const [oh, om] = row.openTime.split(":").map(Number);
  const [ch, cm] = row.closeTime.split(":").map(Number);

  return currentMinutes >= oh * 60 + om && currentMinutes < ch * 60 + cm;
}

export function HoursClient({ hours }: { hours: HoursRow[] }) {
  const [mtNow, setMtNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setMtNow(toZonedTime(new Date(), MOUNTAIN_TZ));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!mtNow) return null;

  const today = getDay(mtNow);
  const open = isOpenNow(hours, mtNow);

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="font-serif text-4xl font-bold text-forest-dark text-center mb-2">
        Our Hours
      </h1>
      <p className="text-center text-wood text-sm mb-8">
        All times are Mountain Time (MT)
      </p>

      {/* Open/Closed indicator */}
      <div
        className={`text-center py-4 px-6 rounded-lg mb-10 text-xl font-bold font-serif ${
          open
            ? "bg-forest text-mustard"
            : "bg-wood text-cream"
        }`}
      >
        {open ? "✦ Yes, we're open! ✦" : "Sorry, we are closed."}
      </div>

      {/* Hours table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-forest text-cream">
              <th className="text-left py-3 px-4 font-semibold">Day</th>
              <th className="text-right py-3 px-4 font-semibold">Hours</th>
            </tr>
          </thead>
          <tbody>
            {hours.map((row) => (
              <tr
                key={row.dayOfWeek}
                className={`border-t border-border ${
                  row.dayOfWeek === today
                    ? "bg-mustard/20 font-semibold"
                    : "even:bg-cream-dark"
                }`}
              >
                <td className="py-3 px-4">
                  {DAY_NAMES[row.dayOfWeek]}
                  {row.dayOfWeek === today && (
                    <span className="ml-2 text-xs text-mustard font-bold">← Today</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  {row.isClosed || !row.openTime || !row.closeTime
                    ? "Closed"
                    : `${formatTime(row.openTime)} – ${formatTime(row.closeTime)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
