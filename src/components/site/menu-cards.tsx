"use client";

import type { HoursRow } from "@/lib/hours-logic";
import Link from "next/link";
import { MENU_INFO, MENU_TYPES, menuWindowSummary, type MenuType } from "@/lib/menu-schedule";
import { useOpenStatus } from "./use-open-status";

/**
 * The Lunch and After Hours menus as cards linking to their tab on /menu.
 * Times come from the admin hours table; the menu currently being served gets a "Now serving" tag.
 * Menus with no online items are hidden.
 */
export function MenuCards({ hours, online }: { hours: HoursRow[]; online: Partial<Record<MenuType, boolean>> }) {
  const status = useOpenStatus(hours);
  const types = MENU_TYPES.filter((t) => online[t]);

  return (
    <ul className={`grid gap-6 ${types.length > 1 ? "md:grid-cols-2" : "max-w-md mx-auto"}`}>
      {types.map((type) => {
        const info = MENU_INFO[type];
        const servedAt = menuWindowSummary(hours, type);
        const now = status?.serving === type;
        const dark = type === "after-hours";
        const buttonClass = `mt-6 inline-flex items-center justify-center gap-2 self-center rounded-full px-7 py-3 font-label text-lg transition hover:-translate-y-0.5 ${
          dark ? "bg-ds-glow text-ds-night ds-glow-box" : "bg-ds-primary text-ds-on-primary"
        }`;
        return (
          <li
            key={type}
            className={`relative flex flex-col rounded-3xl p-8 text-center shadow-xl ring-4 ${
              dark ? "bg-ds-night text-ds-glow-soft ring-ds-night-ink" : "bg-ds-card/70 text-ds-ink ring-ds-primary"
            } ${now ? "md:-translate-y-1" : ""}`}
          >
            {now && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap ds-hut bg-ds-highlight px-4 pb-1 font-label text-xs uppercase tracking-widest text-ds-on-highlight">
                Now serving
              </span>
            )}
            {servedAt && (
              <p className={`font-label text-xs uppercase tracking-[0.3em] ${dark ? "text-ds-glow-soft" : "text-ds-secondary"}`}>
                {servedAt}
              </p>
            )}
            <h3 className={`mt-2 ds-title font-title text-5xl leading-tight ${dark ? "ds-neon text-ds-glow ds-glow-text" : "text-ds-primary"}`}>
              {info.title}
            </h3>
            <p className={`mt-3 flex-1 italic ${dark ? "text-ds-glow-soft/80" : "text-ds-ink/75"}`}>{info.blurb}</p>
            <Link href={`/menu?menu=${type}`} className={buttonClass}>
              View menu
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
