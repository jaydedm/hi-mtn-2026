"use client";

import { useEffect, useState } from "react";
import { toZonedTime } from "date-fns-tz";
import type { HoursRow } from "@/lib/hours-logic";
import { openStatus, type OpenStatus } from "@/lib/open-status";
import { MOUNTAIN_TZ } from "@/lib/site";

/**
 * Live open/closed + menu-being-served status in Mountain Time, refreshed every
 * 30 seconds. Null until mounted so server and client markup match.
 */
export function useOpenStatus(hours: HoursRow[]): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(openStatus(hours, toZonedTime(new Date(), MOUNTAIN_TZ)));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [hours]);

  return status;
}
