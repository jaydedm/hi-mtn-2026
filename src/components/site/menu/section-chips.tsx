"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MenuSectionDto } from "@/lib/menu-model";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Height of the sticky header + menu bar (set by MenuView), so sections count as "current" once under it. */
function anchorOffset() {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--menu-anchor-offset"));
  return Number.isFinite(v) ? v : 128;
}

/**
 * Horizontally scrolling section chips without a visible scrollbar.
 * - Scrollspy: the chip for the section you're reading stays highlighted, and the strip glides
 *   to keep it in view as you scroll the menu.
 * - Tapping a chip smooth-scrolls the page to that section (instant with reduced motion).
 * - When more chips are off-screen, that edge fades and a round arrow button appears.
 */
export function SectionChips({ sections, prefix, label }: { sections: MenuSectionDto[]; prefix: string; label: string }) {
  const strip = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });
  const [active, setActive] = useState<string | null>(sections[0]?.slug ?? null);
  // While a chip-triggered scroll is in flight, hold the highlight on the target chip.
  const locked = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const measure = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    const start = el.scrollLeft > 4;
    const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setEdges((e) => (e.start === start && e.end === end ? e : { start, end }));
  }, []);

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure, sections]);

  // Scrollspy: the current section is the last one whose top has passed under the sticky bar.
  useEffect(() => {
    const els = sections
      .map((s) => ({ slug: s.slug, el: document.getElementById(`${prefix}-${s.slug}`) }))
      .filter((x): x is { slug: string; el: HTMLElement } => !!x.el);
    let frame = 0;
    const update = () => {
      frame = 0;
      if (locked.current) return;
      const line = anchorOffset() + 1;
      let current = els[0]?.slug ?? null;
      for (const { slug, el } of els) if (el.getBoundingClientRect().top <= line) current = slug;
      // At the very bottom, the last section wins even if it's too short to reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = els.at(-1)?.slug ?? current;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // A chip-triggered smooth scroll releases the highlight lock as soon as it lands.
    const onScrollEnd = () => {
      clearTimeout(lockTimer.current);
      locked.current = false;
      onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections, prefix]);

  // Glide the strip (never the page) so the active chip sits centered.
  useEffect(() => {
    const el = strip.current;
    const chip = active ? el?.querySelector<HTMLElement>(`[data-slug="${active}"]`) : null;
    if (!el || !chip) return;
    const left = chip.offsetLeft - (el.clientWidth - chip.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: reducedMotion() ? "auto" : "smooth" });
  }, [active]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    const target = document.getElementById(`${prefix}-${slug}`);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - anchorOffset() + 48; // skip the section's top padding
    const smooth = !reducedMotion();
    setActive(slug);
    if (smooth) {
      locked.current = true;
      clearTimeout(lockTimer.current);
      // Fallback release where `scrollend` is unsupported.
      lockTimer.current = setTimeout(() => (locked.current = false), 1500);
    }
    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
    history.replaceState(null, "", `#${prefix}-${slug}`);
    // Move focus for keyboard/screen-reader users without a second jump.
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  const nudge = (dir: 1 | -1) => {
    const el = strip.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  const mask = `linear-gradient(to right, ${edges.start ? "transparent, #000 3rem" : "#000"}, ${
    edges.end ? "#000 calc(100% - 3rem), transparent" : "#000"
  })`;

  return (
    <nav aria-label={label} className="relative mt-2">
      <div
        ref={strip}
        className="ds-no-scrollbar overflow-x-auto px-1 py-1"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        <ul className="mx-auto flex w-max gap-2">
          {sections.map((s) => {
            const on = active === s.slug;
            return (
              <li key={s.id}>
                <a
                  href={`#${prefix}-${s.slug}`}
                  data-slug={s.slug}
                  onClick={(e) => go(e, s.slug)}
                  aria-current={on ? "location" : undefined}
                  className={`block whitespace-nowrap rounded-full border px-3 py-1 font-slab text-xs uppercase tracking-wider transition-colors duration-300 ${
                    on
                      ? "border-ds-red bg-ds-red text-white shadow-sm"
                      : "border-ds-ink/20 bg-white/60 hover:border-ds-red hover:text-ds-red"
                  }`}
                >
                  {s.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      {(["start", "end"] as const).map((side) =>
        edges[side] ? (
          <button
            key={side}
            type="button"
            onClick={() => nudge(side === "start" ? -1 : 1)}
            aria-label={side === "start" ? "Show previous sections" : "Show more sections"}
            className={`absolute top-1/2 -translate-y-1/2 ${
              side === "start" ? "left-0" : "right-0"
            } flex h-7 w-7 items-center justify-center rounded-full bg-white text-ds-ink shadow-md ring-1 ring-ds-ink/15 transition hover:text-ds-red`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <path d={side === "start" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        ) : null,
      )}
    </nav>
  );
}
