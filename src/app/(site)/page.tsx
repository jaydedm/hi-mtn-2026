import Image from "next/image";
import Link from "next/link";
import { Awning, BurgerMark } from "@/components/site/decor";
import { MenuCards } from "@/components/site/menu-cards";
import { OpenBadge } from "@/components/site/open-badge";
import { ScheduleList } from "@/components/site/schedule-list";
import { StoryTimeline, type StoryEntry } from "@/components/site/story-timeline";
import { groupSchedule } from "@/lib/menu-schedule";
import { getHours } from "@/lib/hours";
import { getOnlineMenus } from "@/lib/menu-data";
import {
  ADDRESS,
  BEST_OF_STATE_COUNT,
  DIRECTIONS_URL,
  PHONE,
  PHONE_HREF,
} from "@/lib/site";

const STORY: StoryEntry[] = [
  {
    year: "1918",
    title: "Doors open on Main Street",
    img: "/images/hero-4.png",
    alt: "Pete's Drugs storefront with classic cars parked out front",
    text: "Opens on Main Street as a confectionary and pharmacy. Locals start calling it the Drug Store, and never stop.",
  },
  {
    year: "1950s",
    title: "The fountain era",
    img: "/images/hero-2.png",
    alt: "Three fountain staff behind the soda counter, Coca-Cola clock on the wall",
    text: "The soda fountain becomes the heart of town. The original tile mural below the counter is still there. Go look.",
  },
  {
    year: "2009",
    title: "First Best of State",
    text: "Hi-Mountain takes home its first Best of State medal for the best burger in Utah.",
  },
  {
    year: "Today",
    title: "Still the Drug Store",
    img: "/images/hero-6.png",
    alt: "The Hi-Mountain Drug sign",
    text: `Same counter, same hand-pattied burgers, and ${BEST_OF_STATE_COUNT} Best of State awards for the best burger in Utah.`,
  },
];

