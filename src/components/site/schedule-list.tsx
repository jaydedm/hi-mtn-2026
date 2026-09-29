import type { ScheduleGroup } from "@/lib/menu-schedule";

/**
 * One split pill per day, so each menu's label sits right on top of its time:
 *   [ DINING ROOM  11am – 4pm | AFTER HOURS  4pm – 8pm ]
 * Pass only `lunch` for Dining-Room-only days, only `afterHours` for After-Hours-only days.
 */
export function MenuSegments({ lunch, afterHours, day }: { lunch: string | null; afterHours: string | null; day: string }) {
  if (!lunch && !afterHours) return null;
  return (
    <ul aria-label={`Menu times, ${day}`} className="mt-2 flex overflow-hidden rounded-2xl ring-1 ring-ds-ink/15 text-center">
      {lunch && (
        <li className="flex-1 bg-ds-blue/10 px-3 py-1.5 text-ds-blue">
          <span className="block font-slab text-[10px] uppercase tracking-wider">Dining Room</span>
          <span className="block text-sm font-semibold">{lunch}</span>
        </li>
      )}
      {afterHours && (
        <li className="flex-1 bg-ds-ink px-3 py-1.5 text-ds-cream">
          <span className="block font-slab text-[10px] uppercase tracking-wider opacity-80">After Hours</span>
          <span className="block text-sm font-semibold">{afterHours}</span>
        </li>
      )}
    </ul>
  );
}

/** Grouped weekly schedule: "Mon–Thu  11am–8pm" with a split pill of menu times underneath. */
export function ScheduleList({ groups }: { groups: ScheduleGroup[] }) {
  return (
    <dl className="divide-y divide-ds-ink/10">
      {groups.map((g) => {
        const open = g.hours !== "Closed";
        return (
          <div key={g.days} className="py-3 first:pt-0 last:pb-0">
            <div className="flex justify-between gap-4 font-slab">
              <dt>{g.days}</dt>
              <dd className={open ? "" : "text-ds-ink/50"}>{g.hours}</dd>
            </div>
            {open && (
              <dd>
                <MenuSegments lunch={g.dining} afterHours={g.afterHours} day={g.days} />
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}
