"use client";

import { useEffect, useState } from "react";
import { toZonedTime } from "date-fns-tz";
import { isOpenNow, type HoursRow } from "@/lib/hours-logic";
import { fmtTime } from "./hours-format";

const MOUNTAIN_TZ = "America/Denver";

export type OpenState = {
  open: boolean;
  /** "Closes 4pm" / "Opens 11am" / "Opens Mon 11am" */
  detail: string;
};

/**
 * Live open/closed status computed on the client in Mountain Time,
 * refreshed every 30 seconds.
 */
export function useOpenState(hours: HoursRow[]): OpenState | null {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = toZonedTime(new Date(), MOUNTAIN_TZ);
      const open = isOpenNow(hours, now);
      const today = hours.find((h) => h.dayOfWeek === now.getDay());
      if (open && today?.closeTime) {
        setState({ open, detail: `Closes ${fmtTime(today.closeTime)}` });
        return;
      }
      const minutes = now.getHours() * 60 + now.getMinutes();
      const opensLaterToday =
        today && !today.isClosed && today.openTime &&
        minutes < Number(today.openTime.split(":")[0]) * 60 + Number(today.openTime.split(":")[1]);
      if (opensLaterToday && today.openTime) {
        setState({ open: false, detail: `Opens ${fmtTime(today.openTime)}` });
        return;
      }
      for (let i = 1; i <= 7; i++) {
        const d = (now.getDay() + i) % 7;
        const row = hours.find((h) => h.dayOfWeek === d);
        if (row && !row.isClosed && row.openTime) {
          const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d];
          setState({ open: false, detail: `Opens ${i === 1 ? "tomorrow" : dayName} ${fmtTime(row.openTime)}` });
          return;
        }
      }
      setState({ open: false, detail: "Closed" });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [hours]);

  return state;
}
