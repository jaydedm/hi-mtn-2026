import Link from "next/link";
import { toZonedTime } from "date-fns-tz";
import { ArrowRight, CalendarClock, Megaphone, UtensilsCrossed } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getHours } from "@/lib/hours";
import { loadMenu } from "@/lib/menu-data";
import { openStatus } from "@/lib/open-status";
import { groupSchedule } from "@/lib/menu-schedule";
import { MOUNTAIN_TZ } from "@/lib/site";
import { PageHeader } from "./_components/ui";

function Card({ href, icon: Icon, title, children, cta }: { href: string; icon: typeof CalendarClock; title: string; children: React.ReactNode; cta: string }) {
  return (
    <Link href={href} className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-input hover:shadow-md">
      <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" /> {title}
      </span>
      <div className="mt-3 flex-1">{children}</div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ds-secondary">
        {cta} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

export default async function AdminPage() {
  const [hours, sections, banner] = await Promise.all([
    getHours(),
    loadMenu(),
    prisma.globalBanner.findFirst({ orderBy: { createdAt: "desc" } }),
  ]);
  const now = openStatus(hours, toZonedTime(new Date(), MOUNTAIN_TZ));
  const items = sections.flatMap((s) => s.items);
  const unavailable = items.filter((i) => !i.isAvailable);
  const bannerLive =
    banner?.isActive && (!banner.startDate || banner.startDate <= new Date()) && (!banner.endDate || banner.endDate > new Date());

  return (
    <>
      <PageHeader title="Welcome back" description="Here’s what visitors see on the website right now." />

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
        <span className={`size-2.5 rounded-full ${now.open ? "bg-emerald-500" : "bg-rose-500"}`} aria-hidden="true" />
        <span className="font-semibold">{now.open ? "Open now" : "Closed now"}</span>
        <span className="text-muted-foreground">· {now.detail}</span>
        {now.servingDetail && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${now.serving === "after-hours" ? "bg-ds-ink text-ds-paper" : "bg-ds-secondary/10 text-ds-secondary"}`}>
            Serving {now.servingDetail}
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card href="/admin/menu" icon={UtensilsCrossed} title="Menu" cta="Edit menu">
          <p className="text-2xl font-bold">{items.length} items</p>
          <p className="text-sm text-muted-foreground">in {sections.length} sections</p>
          {unavailable.length > 0 ? (
            <p className="mt-2 text-sm font-medium text-amber-700">
              {unavailable.length} unavailable: {unavailable.slice(0, 3).map((i) => i.name).join(", ")}
              {unavailable.length > 3 ? "…" : ""}
            </p>
          ) : (
            <p className="mt-2 text-sm text-emerald-700">Everything is available.</p>
          )}
        </Card>

        <Card href="/admin/hours" icon={CalendarClock} title="Hours" cta="Edit hours">
          <ul className="space-y-1 text-sm">
            {groupSchedule(hours).map((g) => (
              <li key={g.days} className="flex justify-between gap-3">
                <span className="font-medium">{g.days}</span>
                <span className={g.hours === "Closed" ? "text-muted-foreground" : ""}>{g.hours}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card href="/admin/banner" icon={Megaphone} title="Banner" cta={bannerLive ? "Edit banner" : "Post a banner"}>
          {bannerLive ? (
            <>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" /> Showing now
              </p>
              <p className="mt-1 line-clamp-3 text-sm">“{banner!.bannerText}”</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No banner is showing. Post one for closures, holiday hours or specials.</p>
          )}
        </Card>
      </div>
    </>
  );
}
