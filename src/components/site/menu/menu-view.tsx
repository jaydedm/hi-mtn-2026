"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { MENU_INFO, MENU_TYPES, type MenuType } from "@/lib/menu-schedule";
import type { MenuSectionDto, SearchGroupDto } from "@/lib/menu-model";
import { MenuSectionView } from "./menu-section";
import { SectionChips } from "./section-chips";

/**
 * Dining Room / After Hours tabs over the online menu. Both menus are server-rendered
 * (hidden panel uses `hidden`), so all items are in the HTML for search engines.
 */
export function MenuView({
  menus,
  initial,
  windows,
  serving,
  groups = [],
}: {
  menus: Record<MenuType, MenuSectionDto[]>;
  initial: MenuType;
  windows: Record<MenuType, string | null>;
  serving: MenuType | null;
  groups?: SearchGroupDto[];
}) {
  const types = MENU_TYPES.filter((t) => menus[t].length > 0);
  const [active, setActive] = useState<MenuType>(types.includes(initial) ? initial : types[0] ?? "lunch");
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const bar = useRef<HTMLDivElement>(null);

  // Stick below the site header (and banner, if showing), and make section anchors clear both bars.
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-top]");
    const root = document.documentElement;
    const update = () => {
      const h = header?.offsetHeight ?? 0;
      root.style.setProperty("--site-header-h", `${h}px`);
      root.style.setProperty("--menu-anchor-offset", `${h + (bar.current?.offsetHeight ?? 0) + 8}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    if (header) ro.observe(header);
    if (bar.current) ro.observe(bar.current);
    return () => ro.disconnect();
  }, []);

  const select = (t: MenuType, focus = false) => {
    // Switching menus flips the page between day and night colors. A View Transition cross-fades
    // the whole page smoothly; without support (or with reduced motion) it switches instantly.
    const swap = () => flushSync(() => setActive(t));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (t !== active && !reduce && typeof document.startViewTransition === "function") document.startViewTransition(swap);
    else swap();
    if (focus) tabs.current[t]?.focus();
    const url = new URL(window.location.href);
    url.searchParams.set("menu", t);
    url.hash = "";
    window.history.replaceState(null, "", url);
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = types.length;
    const to = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to >= 0) {
      e.preventDefault();
      select(types[to], true);
    }
  };

  if (types.length === 0) return null;

  return (
    <div data-menu={active} className="ds-menu-theme">
      <div ref={bar} className="sticky top-[var(--site-header-h,0px)] z-30 -mx-5 bg-ds-paper/95 px-5 pt-3 pb-2 backdrop-blur border-b-2 border-dotted border-ds-ink/20">
        <div role="tablist" aria-label="Menus" className="mx-auto flex max-w-xl gap-1 rounded-full bg-ds-paper-2 p-1 shadow-md ring-1 ring-ds-ink/10">
          {types.map((t, i) => {
            const on = active === t;
            return (
              <button
                key={t}
                ref={(el) => {
                  tabs.current[t] = el;
                }}
                role="tab"
                id={`tab-${t}`}
                aria-selected={on}
                aria-controls={`panel-${t}`}
                tabIndex={on ? 0 : -1}
                onClick={() => select(t)}
                onKeyDown={(e) => onKey(e, i)}
                // Matches the home-page menu cards: Dining Room is a light card with a primary ring,
                // After Hours uses the theme's night colors.
                className={`flex-1 rounded-full px-4 py-2 text-center transition ${
                  on
                    ? t === "lunch"
                      ? "bg-ds-card text-ds-ink shadow-sm ring-2 ring-ds-primary"
                      : "bg-ds-night text-ds-glow ds-glow-box ring-2 ring-ds-night-ink"
                    : t === "lunch"
                      ? "text-ds-ink/70 hover:bg-ds-card/60 hover:text-ds-ink"
                      : "text-ds-night-ink/80 hover:bg-ds-night/10 hover:text-ds-night-ink"
                }`}
              >
                <span className="block font-label text-base md:text-lg leading-tight">{MENU_INFO[t].name}</span>
                <span className="block text-[11px] uppercase tracking-widest opacity-80">
                  {serving === t ? "Serving now" : windows[t] ?? ""}
                </span>
              </button>
            );
          })}
        </div>
        <SectionChips key={active} sections={menus[active]} prefix={active} label={`${MENU_INFO[active].name} sections`} />
      </div>

      {types.map((t) => (
        <div key={t} role="tabpanel" id={`panel-${t}`} aria-labelledby={`tab-${t}`} hidden={active !== t} tabIndex={0} className="outline-none">
          <p className="ds-menu-title ds-title pt-8 text-center font-title text-4xl">{MENU_INFO[t].title}</p>
          <p className="mt-1 text-center italic text-ds-ink/75">
            {MENU_INFO[t].blurb}
            {windows[t] && <span className="block font-label not-italic text-xs uppercase tracking-[0.3em] text-ds-secondary mt-2">{windows[t]}</span>}
          </p>
          <div className="divide-y-2 divide-dotted divide-ds-ink/15">
            {menus[t].map((s) => (
              <MenuSectionView key={s.id} section={s} idPrefix={t} groups={groups} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
