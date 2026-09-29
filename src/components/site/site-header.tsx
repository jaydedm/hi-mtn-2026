"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HoursRow } from "@/lib/hours-logic";
import { PHONE, PHONE_HREF } from "@/lib/site";
import { Awning } from "./decor";
import { OpenBadge } from "./open-badge";

const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/hours", label: "Hours" },
  { href: "/#story", label: "Since 1918" },
];

export function SiteHeader({ hours }: { hours: HoursRow[] }) {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  // Publish the sticky top block's height (banner + header) as --site-header-h, so anchored
  // sections and the menu's sticky bar sit just below it, whether or not a banner is showing.
  useEffect(() => {
    const top = ref.current?.closest<HTMLElement>("[data-site-top]");
    if (!top) return;
    const set = () => document.documentElement.style.setProperty("--site-header-h", `${top.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(top);
    return () => ro.disconnect();
  }, []);

  return (
    <header ref={ref} className="relative bg-ds-cream/95 backdrop-blur border-b-2 border-ds-red">
      <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0" aria-label="Hi-Mountain home">
          <span className="font-script text-3xl leading-none text-ds-red whitespace-nowrap">Hi-Mountain</span>
        </Link>
        <div className="hidden lg:block">
          <OpenBadge hours={hours} className="font-slab text-sm" />
        </div>
        <nav aria-label="Primary" className="flex items-center gap-5 font-slab text-sm">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className="hidden md:inline hover:text-ds-red aria-[current=page]:text-ds-red aria-[current=page]:underline underline-offset-8 decoration-2"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={PHONE_HREF}
            className="rounded-full bg-ds-blue text-ds-cream px-4 py-2 hover:bg-ds-red transition-colors whitespace-nowrap"
          >
            <span className="md:hidden">Call</span>
            <span className="hidden md:inline">{PHONE}</span>
          </a>
        </nav>
      </div>
      <Awning />
    </header>
  );
}
