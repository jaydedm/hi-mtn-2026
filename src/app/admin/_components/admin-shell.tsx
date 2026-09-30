"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { CalendarClock, ExternalLink, LayoutDashboard, Megaphone, UtensilsCrossed } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/hours", label: "Hours", icon: CalendarClock },
  { href: "/admin/banner", label: "Banner", icon: Megaphone },
];

/** Admin chrome: left sidebar on desktop, top bar with tab row on phones. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const links = (
    <>
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const on = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            aria-current={on ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              on ? "bg-white text-foreground shadow-sm ring-1 ring-border" : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="admin-theme min-h-screen md:grid md:grid-cols-[15rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:gap-6 md:border-r md:border-border md:px-4 md:py-6 md:sticky md:top-0 md:h-screen">
        <Link href="/admin" className="flex items-center gap-2 px-2">
          <span className="grid size-8 place-items-center rounded-lg bg-ds-primary font-brand text-sm font-extrabold text-white">
            HM
          </span>
          <span className="leading-tight">
            <span className="block font-brand text-sm font-bold">Hi-Mountain</span>
            <span className="block text-xs text-muted-foreground">Admin</span>
          </span>
        </Link>
        <nav aria-label="Admin" className="flex flex-col gap-1">
          {links}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/60 hover:text-foreground"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            View website
          </Link>
          <div className="px-2">
            <UserButton />
          </div>
        </div>
      </aside>

      {/* Phone header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="font-brand font-bold">
            Hi-Mountain <span className="font-sans font-normal text-muted-foreground">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-muted-foreground" aria-label="View website">
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
            <UserButton />
          </div>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-2">
          {links}
        </nav>
      </header>

      <main className="min-w-0 px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
