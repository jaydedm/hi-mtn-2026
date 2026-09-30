"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HoursRow } from "@/lib/hours-logic";
import { PHONE, PHONE_HREF } from "@/lib/site";
import { Edge } from "./decor";
import { OpenBadge } from "./open-badge";

const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/hours", label: "Hours" },
  { href: "/#story", label: "Since 1918" },
];

// On the menu page, the "Menu" link becomes a way back home.
const HOME = { href: "/", label: "Home" };

export function SiteHeader({ hours }: { hours: HoursRow[] }) {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  // Publish the sticky top block's height (banner + header) as --site-header-h, so anchored
  // sections and the menu's sticky bar sit just below it, whether or not a banner is showing.
  useEffect(() => {
    const top = ref.current?.closest<HTMLElement>("[data-site-top]");
    if (!top) return;
    const set = () =>
      document.documentElement.style.setProperty(
        "--site-header-h",
        `${top.offsetHeight}px`,
      );
    set();
    const ro = new ResizeObserver(set);
    ro.observe(top);
    return () => ro.disconnect();
  }, []);

  return (
    <header
      ref={ref}
      className="relative bg-ds-paper/95 backdrop-blur border-b-2 border-ds-primary"
    >
      <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="shrink-0"
          aria-label="Hi-Mountain home"
        >
          <span className="ds-logo-sm font-logo text-3xl leading-none text-ds-primary whitespace-nowrap">
            Hi-Mountain
          </span>
        </Link>
        <div className="hidden lg:block">
          <OpenBadge hours={hours} className="font-label text-sm" />
        </div>
        <nav
          aria-label="Primary"
          className="flex items-center gap-5 font-label text-sm"
        >
          <div className="hidden md:flex items-center gap-5">
            {NAV.map((n) =>
              pathname === "/menu" && n.href === "/menu" ? HOME : n,
            ).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className="hover:text-ds-primary aria-[current=page]:text-ds-primary aria-[current=page]:underline underline-offset-8 decoration-2"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <a
            href={PHONE_HREF}
            className="rounded-full bg-ds-secondary text-ds-paper px-4 py-2 hover:bg-ds-primary transition-colors whitespace-nowrap"
          >
            <span className="md:hidden">Call</span>
            <span className="hidden md:inline">{PHONE}</span>
          </a>
        </nav>
      </div>
      <Edge />
    </header>
  );
}
