"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type BannerData = {
  id?: string;
  bannerText: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
};

const empty: BannerData = { bannerText: "", isActive: false, startDate: "", endDate: "" };

export function BannerForm({ initial }: { initial: BannerData | null }) {
  const [data, setData] = useState<BannerData>(initial ?? empty);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const patch = (p: Partial<BannerData>) => setData((d) => ({ ...d, ...p }));

  const save = async () => {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/banner", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) {
      const result = await res.json();
      patch({ id: result.id });
      setMsg("Saved!");
    } else {
      setMsg("Error saving.");
    }
  };

  return (
    <div className="space-y-6 bg-card border border-border rounded-lg p-6 max-w-xl">
      <div className="space-y-2">
        <Label>Banner Text</Label>
        <Input value={data.bannerText} onChange={(e) => patch({ bannerText: e.target.value })} placeholder="e.g. Closed today due to weather" />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={data.isActive} onCheckedChange={(v) => patch({ isActive: v })} />
        <Label>{data.isActive ? "Active" : "Inactive"}</Label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date/Time</Label>
          <Input type="datetime-local" value={data.startDate} onChange={(e) => patch({ startDate: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>End Date/Time</Label>
          <Input type="datetime-local" value={data.endDate} onChange={(e) => patch({ endDate: e.target.value })} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={save} disabled={saving} className="bg-forest text-cream hover:bg-forest-dark">
          {saving ? "Saving..." : "Save Banner"}
        </Button>
        {msg && <span className="text-sm font-semibold text-mustard">{msg}</span>}
      </div>
    </div>
  );
}
