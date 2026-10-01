"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { invalidHoursDays } from "@/lib/hours-validation";
import { fmtTime } from "@/lib/hours-format";
import { toMinutes } from "@/lib/menu-schedule";
import { SaveToast, type SaveState } from "../_components/ui";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ORDER = [1, 2, 3, 4, 5, 6, 0];
const DEFAULT_AFTER_HOURS = "16:00";
// Timeline scale for the day bars: 6am → midnight.
const SCALE_START = 6 * 60;
const SCALE_END = 24 * 60;

type Row = {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  hasAfterHours: boolean;
  afterHoursStart: string;
};

const pct = (t: string) => ((Math.min(SCALE_END, Math.max(SCALE_START, toMinutes(t))) - SCALE_START) / (SCALE_END - SCALE_START)) * 100;
const same = (a: Row[], b: Row[]) => JSON.stringify(a) === JSON.stringify(b);

/** Proportional bar of the day: Lunch (blue) then After Hours (dark), on a 6am–midnight scale. */
function DayBar({ row, invalid }: { row: Row; invalid: boolean }) {
  if (row.isClosed || !row.openTime || !row.closeTime || invalid) {
    return <div className="h-2.5 rounded-full bg-muted" aria-hidden="true" />;
  }
  const open = pct(row.openTime);
  const close = pct(row.closeTime);
  const split = row.hasAfterHours && row.afterHoursStart ? pct(row.afterHoursStart) : close;
  return (
    <div className="relative h-2.5 rounded-full bg-muted" aria-hidden="true">
      <div className="absolute inset-y-0 rounded-l-full bg-ds-secondary" style={{ left: `${open}%`, width: `${split - open}%` }} />
      {split < close && <div className="absolute inset-y-0 rounded-r-full bg-ds-ink" style={{ left: `${split}%`, width: `${close - split}%` }} />}
    </div>
  );
}

