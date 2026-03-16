"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type BannerData = {
  id?: string;
  bannerText: string;
  bannerType: "casual" | "emergency";
  isActive: boolean;
  startDate: string;
  endDate: string;
};

const empty: BannerData = { bannerText: "", bannerType: "casual", isActive: false, startDate: "", endDate: "" };

export function BannerForm({ initial }: { initial: BannerData | null }) {
  const baseline = useMemo(() => initial ?? empty, []);
  const [data, setData] = useState<BannerData>(baseline);
  const [saving, setSaving] = useState(false);
  const [previewed, setPreviewed] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const hasChanges =
    data.bannerText !== baseline.bannerText ||
    data.bannerType !== baseline.bannerType ||
    data.isActive !== baseline.isActive ||
    data.startDate !== baseline.startDate ||
    data.endDate !== baseline.endDate;

  const needsEndDate = data.startDate !== "" && data.endDate === "";
  const canSave = hasChanges && !needsEndDate && (previewed || !data.isActive);

  const patch = (p: Partial<BannerData>) => { setData((d) => ({ ...d, ...p })); setMsg(""); setPreviewed(false); };

  const save = async () => {
    setSaving(true);
    setMsg("");
    // Convert datetime-local values to full ISO strings with the admin's timezone
    const payload = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : "",
      endDate: data.endDate ? new Date(data.endDate).toISOString() : "",
    };
    const res = await fetch("/api/banner", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      const result = await res.json();
      patch({ id: result.id });
      setMsg("Saved!");
      router.refresh();
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

      {/* Banner Type */}
      <div className="space-y-2">
        <Label>Banner Type</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => patch({ bannerType: "casual" })}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              data.bannerType === "casual"
                ? "bg-mustard text-forest-dark"
                : "bg-cream-dark text-wood hover:bg-border"
            }`}
          >
            📢 Casual
          </button>
          <button
            type="button"
            onClick={() => patch({ bannerType: "emergency" })}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              data.bannerType === "emergency"
                ? "bg-red-700 text-white"
                : "bg-cream-dark text-wood hover:bg-border"
            }`}
          >
            ⚠️ Emergency
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={data.isActive} onCheckedChange={(v) => patch({ isActive: v })} />
        <Label>{data.isActive ? "Active" : "Inactive"}</Label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date/Time <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input
            type="datetime-local"
            value={data.startDate}
            onChange={(e) => patch({ startDate: e.target.value })}
            placeholder="Select start date"
            className={data.startDate ? "" : "text-muted-foreground"}
          />
          {!data.startDate && (
            <p className="text-xs text-muted-foreground">📅 Tap to set a start date</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>End Date/Time <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input
            type="datetime-local"
            value={data.endDate}
            onChange={(e) => patch({ endDate: e.target.value })}
            placeholder="Select end date"
            className={data.endDate ? "" : "text-muted-foreground"}
          />
          {!data.endDate && (
            <p className="text-xs text-muted-foreground">📅 Tap to set an end date</p>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Leave dates empty to keep the banner active indefinitely (until manually toggled off).
      </p>
      {needsEndDate && (
        <p className="text-xs text-red-600 font-semibold">
          An end date is required when a start date is set.
        </p>
      )}
      {/* Preview */}
      {previewed && data.bannerText && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Preview</Label>
          <div
            className={
              data.bannerType === "emergency"
                ? "bg-red-700 text-white text-center py-3 px-4 font-bold text-base tracking-wide animate-pulse rounded-lg"
                : "banner-casual bg-mustard text-forest-dark text-center py-2 px-4 font-semibold text-sm rounded-lg"
            }
          >
            {data.bannerType === "emergency" && "⚠️ "}
            {data.bannerText}
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        {data.isActive && hasChanges && !needsEndDate && data.bannerText && (
          <Button
            type="button"
            onClick={() => setPreviewed(true)}
            disabled={previewed}
            variant="outline"
            className="border-forest text-forest-dark font-semibold disabled:opacity-40"
          >
            {previewed ? "✓ Previewed" : "Preview Banner"}
          </Button>
        )}
        <Button
          onClick={save}
          disabled={saving || !canSave}
          className="bg-mustard text-forest-dark font-semibold hover:bg-mustard-light disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save Banner"}
        </Button>
        {msg && <span className="text-sm font-semibold text-mustard">{msg}</span>}
      </div>
    </div>
  );
}
