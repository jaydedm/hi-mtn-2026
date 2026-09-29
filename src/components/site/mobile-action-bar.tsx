"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DIRECTIONS_URL, PHONE_HREF } from "@/lib/site";

const item = "flex flex-col items-center gap-1 py-2.5 font-slab text-xs text-ds-ink";

/** Sticky bottom bar on phones: directions, call, menu (or home, when already on the menu). */
export function MobileActionBar() {
  const onMenu = usePathname() === "/menu";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 md:hidden bg-ds-cream border-t-2 border-ds-red"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className={item}>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 21s-7-6.5-7-11a7 7 0 1 1 14 0c0 4.5-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        Directions
      </a>
      <a href={PHONE_HREF} className={item}>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
        Call
      </a>
      <Link href={onMenu ? "/" : "/menu"} className={`${item} bg-ds-red text-ds-cream`}>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d={onMenu ? "M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10" : "M4 6h16M4 12h16M4 18h10"} />
        </svg>
        {onMenu ? "Home" : "Menu"}
      </Link>
    </nav>
  );
}
