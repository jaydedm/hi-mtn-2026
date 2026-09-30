"use client";

import { useEffect, useState } from "react";
import { ACTIVE_THEME, THEME_OPTIONS, isThemeValue, type ThemeChoice } from "@/lib/theme";

const LAB_KEY = "hm-theme-lab";
const CHOICE_KEY = "hm-theme";
const KEYS = ["palette", "night", "edge", "type"] as const;
const LABELS: Record<(typeof KEYS)[number], string> = {
  palette: "Colors",
  night: "After Hours",
  edge: "Edge",
  type: "Fonts",
};

function optionLabel(v: unknown): string {
  return typeof v === "string" ? v : (v as { label: string }).label;
}

function readChoice(): ThemeChoice {
  try {
    const saved = JSON.parse(localStorage.getItem(CHOICE_KEY) ?? "{}") as Partial<Record<string, unknown>>;
    const out = { ...ACTIVE_THEME };
    for (const k of KEYS) if (isThemeValue(k, saved[k])) (out as Record<string, string>)[k] = saved[k] as string;
    return out;
  } catch {
    return { ...ACTIVE_THEME };
  }
}

function apply(choice: ThemeChoice | null) {
  const el = document.documentElement;
  for (const k of KEYS) {
    const attr = `data-${k}`;
    if (choice) el.setAttribute(attr, choice[k]);
    else if (k === "palette" || k === "night") el.removeAttribute(attr);
    else el.setAttribute(attr, ACTIVE_THEME[k]);
  }
}

/**
 * Theme lab: open any page with `?themelab` to try palettes, After Hours colors, edges and type
 * sets live, without deploying. The choice is saved in this browser only; `?themelab=off` (or
 * the Close button) turns it off. "Copy" gives the ACTIVE_THEME line to paste into theme.ts.
 */
export function ThemeLab() {
  const [on, setOn] = useState(false);
  const [choice, setChoice] = useState<ThemeChoice>(ACTIVE_THEME);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(location.search).get("themelab");
    if (param === "off") localStorage.removeItem(LAB_KEY);
    else if (param !== null) localStorage.setItem(LAB_KEY, "1");
    if (localStorage.getItem(LAB_KEY) !== "1") return;
    const c = readChoice();
    apply(c);
    // Syncing with localStorage after mount (it isn't available during SSR).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(c);
    setOn(true);
  }, []);

  if (!on) return null;

  const update = (k: (typeof KEYS)[number], v: string) => {
    const next = { ...choice, [k]: v } as ThemeChoice;
    setChoice(next);
    localStorage.setItem(CHOICE_KEY, JSON.stringify(next));
    apply(next);
  };

  const close = () => {
    localStorage.removeItem(LAB_KEY);
    apply(null);
    setOn(false);
  };

  const snippet = `export const ACTIVE_THEME: ThemeChoice = ${JSON.stringify(choice, null, 2).replace(/"(\w+)":/g, "$1:")};`;

  return (
    <aside
      aria-label="Theme lab"
      className="fixed bottom-20 left-3 z-[70] w-64 rounded-2xl bg-white p-4 font-sans text-sm text-stone-800 shadow-2xl ring-1 ring-black/10 md:bottom-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold">Theme lab</p>
        <button type="button" onClick={close} className="rounded px-2 py-0.5 text-stone-500 hover:bg-stone-100">
          Close
        </button>
      </div>
      <div className="space-y-2">
        {KEYS.map((k) => (
          <label key={k} className="block">
            <span className="mb-0.5 block text-xs font-medium text-stone-500">{LABELS[k]}</span>
            <select
              value={choice[k]}
              onChange={(e) => update(k, e.target.value)}
              className="w-full rounded-md border border-stone-300 bg-white px-2 py-1"
            >
              {Object.entries(THEME_OPTIONS[k]).map(([value, opt]) => (
                <option key={value} value={value}>
                  {optionLabel(opt)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(snippet).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="flex-1 rounded-md bg-stone-900 px-2 py-1.5 text-white hover:bg-stone-700"
        >
          {copied ? "Copied" : "Copy for theme.ts"}
        </button>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem(CHOICE_KEY);
            setChoice(ACTIVE_THEME);
            apply(ACTIVE_THEME);
          }}
          className="rounded-md border border-stone-300 px-2 py-1.5 hover:bg-stone-100"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
