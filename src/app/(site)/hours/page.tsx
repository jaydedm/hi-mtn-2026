import type { Metadata } from "next";
import Link from "next/link";
import { OpenBadge } from "@/components/site/open-badge";
import { getHours } from "@/lib/hours";
import { MENU_INFO, MENU_TYPES } from "@/lib/menu-schedule";
import { ADDRESS, DIRECTIONS_URL } from "@/lib/site";
import { WeekHours } from "./week-hours";

export const metadata: Metadata = {
  title: "Hours",
  description: "Hi-Mountain hours in Kamas, Utah: when we serve the full Lunch menu and Hi-Mountain After Hours shakes, ice cream and dinner.",
  alternates: { canonical: "/hours" },
};

export default async function HoursPage() {
  const hours = await getHours();

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <h1 className="ds-title font-title text-6xl md:text-7xl text-ds-primary text-center">Our Hours</h1>
      <p className="text-center font-label text-xs tracking-[0.3em] uppercase text-ds-secondary mt-3">
        All times Mountain Time
      </p>

      <div className="mt-8 flex justify-center">
        <div className="rounded-xl bg-ds-card px-6 py-3 shadow-md ring-1 ring-ds-ink/10">
          <OpenBadge
            hours={hours}
            className="font-label text-lg text-ds-ink"
            dotClass="ds-neon shadow-[0_0_8px_currentColor]"
            openText="Open now"
            closedText="Closed now"
            showServing
            servingClass="mt-1 text-ds-secondary"
          />
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-ds-card/70 p-6 md:p-8 shadow-xl ring-4 ring-ds-primary">
        <WeekHours hours={hours} />
      </div>

      <div className="mt-12 text-center">
        <h2 className="font-label text-2xl">See the menus</h2>
        <ul className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          {MENU_TYPES.map((t) => (
            <li key={t}>
              <Link
                href={`/menu?menu=${t}`}
                className={`inline-flex items-center gap-2 rounded-full px-7 py-3 font-label text-lg shadow-lg transition hover:-translate-y-0.5 ${
                  t === "lunch" ? "bg-ds-primary text-ds-paper" : "bg-ds-secondary text-ds-paper"
                }`}
              >
                {MENU_INFO[t].title}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-label text-sm">
          <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-ds-highlight">
            {ADDRESS}
          </a>
        </p>
      </div>
    </section>
  );
}
