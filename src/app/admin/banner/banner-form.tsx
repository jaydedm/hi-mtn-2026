"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BannerBar } from "@/components/banner";
import { BANNER_LIMITS, validateBanner, type BannerInput } from "@/lib/banner-validation";
import { Panel, SaveToast, Segmented, type SaveState } from "../_components/ui";
import { textareaClass } from "../menu/editor-fields";

type More = "none" | "details" | "link";

const EMPTY: BannerInput = {
  label: "",
  bannerText: "",
  details: "",
  linkUrl: "",
  linkText: "",
  bannerType: "casual",
  isActive: false,
  startDate: "",
  endDate: "",
};

/** ISO → value for <input type="datetime-local"> in the browser's own time zone. */
function toLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Banners saved before the headline redesign have one long message. Move it into Details
 * and ask for a short headline instead, so it fits the new one-line bar.
 */
function fromSaved(initial: BannerInput | null): { data: BannerInput; legacy: boolean } {
  if (!initial) return { data: EMPTY, legacy: false };
  const data = { ...initial, startDate: toLocalInput(initial.startDate), endDate: toLocalInput(initial.endDate) };
  if (data.bannerText.length > BANNER_LIMITS.headline && !data.details) {
    return { data: { ...data, details: data.bannerText.slice(0, BANNER_LIMITS.details), bannerText: "" }, legacy: true };
  }
  return { data, legacy: false };
}

function Counter({ value, max }: { value: string; max: number }) {
  return (
    <span className={`tabular-nums ${value.length > max * 0.9 ? "font-semibold text-amber-700" : ""}`}>
      {value.length}/{max}
    </span>
  );
}

