"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Row = { dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean };

export function HoursForm({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const update = (i: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const hasIncomplete = rows.some(
    (r) => !r.isClosed && (!r.openTime || !r.closeTime)
  );

  const save = async () => {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/hours", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hours: rows.map((r) => ({
          ...r,
          openTime: r.isClosed ? null : r.openTime || null,
          closeTime: r.isClosed ? null : r.closeTime || null,
        })),
      }),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved!" : "Error saving.");
  };

  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div key={row.dayOfWeek} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
          <span className="w-28 font-semibold">{DAY_NAMES[row.dayOfWeek]}</span>
          <div className="flex items-center gap-2">
            <Switch
              checked={!row.isClosed}
              onCheckedChange={(open) => update(i, { isClosed: !open })}
            />
            <Label className="text-sm">{row.isClosed ? "Closed" : "Open"}</Label>
          </div>
          {!row.isClosed && (
            <>
              <Input
                type="time"
                value={row.openTime}
                onChange={(e) => update(i, { openTime: e.target.value })}
                className="w-32"
              />
              <span>to</span>
              <Input
                type="time"
                value={row.closeTime}
                onChange={(e) => update(i, { closeTime: e.target.value })}
                className="w-32"
              />
            </>
          )}
        </div>
      ))}
      <div className="flex items-center gap-4">
        <Button onClick={save} disabled={saving || hasIncomplete} className="bg-forest text-cream hover:bg-forest-dark disabled:opacity-40">
          {saving ? "Saving…" : "Save Hours"}
        </Button>
        {hasIncomplete && (
          <span className="text-xs text-red-600 font-semibold">
            All open days must have both open and close times.
          </span>
        )}
        {msg && <span className="text-sm font-semibold text-mustard">{msg}</span>}
      </div>
    </div>
  );
}
