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
        const buttonClass = `mt-6 inline-flex items-center justify-center gap-2 self-center rounded-full px-7 py-3 font-slab text-lg transition hover:-translate-y-0.5 ${
          dark ? "bg-[#5cd0ff] text-[#0b1628] shadow-[0_0_18px_rgba(92,208,255,.45)]" : "bg-ds-red text-ds-cream"
        }`;
        return (
          <li
            key={type}
            className={`relative flex flex-col rounded-3xl p-8 text-center shadow-xl ring-4 ${
              dark ? "bg-[#0b1628] text-ds-cream ring-[#1f4e8c]" : "bg-white/70 text-ds-ink ring-ds-red"
            } ${now ? "md:-translate-y-1" : ""}`}
          >
            {now && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ds-mustard px-4 py-1 font-slab text-xs uppercase tracking-widest text-ds-ink shadow">
                Now serving
              </span>
            )}
            {servedAt && (
              <p className={`font-slab text-xs uppercase tracking-[0.3em] ${dark ? "text-[#9fe3ff]" : "text-ds-blue"}`}>
                {servedAt}
              </p>
            )}
            <h3 className={`mt-2 font-script text-5xl leading-tight ${dark ? "ds-neon text-[#5cd0ff] drop-shadow-[0_0_12px_rgba(92,208,255,.75)]" : "text-ds-red"}`}>
              {info.title}
            </h3>
            <p className={`mt-3 flex-1 italic ${dark ? "text-[#dbeafe]/80" : "text-ds-ink/75"}`}>{info.blurb}</p>
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
