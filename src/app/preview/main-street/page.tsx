import { getPreviewHours, groupHours } from "../_shared/hours";
import { ADDRESS, DIRECTIONS_URL, PHONE, PHONE_HREF } from "../_shared/menu-data";
import { OpenBadge } from "../_shared/open-badge";
import { MobileActionBar } from "../_shared/mobile-action-bar";
import { TabbedMenu, type MenuStyles } from "../_shared/tabbed-menu";
import { BunMark } from "../_shared/bun-logo";

export const dynamic = "force-dynamic";

const menuStyles: MenuStyles = {
  tabs: "flex gap-2 overflow-x-auto pb-3 mb-8 -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap [scrollbar-width:none]",
  tab: "font-wood whitespace-nowrap text-sm md:text-base px-4 py-2 border-2 transition-colors",
  tabActive: "bg-[var(--b-rust)] border-[var(--b-rust)] text-[var(--b-cream)]",
  tabIdle: "border-[var(--b-cream)]/30 text-[var(--b-cream)] hover:border-[var(--b-cream)]",
  blurb: "font-body text-[var(--b-cream)]/75 max-w-2xl mb-8",
  item: "py-3 border-b border-[var(--b-cream)]/15",
  name: "font-wood text-lg text-[var(--b-cream)]",
  leader: "border-b border-dotted border-[var(--b-cream)]/30 mb-1 mx-1",
  price: "font-wood text-lg text-[var(--b-sky)]",
  desc: "font-body text-sm text-[var(--b-cream)]/65 mt-0.5",
  footer: "font-body text-sm text-[var(--b-cream)]/65 mt-8",
};

