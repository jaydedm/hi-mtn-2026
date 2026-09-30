"use client";

import type { HoursRow } from "@/lib/hours-logic";
import { DAY_LONG, rowLabel } from "@/lib/hours-format";
import { fmtWindow, menuWindows } from "@/lib/menu-schedule";
import { useOpenStatus } from "@/components/site/use-open-status";
import { MenuSegments } from "@/components/site/schedule-list";

const ORDER = [1, 2, 3, 4, 5, 6, 0];

/** Monday-first weekly schedule with each day's menu windows; today (Mountain Time) highlighted. */
export function WeekHours({ hours }: { hours: HoursRow[] }) {
  const status = useOpenStatus(hours);

  return (
    <ul className="divide-y divide-dotted divide-ds-ink/20">
      {ORDER.map((d) => {
        const row = hours.find((h) => h.dayOfWeek === d);
        const label = row ? rowLabel(row) : "Closed";
        const w = menuWindows(row);
        const isToday = status?.today === d;
        return (
          <li key={d} aria-current={isToday ? "date" : undefined} className={`py-3 px-3 rounded-xl ${isToday ? "bg-ds-highlight/30" : ""}`}>
            <div className="flex items-center justify-between gap-4 font-label">
              <span className="flex items-center gap-3">
                {DAY_LONG[d]}
                {isToday && <span className="ds-hut bg-ds-highlight px-3 pb-0.5 text-xs uppercase tracking-widest">Today</span>}
              </span>
              <span className={label === "Closed" ? "text-ds-ink/50" : ""}>{label}</span>
            </div>
            <MenuSegments
              day={DAY_LONG[d]}
              lunch={w.lunch ? fmtWindow(w.lunch) : null}
              afterHours={w["after-hours"] ? fmtWindow(w["after-hours"]) : null}
            />
          </li>
        );
      })}
    </ul>
  );
}
