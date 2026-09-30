import { describe, expect, it } from "vitest";
import { ACTIVE_THEME, NIGHTS, PALETTES, THEME_OPTIONS, isThemeValue, themeCss } from "@/lib/theme";

const PALETTE_KEYS = ["paper", "paper2", "card", "ink", "primary", "onPrimary", "secondary", "onSecondary", "highlight", "onHighlight", "alert", "onAlert"];
const NIGHT_KEYS = ["night", "nightInk", "glow", "glowSoft"];

describe("theme", () => {
  it("every palette and night set defines every token as a hex color", () => {
    for (const p of Object.values(PALETTES)) {
      for (const k of PALETTE_KEYS) expect((p as Record<string, string>)[k], `${p.label}.${k}`).toMatch(/^#[0-9a-f]{6}$/i);
    }
    for (const n of Object.values(NIGHTS)) {
      for (const k of NIGHT_KEYS) expect((n as Record<string, string>)[k], `${n.label}.${k}`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("the active theme names real options", () => {
    for (const k of Object.keys(ACTIVE_THEME) as (keyof typeof ACTIVE_THEME)[]) {
      expect(Object.hasOwn(THEME_OPTIONS[k], ACTIVE_THEME[k]), k).toBe(true);
    }
  });

  it("emits the active palette at :root and each option under a data attribute", () => {
    const css = themeCss({ palette: "trailhead", night: "lantern", edge: "ridge", type: "modern" });
    const root = css.split("\n")[0];
    expect(root).toContain(`--ds-primary:${PALETTES.trailhead.primary};`);
    expect(root).toContain("--ds-paper-2:");
    expect(root).toContain("--ds-on-primary:");
    expect(root).toContain(`--ds-night-ink:${NIGHTS.lantern.nightInk};`);
    expect(root).not.toContain("label");
    expect(css).toContain(`:root[data-palette="drugstore"]{--ds-paper:${PALETTES.drugstore.paper};`);
    expect(css).toContain(`:root[data-night="neon"]{--ds-night:${NIGHTS.neon.night};`);
  });

  it("validates lab values", () => {
    expect(isThemeValue("palette", "pine")).toBe(true);
    expect(isThemeValue("palette", "nope")).toBe(false);
    expect(isThemeValue("edge", "toString")).toBe(false);
  });
});