export default async function HomePage() {
  const [hours, online] = await Promise.all([getHours(), getOnlineMenus()]);
  const grouped = groupSchedule(hours);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pt-14 pb-16 md:pt-24 md:pb-28 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div className="ds-reveal text-center md:text-left">
            <p className="font-slab tracking-[0.25em] text-xs uppercase text-ds-blue">
              Kamas, Utah · Est. 1918
            </p>
            <h1 className="mt-4 font-script text-[clamp(3.5rem,17vw,7.5rem)] leading-[0.85] text-ds-red">
              Hi-Mountain
            </h1>
            <p className="mt-2 font-slab text-xl sm:text-2xl md:text-4xl uppercase tracking-wide">
              Burgers · Shakes · Fries
            </p>
            <p className="mt-6 max-w-md text-lg italic text-ds-ink/80 mx-auto md:mx-0">
              An old-fashioned soda fountain and grill that&rsquo;s been
              Kamas&rsquo;s &ldquo;Drug Store&rdquo; for over a century, and
              home of the {BEST_OF_STATE_COUNT}-time Best of State burger. Belly
              up to the counter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/menu"
                className="font-slab rounded-full bg-ds-red text-ds-cream px-7 py-3 text-lg shadow-lg hover:-translate-y-0.5 transition"
              >
                See the menus
              </Link>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-slab rounded-full border-2 border-ds-ink px-7 py-3 text-lg hover:bg-ds-ink hover:text-ds-cream transition"
              >
                Directions
              </a>
            </div>
            <div className="mt-6 lg:hidden">
              <OpenBadge hours={hours} className="font-slab text-base" />
            </div>
          </div>

          {/* Oval archive-photo cluster */}
          <div className="relative mx-auto w-full max-w-[340px] md:max-w-none h-[360px] md:h-[520px] ds-reveal-2">
            <Image
              src="/images/hero-3.png"
              alt="Two waitresses in blue uniforms under the striped awning and Rexall sign"
              width={640}
              height={640}
              sizes="(min-width: 768px) 320px, 208px"
              preload
              className="ds-oval-frame absolute left-1/2 top-0 -translate-x-1/2 h-52 w-52 md:h-80 md:w-80 object-cover object-top"
            />
            <Image
              src="/images/hero-2.png"
              alt="Three fountain staff behind the soda counter, Coca-Cola clock on the wall"
              width={448}
              height={448}
              sizes="(min-width: 768px) 224px, 144px"
              className="ds-oval-frame absolute left-2 bottom-8 h-36 w-36 md:h-56 md:w-56 object-cover"
            />
            <Image
              src="/images/hero-4.png"
              alt="Pete's Drugs storefront with classic cars parked out front"
              width={416}
              height={416}
              sizes="(min-width: 768px) 208px, 128px"
              className="ds-oval-frame absolute right-2 bottom-0 h-32 w-32 md:h-52 md:w-52 object-cover"
            />
            <div className="absolute right-0 top-2 rotate-6 md:right-4 md:top-6">
              <Image
                src="/images/best-of-state.png"
                alt={`Best of State medal, awarded to Hi-Mountain ${BEST_OF_STATE_COUNT} times`}
                width={360}
                height={360}
                sizes="(min-width: 768px) 112px, 88px"
                className="h-22 w-22 rounded-full shadow-xl ring-4 ring-ds-cream md:h-28 md:w-28"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ds-red px-2.5 py-0.5 font-slab text-xs text-white shadow-md ring-2 ring-ds-cream md:text-sm">
                {BEST_OF_STATE_COUNT}× winner
              </span>
            </div>
          </div>
        </div>
        <Awning blue />
      </section>

      {/* Open status + this week's hours */}
      <section aria-labelledby="today-heading" className="bg-ds-cream-2/60">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <div className="grid gap-8 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-ds-ink/10 sm:p-8 md:grid-cols-[1fr_1.4fr] md:gap-10">
            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h2 id="today-heading" className="font-slab text-2xl text-ds-ink">
                Hours
              </h2>
              <div className="rounded-full bg-ds-cream px-5 py-2 ring-1 ring-ds-ink/10">
                <OpenBadge
                  hours={hours}
                  className="font-slab text-base text-ds-ink"
                  dotClass="ds-neon shadow-[0_0_8px_currentColor]"
                  openText="Open now"
                  closedText="Closed now"
                  showServing
                  servingClass="mt-1 text-ds-blue"
                />
              </div>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ds-ink/80 underline underline-offset-4 decoration-ds-ink/30 hover:text-ds-blue"
              >
                {ADDRESS}
              </a>
              <Link
                href="/hours"
                className="font-slab text-sm text-ds-blue underline underline-offset-4"
              >
                Full hours &amp; menu times
              </Link>
            </div>
            <ScheduleList groups={grouped} />
          </div>
        </div>
      </section>

      {/* Menus */}
      <section
        aria-labelledby="menus-heading"
        className="mx-auto max-w-5xl px-5 py-20"
      >
        <div className="text-center mb-12">
          <BurgerMark className="h-12 mx-auto" />
          <h2
            id="menus-heading"
            className="font-script text-6xl text-ds-red mt-2"
          >
            Two Menus, One Counter
          </h2>
          <p className="italic text-ds-ink/75 mt-3 max-w-2xl mx-auto">
            Dine in all day. The full grill runs through lunch, then it&rsquo;s
            Hi-Mountain After Hours: every shake and scoop, plus comfy
            favorites, salads, and box combos.
          </p>
        </div>
        <MenuCards hours={hours} online={online} />
      </section>

      <Awning />

      {/* Story timeline */}
      <section
        id="story"
        aria-labelledby="story-heading"
        className="bg-ds-cream-2 scroll-mt-[calc(var(--site-header-h,6rem)+1rem)]"
      >
        <div className="mx-auto max-w-4xl px-5 py-20">
          <h2
            id="story-heading"
            className="font-script text-6xl text-ds-red text-center"
          >
            A Walk Down Memory Lane
          </h2>
          <p className="text-center italic text-ds-ink/75 mt-3 max-w-2xl mx-auto">
            Built in 1918 as a confectionary, the store has had very few changes
            since it first opened its doors. The pharmacy is closed, but to
            Kamas we&rsquo;re still &ldquo;The Drug Store.&rdquo;
          </p>

          <StoryTimeline entries={STORY} />
        </div>
      </section>

      {/* Visit */}
      <section
        id="visit"
        aria-labelledby="visit-heading"
        className="bg-ds-blue text-ds-cream scroll-mt-[calc(var(--site-header-h,6rem)+1rem)]"
      >
        <div className="mx-auto max-w-5xl px-5 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 id="visit-heading" className="font-script text-6xl">
              Come see us
            </h2>
            <p className="mt-4 text-lg italic text-ds-cream/85">
              Whether you&rsquo;ve traveled one mile or a thousand, we hope
              you&rsquo;ll agree we&rsquo;re well worth the trip.
            </p>
            <address className="not-italic mt-6 font-slab text-lg space-y-1">
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block underline underline-offset-4 decoration-ds-mustard"
              >
                {ADDRESS}
              </a>
              <a
                href={PHONE_HREF}
                className="block underline underline-offset-4 decoration-ds-mustard"
              >
                {PHONE}
              </a>
            </address>
          </div>
          <div className="rounded-3xl bg-ds-cream text-ds-ink p-8 shadow-2xl">
            <h3 className="font-slab text-xl mb-4 text-center">
              Hours{" "}
              <span className="text-xs font-body italic opacity-70">
                (Mountain Time)
              </span>
            </h3>
            <ScheduleList groups={grouped} />
            <Link
              href="/hours"
              className="mt-4 block text-center font-slab text-sm text-ds-blue underline underline-offset-4"
            >
              Full hours &amp; menu times
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