export function HoursForm({ initial }: { initial: Row[] }) {
  const [saved, setSaved] = useState<Row[]>(initial);
  const [rows, setRows] = useState<Row[]>(initial);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const dismiss = useCallback(() => setSave({ kind: "idle" }), []);

  const byDay = useMemo(() => new Map(rows.map((r, i) => [r.dayOfWeek, i])), [rows]);
  const update = (i: number, patch: Partial<Row>) => setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const payload = rows.map((r) => ({
    dayOfWeek: r.dayOfWeek,
    isClosed: r.isClosed,
    openTime: r.isClosed ? null : r.openTime || null,
    closeTime: r.isClosed ? null : r.closeTime || null,
    afterHoursStart: r.isClosed || !r.hasAfterHours ? null : r.afterHoursStart || null,
  }));
  const hasIncomplete = rows.some((r) => !r.isClosed && (!r.openTime || !r.closeTime || (r.hasAfterHours && !r.afterHoursStart)));
  const invalidDays = new Set(invalidHoursDays(payload));
  const dirty = !same(rows, saved);

  const copyMondayToWeekdays = () => {
    const mon = rows[byDay.get(1)!];
    setRows((prev) => prev.map((r) => (r.dayOfWeek >= 2 && r.dayOfWeek <= 5 ? { ...mon, dayOfWeek: r.dayOfWeek } : r)));
  };

  const submit = async () => {
    setSave({ kind: "saving" });
    try {
      const res = await fetch("/api/hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours: payload }),
      });
      if (!res.ok) throw new Error();
      setSaved(rows);
      setSave({ kind: "saved" });
    } catch {
      setSave({ kind: "error", message: "Couldn’t save hours. Please try again." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-full bg-ds-secondary" aria-hidden="true" /> Lunch menu
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-full bg-ds-ink" aria-hidden="true" /> After Hours menu
        </span>
        <span>Bars run 6am to midnight.</span>
        <Button type="button" size="sm" variant="outline" className="ml-auto" onClick={copyMondayToWeekdays}>
          <Copy aria-hidden="true" /> Copy Monday to Tue–Fri
        </Button>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {ORDER.map((d) => {
          const i = byDay.get(d);
          if (i === undefined) return null;
          const row = rows[i];
          const name = DAY_NAMES[d];
          const invalid = invalidDays.has(d);
          return (
            <li key={d} className={`px-5 py-4 ${invalid ? "bg-red-50" : ""}`}>
              <fieldset aria-invalid={invalid || undefined} className="grid gap-4 md:grid-cols-[9rem_1fr] md:items-start">
                <legend className="sr-only">{name}</legend>
                <div className="flex items-center justify-between gap-3 md:flex-col md:items-start">
                  <span className="font-semibold" aria-hidden="true">
                    {name}
                  </span>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <Switch checked={!row.isClosed} onCheckedChange={(open) => update(i, { isClosed: !open })} aria-label={`${name} open`} />
                    <span className={row.isClosed ? "text-muted-foreground" : "font-medium text-emerald-700"}>{row.isClosed ? "Closed" : "Open"}</span>
                  </label>
                </div>

                {row.isClosed ? (
                  <p className="self-center text-sm text-muted-foreground">Closed all day.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-end gap-3">
                      <label className="text-xs font-medium text-muted-foreground">
                        Opens
                        <Input type="time" value={row.openTime} onChange={(e) => update(i, { openTime: e.target.value })} className="mt-1 h-9 w-32 text-sm text-foreground" aria-label={`${name} opens`} />
                      </label>
                      <label className="text-xs font-medium text-muted-foreground">
                        Closes
                        <Input type="time" value={row.closeTime} onChange={(e) => update(i, { closeTime: e.target.value })} className="mt-1 h-9 w-32 text-sm text-foreground" aria-label={`${name} closes`} />
                      </label>
                      <div className="flex min-h-9 items-center gap-3 rounded-lg bg-muted/50 px-3 py-1.5">
                        <label className="inline-flex items-center gap-2 text-sm">
                          <Switch
                            checked={row.hasAfterHours}
                            onCheckedChange={(on) => update(i, { hasAfterHours: on, afterHoursStart: row.afterHoursStart || DEFAULT_AFTER_HOURS })}
                            aria-label={`${name} has After Hours`}
                          />
                          After Hours
                        </label>
                        {row.hasAfterHours && (
                          <label className="inline-flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">starts</span>
                            <Input type="time" value={row.afterHoursStart} onChange={(e) => update(i, { afterHoursStart: e.target.value })} className="h-8 w-28 bg-card" aria-label={`${name} After Hours starts`} />
                          </label>
                        )}
                      </div>
                    </div>
                    <DayBar row={row} invalid={invalid} />
                    {invalid ? (
                      <p role="alert" className="text-xs font-semibold text-red-700">
                        Closing time must be after opening, and After Hours must start between them.
                      </p>
                    ) : (
                      row.openTime &&
                      row.closeTime && (
                        <p className="text-xs text-muted-foreground">
                          {row.hasAfterHours && row.afterHoursStart
                            ? `Lunch ${fmtTime(row.openTime)}–${fmtTime(row.afterHoursStart)}, then After Hours until ${fmtTime(row.closeTime)}`
                            : `Lunch menu ${fmtTime(row.openTime)}–${fmtTime(row.closeTime)}`}
                        </p>
                      )
                    )}
                  </div>
                )}
              </fieldset>
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
        <span className="text-sm">
          {hasIncomplete ? (
            <span className="font-medium text-red-700">Fill in every time for open days.</span>
          ) : dirty ? (
            <span className="font-medium">You have unsaved changes.</span>
          ) : (
            <span className="text-muted-foreground">All changes saved.</span>
          )}
        </span>
        <div className="ml-auto flex gap-2">
          {dirty && (
            <Button type="button" variant="ghost" onClick={() => setRows(saved)}>
              Discard
            </Button>
          )}
          <Button type="button" onClick={submit} disabled={!dirty || save.kind === "saving" || hasIncomplete || invalidDays.size > 0}>
            {save.kind === "saving" ? "Saving…" : "Save hours"}
          </Button>
        </div>
      </div>

      <SaveToast state={save} onDismiss={dismiss} />
    </div>
  );
}
