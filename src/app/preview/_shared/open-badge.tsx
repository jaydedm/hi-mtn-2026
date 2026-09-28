"use client";

import type { HoursRow } from "@/lib/hours-logic";
import { useOpenState } from "./use-open-state";

/**
 * Live "Open · Closes 4pm" pill. Purely presentational; parents pass class names.
 */
export function OpenBadge({
  hours,
  className = "",
  dotClass = "",
  openText = "Open now",
  closedText = "Closed",
}: {
  hours: HoursRow[];
  className?: string;
  dotClass?: string;
  openText?: string;
  closedText?: string;
}) {
  const s = useOpenState(hours);
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-live="polite">
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${dotClass} ${
          s?.open ? "bg-emerald-500" : "bg-rose-500"
        }`}
        aria-hidden="true"
      />
      <span>{s ? (s.open ? openText : closedText) : "…"}</span>
      {s && <span className="opacity-70">· {s.detail}</span>}
    </span>
  );
}
