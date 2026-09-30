"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type StoryEntry = {
  /** Shown on the spine marker and the jump chips, e.g. "1918" or "Today". */
  year: string;
  title: string;
  text: string;
  /** Entries without a photo render as a compact "fact" card. */
  img?: string;
  alt?: string;
};

const noopSubscribe = () => () => {};

const slug = (year: string) => `story-${year.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/**
 * Scroll-driven history timeline: a center spine that fills in red as you scroll, entries that
 * alternate sides on desktop and slide in as they enter view, and year chips that jump to (and
 * highlight) the entry currently on screen. Motion is skipped for prefers-reduced-motion.
 */
export function StoryTimeline({ entries }: { entries: StoryEntry[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<Set<number>>(() => new Set());
  const [active, setActive] = useState(0);
  // Entries stay visible until hydration so the story still reads without JS.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  // Spine fill tracks the scroll position pixel-for-pixel: the red line ends at the "reading line"
  // (60% down the viewport). Written straight to the DOM each frame (no React re-render, no CSS
  // transition), and each marker lights up the moment the line reaches it.
  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;
    const markers = Array.from(list.querySelectorAll<HTMLElement>("[data-marker]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = list.getBoundingClientRect();
      const line = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      fill.style.transform = `translateX(-50%) scaleY(${p})`;
      for (const m of markers) {
        const mr = m.getBoundingClientRect();
        m.toggleAttribute("data-reached", mr.top + mr.height / 2 <= line);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Reveal entries once, and track which one sits nearest the middle of the screen.
  useEffect(() => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-idx]") ?? []);
    const io = new IntersectionObserver(
      (records) => {
        for (const rec of records) {
          const idx = Number((rec.target as HTMLElement).dataset.idx);
          if (rec.isIntersecting) {
            setShown((s) => (s.has(idx) ? s : new Set(s).add(idx)));
            setActive(idx);
          }
        }
      },
      { rootMargin: "-40% 0px -45% 0px" },
    );
    const reveal = new IntersectionObserver(
      (records) => {
        for (const rec of records) {
          if (!rec.isIntersecting) continue;
          const idx = Number((rec.target as HTMLElement).dataset.idx);
          setShown((s) => (s.has(idx) ? s : new Set(s).add(idx)));
          reveal.unobserve(rec.target);
        }
      },
      // Wait until a good chunk of the entry is actually on screen (above the bottom 20%).
      { rootMargin: "0px 0px -20% 0px", threshold: 0.3 },
    );
    items.forEach((el) => {
      io.observe(el);
      reveal.observe(el);
    });
    return () => {
      io.disconnect();
      reveal.disconnect();
    };
  }, []);

  return (
    <div className="mt-10">
      <nav aria-label="Jump to a year" className="flex flex-wrap justify-center gap-2">
        {entries.map((e, i) => (
          <a
            key={e.year}
            href={`#${slug(e.year)}`}
            aria-current={active === i ? "step" : undefined}
            className="rounded-full bg-ds-card px-4 py-1.5 font-label text-sm text-ds-ink shadow-sm ring-1 ring-ds-ink/10 transition hover:bg-ds-secondary/10 aria-[current=step]:bg-ds-secondary aria-[current=step]:text-ds-on-secondary"
          >
            {e.year}
          </a>
        ))}
      </nav>

      <ol ref={listRef} className="relative mt-12">
        {/* Spine + scroll-driven fill */}
        <span aria-hidden="true" className="absolute inset-y-0 left-5 w-1 -translate-x-1/2 rounded-full bg-ds-secondary/15 md:left-1/2" />
        <span
          aria-hidden="true"
          ref={fillRef}
          className="absolute inset-y-0 left-5 w-1 origin-top rounded-full bg-ds-primary will-change-transform md:left-1/2"
          style={{ transform: "translateX(-50%) scaleY(0)" }}
        />

        {entries.map((e, i) => {
          const left = i % 2 === 0;
          const isShown = !mounted || shown.has(i);
          return (
            <li
              key={e.year}
              id={slug(e.year)}
              data-idx={i}
              className="relative grid scroll-mt-[calc(var(--site-header-h,5rem)+1.5rem)] pb-14 pl-14 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0"
            >
              {/* Spine marker */}
              <span
                aria-hidden="true"
                data-marker
                className="group/marker absolute top-1 left-5 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-ds-card ring-4 ring-ds-paper-2 transition-[background-color,transform] duration-300 data-reached:scale-110 data-reached:bg-ds-primary motion-reduce:transition-none md:left-1/2"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-ds-secondary/40 transition-colors duration-300 group-data-reached/marker:bg-ds-on-primary" />
              </span>

              <article
                className={`transition duration-700 ease-out delay-100 motion-reduce:transition-none ${
                  isShown ? "translate-x-0 opacity-100" : `opacity-0 ${left ? "md:-translate-x-10" : "md:translate-x-10"} translate-y-6 md:translate-y-0`
                } ${left ? "md:col-start-1 md:text-right" : "md:col-start-2"}`}
              >
                <p className="font-label text-4xl leading-none text-ds-secondary">{e.year}</p>
                <h3 className="mt-2 font-label text-xl text-ds-ink">{e.title}</h3>
                {e.img ? (
                  <div className={`mt-4 flex ${left ? "md:justify-end" : ""}`}>
                    <Image
                      src={e.img}
                      alt={e.alt ?? ""}
                      width={480}
                      height={480}
                      sizes="(min-width: 768px) 240px, 192px"
                      className="ds-oval-frame h-48 w-48 object-cover md:h-60 md:w-60"
                    />
                  </div>
                ) : null}
                <p
                  className={`mt-4 text-ds-ink/80 ${
                    e.img ? "" : "inline-block rounded-2xl bg-ds-card px-5 py-4 text-left shadow-sm ring-1 ring-ds-ink/10"
                  }`}
                >
                  {e.text}
                </p>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
