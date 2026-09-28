"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DIRECTIONS } from "./directions";

/**
 * Floating switcher so reviewers can hop between the three prototype
 * directions without leaving the page. Collapses to a pill on mobile.
 */
export function DirectionSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = DIRECTIONS.find((d) => pathname?.includes(d.slug));

  return (
    <div className="fixed bottom-20 right-3 z-[100] md:bottom-4 md:right-4 font-sans text-sm">
      {open && (
        <div className="mb-2 w-64 rounded-xl bg-zinc-900 text-zinc-100 shadow-2xl ring-1 ring-white/10 overflow-hidden">
          <div className="px-3 py-2 text-[11px] uppercase tracking-widest text-zinc-400">
            Prototype directions
          </div>
          {DIRECTIONS.map((d) => (
            <Link
              key={d.slug}
              href={`/preview/${d.slug}`}
              onClick={() => setOpen(false)}
              className={`flex items-start gap-3 px-3 py-2.5 hover:bg-zinc-800 ${
                current?.slug === d.slug ? "bg-zinc-800" : ""
              }`}
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-400 text-xs font-black text-zinc-900">
                {d.letter}
              </span>
              <span>
                <span className="block font-semibold leading-tight">{d.name}</span>
                <span className="block text-xs text-zinc-400">{d.blurb}</span>
              </span>
            </Link>
          ))}
          <Link href="/" className="block border-t border-white/10 px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800">
            ← Current live site
          </Link>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-zinc-100 shadow-xl ring-1 ring-white/10"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-xs font-black text-zinc-900">
          {current?.letter ?? "?"}
        </span>
        <span className="hidden sm:inline font-medium">{current?.name ?? "Prototypes"}</span>
        <span className="text-zinc-400">{open ? "▾" : "▴"}</span>
      </button>
    </div>
  );
}
