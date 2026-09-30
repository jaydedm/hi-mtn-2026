"use client";

import type { HoursRow } from "@/lib/hours-logic";
import { useOpenStatus } from "./use-open-status";

/**
 * Live "Open · Closes 8pm" indicator. With `showServing`, adds a line such as
 * "Lunch until 4pm". Purely presentational; parents pass class names.
 */
export function OpenBadge({
  hours,
  className = "",
  dotClass = "",
  openText = "Open now",
  closedText = "Closed",
  showServing = false,
  servingClass = "",
}: {
  hours: HoursRow[];
  className?: string;
  dotClass?: string;
  openText?: string;
  closedText?: string;
  showServing?: boolean;
  servingClass?: string;
}) {
  const s = useOpenStatus(hours);
  return (
    <span className="inline-flex flex-col items-center md:items-start" aria-live="polite">
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${dotClass} ${s?.open ? "bg-emerald-500 text-emerald-500" : "bg-rose-500 text-rose-500"}`}
          aria-hidden="true"
        />
        <span>{s ? (s.open ? openText : closedText) : "…"}</span>
        {s && <span className="opacity-70">· {s.detail}</span>}
      </span>
      {showServing && s?.servingDetail && (
        <span className={`font-label text-xs uppercase tracking-widest ${servingClass}`}>Now serving: {s.servingDetail}</span>
      )}
    </span>
  );
}