function TrailSign({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`pv-trail-sign pv-woodgrain text-[var(--b-cream)] pl-5 pr-10 py-3 font-wood text-sm md:text-base shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export default async function MainStreetPage() {
  const hours = await getPreviewHours();
  const grouped = groupHours(hours);

  return (
    <div className="bg-[var(--b-pine-2)] text-[var(--b-cream)] font-body pb-20 md:pb-0">
      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto max-w-7xl px-5 py-5 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <BunMark className="h-8 w-12 text-[var(--b-cream)]" />
            <span className="font-wood text-2xl tracking-wide">Hi-Mountain</span>
          </a>
          <nav aria-label="Primary" className="hidden md:flex items-center gap-8 font-wood text-sm tracking-wider uppercase">
            <a href="#menu" className="hover:text-[var(--b-sky)]">Menu</a>
            <a href="#stop" className="hover:text-[var(--b-sky)]">Last Stop</a>
            <a href="#story" className="hover:text-[var(--b-sky)]">Since 1918</a>
            <a href={PHONE_HREF} className="border-2 border-[var(--b-cream)] px-4 py-2 hover:bg-[var(--b-cream)] hover:text-[var(--b-pine)] transition-colors">
              {PHONE}
            </a>
          </nav>
          <a href={PHONE_HREF} className="md:hidden font-wood text-sm border-2 border-[var(--b-cream)] px-3 py-1.5">
            Call
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative min-h-[100svh] md:min-h-[92svh] flex items-end overflow-hidden">
        <img
          src="/images/hero-6.png"
          alt="The Hi-Mountain Drug sign over the Main Street storefront in Kamas"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--b-pine-2)] via-[var(--b-pine-2)]/70 to-[var(--b-pine-2)]/10" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl w-full px-5 pt-32 pb-12 md:pb-24 grid md:grid-cols-[1fr_auto] gap-8 md:gap-10 items-end">
          <div className="pv-reveal">
            <p className="font-wood tracking-[0.3em] text-xs md:text-sm uppercase text-[var(--b-sky)]">
              Main Street · Kamas, Utah · Elev. 6,485 ft
            </p>
            <h1 className="mt-4 font-wood text-[clamp(2.6rem,12vw,6rem)] leading-[0.95] uppercase">
              Last great<br />burger before<br />the Uintas.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-[var(--b-cream)]/85">
              Hand-pattied burgers, hand-cut fries, and 90-flavor shakes from an original 1918 soda
              fountain. Fuel up before Mirror Lake Highway, or reward yourself on the way back.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#menu" className="font-wood uppercase tracking-wider bg-[var(--b-rust)] text-[var(--b-cream)] px-7 py-3.5 hover:bg-[#c9613a] transition-colors">
                View menu
              </a>
              <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="font-wood uppercase tracking-wider border-2 border-[var(--b-cream)] px-7 py-3.5 hover:bg-[var(--b-cream)] hover:text-[var(--b-pine)] transition-colors">
                Get directions
              </a>
            </div>
          </div>

          {/* Trail sign stack */}
          <div className="flex flex-col gap-2 items-start pv-reveal-2">
            <TrailSign>
              <OpenBadge hours={hours} openText="Open" closedText="Closed" />
            </TrailSign>
            {grouped.map((g) => (
              <TrailSign key={g.days}>
                <span className="text-[var(--b-sky)] mr-3">{g.days}</span>
                {g.value}
              </TrailSign>
            ))}
            <TrailSign className="!bg-[var(--b-rust)]">
              <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">{ADDRESS} ↗</a>
            </TrailSign>
          </div>
        </div>
      </section>

      {/* Award strip */}
      <section className="border-y border-[var(--b-cream)]/15 bg-[var(--b-pine)]">
        <div className="mx-auto max-w-7xl px-5 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 font-wood text-xs md:text-sm uppercase tracking-[0.25em] text-[var(--b-cream)]/80">
          <span className="flex items-center gap-3">
            <img src="/images/best-of-state.png" alt="" className="h-9 w-9 rounded-full" aria-hidden="true" />
            16× Best of State · Best Burger
          </span>
          <span aria-hidden="true" className="hidden md:inline text-[var(--b-rust)]">✦</span>
          <span>Est. 1918</span>
          <span aria-hidden="true" className="hidden md:inline text-[var(--b-rust)]">✦</span>
          <span>Family owned since 1968</span>
          <span aria-hidden="true" className="hidden md:inline text-[var(--b-rust)]">✦</span>
          <span>Leatherby&rsquo;s ice cream</span>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="pv-contours scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="font-wood tracking-[0.3em] text-xs uppercase text-[var(--b-sky)]">The menu</p>
              <h2 className="font-wood text-5xl md:text-6xl uppercase mt-2">Eat like a local.</h2>
            </div>
            <p className="font-body text-[var(--b-cream)]/70 max-w-sm">
              Almost a third-pound of extra-lean beef, ground locally and hand-pattied every morning.
            </p>
          </div>
          <TabbedMenu styles={menuStyles} />
        </div>
      </section>

      {/* Last stop / positioning */}
      <section id="stop" className="bg-[var(--b-cream)] text-[var(--b-ink)] scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-3">
            <img src="/images/hero-3.png" alt="Waitresses under the striped awning" className="aspect-[3/4] object-cover object-top w-full" />
            <img src="/images/hero-5.png" alt="Vintage soda bottles on the shelf" className="aspect-[3/4] object-cover w-full mt-8" />
          </div>
          <div>
            <p className="font-wood tracking-[0.3em] text-xs uppercase text-[var(--b-rust)]">Gateway to the Uintas</p>
            <h2 className="font-wood text-5xl uppercase mt-2 leading-tight">Twelve minutes from the trailhead. A hundred years from anywhere.</h2>
            <p className="mt-6 text-lg text-[var(--b-ink)]/80">
              Kamas is where the Mirror Lake Highway starts. Hikers, anglers, snowmobilers and
              Park City day-trippers have been stopping at our counter for generations, and the
              food you loved as a kid still tastes the same.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-4 font-wood text-sm uppercase tracking-wider">
              <li className="border-l-4 border-[var(--b-rust)] pl-3">Hand-cut fries</li>
              <li className="border-l-4 border-[var(--b-rust)] pl-3">90+ shake flavors</li>
              <li className="border-l-4 border-[var(--b-rust)] pl-3">Homemade scones</li>
              <li className="border-l-4 border-[var(--b-rust)] pl-3">Navajo tacos</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="bg-[var(--b-pine)] scroll-mt-24">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <p className="font-wood tracking-[0.3em] text-xs uppercase text-[var(--b-sky)]">Since 1918</p>
          <h2 className="font-wood text-5xl uppercase mt-2">Still &ldquo;The Drug Store&rdquo;</h2>
          <p className="mt-6 text-lg text-[var(--b-cream)]/80">
            Built in 1918 as a confectionary, the store has had very few changes since it first opened
            its doors. The pharmacy is gone, but the counter, the stools, and the original tile mural
            beneath the ice-cream bar are all still here. Belly up and take a walk down memory lane.
          </p>
          <img src="/images/hero-2.png" alt="Fountain staff behind the counter, 1950s" className="mt-10 w-full max-w-2xl mx-auto aspect-[16/9] object-cover" />
        </div>
      </section>

      <footer className="bg-[var(--b-pine-2)] border-t border-[var(--b-cream)]/15">
        <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row justify-between gap-6 text-sm text-[var(--b-cream)]/70">
          <div>
            <span className="font-wood text-xl text-[var(--b-cream)] block">Hi-Mountain</span>
            <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--b-cream)]">{ADDRESS}</a>
            <span className="mx-2">·</span>
            <a href={PHONE_HREF} className="hover:text-[var(--b-cream)]">{PHONE}</a>
          </div>
          <div>© {new Date().getFullYear()} Hi-Mountain. All rights reserved.</div>
        </div>
      </footer>

      <MobileActionBar
        className="bg-[var(--b-pine-2)] border-t border-[var(--b-cream)]/20"
        itemClass="flex flex-col items-center gap-1 py-2.5 font-wood text-xs uppercase tracking-wider text-[var(--b-cream)]"
        primaryClass="bg-[var(--b-rust)]"
      />
    </div>
  );
}