export function BannerForm({ initial }: { initial: BannerInput | null }) {
  const router = useRouter();
  const start = useMemo(() => fromSaved(initial), [initial]);
  const [data, setData] = useState<BannerInput>(start.data);
  const [legacy, setLegacy] = useState(start.legacy);
  const [more, setMore] = useState<More>(start.data.details ? "details" : start.data.linkUrl ? "link" : "none");
  const [scheduled, setScheduled] = useState(start.data.startDate !== "" || start.data.endDate !== "");
  const snapshot = JSON.stringify({ data, more, scheduled });
  // What's on the server, in form terms. A legacy banner counts as unsaved until it's re-saved.
  const [savedSnapshot, setSavedSnapshot] = useState(snapshot);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const dismiss = useCallback(() => setSave({ kind: "idle" }), []);

  const patch = (u: Partial<BannerInput>) => setData((p) => ({ ...p, ...u }));

  // What actually gets saved: only the "more info" fields for the chosen mode, dates only when scheduled.
  const payload: BannerInput = {
    ...data,
    details: more === "details" ? data.details : "",
    linkUrl: more === "link" ? data.linkUrl : "",
    linkText: more === "link" ? data.linkText : "",
    startDate: scheduled && data.startDate ? new Date(data.startDate).toISOString() : "",
    endDate: scheduled && data.endDate ? new Date(data.endDate).toISOString() : "",
  };
  const check = validateBanner(payload as unknown as Record<string, unknown>);
  const problem = "error" in check ? check.error : null;
  const dirty = legacy || snapshot !== savedSnapshot;

  const status = !data.isActive
    ? { dot: "bg-muted-foreground", text: "Off. Visitors won’t see a banner." }
    : scheduled && data.startDate
      ? { dot: "bg-amber-500", text: "Scheduled. It shows only between the dates below." }
      : { dot: "bg-emerald-500", text: "On. It shows at the top of every page until you turn it off." };

  const submit = async () => {
    setSave({ kind: "saving" });
    try {
      const res = await fetch("/api/banner", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Couldn’t save the banner. Please try again.");
      const next: BannerInput = { ...data, id: body.id };
      setData(next);
      setSavedSnapshot(JSON.stringify({ data: next, more, scheduled }));
      setLegacy(false);
      setSave({ kind: "saved" });
      router.refresh();
    } catch (e) {
      setSave({ kind: "error", message: e instanceof Error ? e.message : "Couldn’t save the banner. Please try again." });
    }
  };

  const discard = () => {
    const saved = JSON.parse(savedSnapshot) as { data: BannerInput; more: More; scheduled: boolean };
    setData(saved.data);
    setMore(saved.more);
    setScheduled(saved.scheduled);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-start">
      <div className="space-y-6">
        <Panel
          title="Show the banner"
          description={
            <span className="inline-flex items-center gap-2">
              <span className={`size-2 rounded-full ${status.dot}`} aria-hidden="true" />
              {status.text}
            </span>
          }
          actions={<Switch checked={data.isActive} onCheckedChange={(v) => patch({ isActive: v })} aria-label="Show the banner on the website" />}
        >
          <p className="text-sm text-muted-foreground">Use it for closures, holiday hours, specials or anything visitors should see first.</p>
        </Panel>

        <Panel title="Style">
          <div role="radiogroup" aria-label="Banner style" className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["casual", Megaphone, "Announcement", "Dark bar with a gold label, for everyday news.", "border-ds-mustard bg-ds-mustard/10"],
                ["emergency", AlertTriangle, "Urgent", "Red bar, for closures and anything time-critical.", "border-ds-red bg-ds-red/5"],
              ] as const
            ).map(([type, Icon, title, desc, on]) => (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={data.bannerType === type}
                onClick={() => patch({ bannerType: type })}
                className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition ${data.bannerType === type ? on : "border-border hover:border-input"}`}
              >
                <Icon className={`mt-0.5 size-5 shrink-0 ${type === "emergency" ? "text-ds-red" : "text-amber-600"}`} aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="block text-xs text-muted-foreground">{desc}</span>
                </span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Message" description="Keep the headline to one short line. Put everything else in Details.">
          {legacy && (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
              The banner now has a short headline plus optional details. Your previous message was moved into{" "}
              <strong>Details</strong>. Add a short headline above it, then save.
            </p>
          )}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
              <label className="text-sm font-medium">
                Label <span className="font-normal text-muted-foreground">(optional)</span>
                <Input
                  value={data.label}
                  maxLength={BANNER_LIMITS.label}
                  onChange={(e) => patch({ label: e.target.value })}
                  placeholder={data.bannerType === "emergency" ? "Closed today" : "Summer hours"}
                  className="mt-1 h-9"
                />
                <span className="mt-1 flex justify-between text-xs font-normal text-muted-foreground">
                  <span>Small tag on the left</span>
                  <Counter value={data.label} max={BANNER_LIMITS.label} />
                </span>
              </label>
              <label className="text-sm font-medium">
                Headline
                <Input
                  value={data.bannerText}
                  maxLength={BANNER_LIMITS.headline}
                  onChange={(e) => patch({ bannerText: e.target.value })}
                  placeholder={data.bannerType === "emergency" ? "Snowstorm. We’ll reopen tomorrow at 11am" : "Grill open until 4, shakes & dinner until 8"}
                  className="mt-1 h-9"
                />
                <span className="mt-1 flex justify-between text-xs font-normal text-muted-foreground">
                  <span>One line on phones works best</span>
                  <Counter value={data.bannerText} max={BANNER_LIMITS.headline} />
                </span>
              </label>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">More info</p>
              <Segmented
                label="More info"
                value={more}
                onChange={setMore}
                options={[
                  ["none", "None"],
                  ["details", "Details"],
                  ["link", "Link"],
                ]}
              />
              {more === "details" && (
                <label className="mt-3 block text-sm font-medium">
                  <span className="sr-only">Details</span>
                  <textarea
                    rows={4}
                    maxLength={BANNER_LIMITS.details}
                    value={data.details}
                    onChange={(e) => patch({ details: e.target.value })}
                    placeholder="The full story. Visitors tap “Details” in the banner to read it."
                    className={textareaClass}
                  />
                  <span className="mt-1 flex justify-between text-xs font-normal text-muted-foreground">
                    <span>Opens under the bar when visitors tap “Details”.</span>
                    <Counter value={data.details} max={BANNER_LIMITS.details} />
                  </span>
                </label>
              )}
              {more === "link" && (
                <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_12rem]">
                  <label className="text-sm font-medium">
                    Link to
                    <Input value={data.linkUrl} onChange={(e) => patch({ linkUrl: e.target.value })} placeholder="/hours or https://…" className="mt-1 h-9" />
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">A page on this site like /menu, or a full web address.</span>
                  </label>
                  <label className="text-sm font-medium">
                    Link text
                    <Input
                      value={data.linkText}
                      maxLength={BANNER_LIMITS.linkText}
                      onChange={(e) => patch({ linkText: e.target.value })}
                      placeholder="See hours"
                      className="mt-1 h-9"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </Panel>

        <Panel title="When it shows">
          <Segmented
            label="When the banner shows"
            value={scheduled ? "dates" : "always"}
            onChange={(v) => {
              setScheduled(v === "dates");
              if (v === "always") patch({ startDate: "", endDate: "" });
            }}
            options={[
              ["always", "Until I turn it off"],
              ["dates", "Between dates"],
            ]}
          />
          {scheduled && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Starts
                <Input type="datetime-local" autoComplete="off" value={data.startDate} onChange={(e) => patch({ startDate: e.target.value })} className="mt-1 h-9" />
              </label>
              <label className="text-sm font-medium">
                Ends
                <Input type="datetime-local" autoComplete="off" value={data.endDate} onChange={(e) => patch({ endDate: e.target.value })} className="mt-1 h-9" />
              </label>
            </div>
          )}
        </Panel>
      </div>

      <div className="space-y-4 lg:sticky lg:top-10">
        <Panel title="Preview" description="The real banner, exactly as visitors see it. Try “Details”.">
          <div className={`overflow-hidden rounded-lg ring-1 ring-border ${data.isActive ? "" : "opacity-40"}`}>
            <BannerBar
              content={{
                label: payload.label,
                bannerText: payload.bannerText || "Your headline goes here",
                details: payload.details,
                linkUrl: payload.linkUrl ? "#" : "",
                linkText: payload.linkText,
                bannerType: payload.bannerType,
              }}
              onDismiss={() => {}}
            />
            <div className="flex items-center justify-between bg-ds-cream px-4 py-2">
              <span className="font-script text-xl text-ds-red">Hi-Mountain</span>
              <span className="rounded-full bg-ds-blue px-3 py-1 text-xs font-semibold text-ds-cream">Call</span>
            </div>
          </div>
          {!data.isActive && <p className="mt-2 text-xs text-muted-foreground">The banner is off, so this won’t show yet.</p>}
        </Panel>

        <div className="space-y-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
          {problem && dirty && <p className="text-xs font-semibold text-red-700">{problem}</p>}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{dirty ? "Unsaved changes" : "All changes saved"}</span>
            <div className="ml-auto flex gap-2">
              {dirty && (
                <Button type="button" variant="ghost" onClick={discard}>
                  Discard
                </Button>
              )}
              <Button type="button" onClick={submit} disabled={!dirty || !!problem || save.kind === "saving"}>
                {save.kind === "saving" ? "Saving…" : "Save banner"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SaveToast state={save} onDismiss={dismiss} />
    </div>
  );
}
