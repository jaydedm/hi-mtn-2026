import { getPreviewHours, groupHours } from "../_shared/hours";
import { ADDRESS, DIRECTIONS_URL, PHONE, PHONE_HREF } from "../_shared/menu-data";
import { OpenBadge } from "../_shared/open-badge";
import { MobileActionBar } from "../_shared/mobile-action-bar";
import { TabbedMenu, type MenuStyles } from "../_shared/tabbed-menu";
import { BunMark } from "../_shared/bun-logo";

export const dynamic = "force-dynamic";

const menuStyles: MenuStyles = {
  tabs: "flex flex-wrap justify-center gap-2 mb-10",
  tab: "font-slab text-sm md:text-base px-4 py-2 rounded-full border-2 transition-colors",
  tabActive: "bg-[var(--a-red)] border-[var(--a-red)] text-[var(--a-cream)]",
  tabIdle: "border-[var(--a-ink)]/20 text-[var(--a-ink)] hover:border-[var(--a-red)]",
  blurb: "font-body italic text-center text-[var(--a-ink)]/70 max-w-2xl mx-auto mb-8",
  item: "py-3 border-b border-dotted border-[var(--a-ink)]/20",
  name: "font-slab text-lg text-[var(--a-ink)]",
  leader: "border-b-2 border-dotted border-[var(--a-ink)]/30 mb-1 mx-1",
  price: "font-slab text-lg text-[var(--a-red)]",
  desc: "font-body text-sm italic text-[var(--a-ink)]/70 mt-0.5",
  footer: "font-body italic text-center text-sm text-[var(--a-ink)]/70 mt-8",
};

function Awning({ blue = false }: { blue?: boolean }) {
  return <div className={`${blue ? "pv-awning-blue" : "pv-awning"} pv-scallop h-10 w-full`} aria-hidden="true" />;
}

export default async function DrugStorePage() {
  const hours = await getPreviewHours();
  const grouped = groupHours(hours);

  return (
    <div className="bg-[var(--a-cream)] text-[var(--a-ink)] font-body pb-20 md:pb-0">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[var(--a-cream)]/95 backdrop-blur border-b-2 border-[var(--a-red)]">
        <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2 shrink-0">
            <BunMark className="h-7 w-11 text-[var(--a-red)]" />
            <span className="font-script text-3xl leading-none text-[var(--a-red)] whitespace-nowrap">Hi-Mountain</span>
          </a>
          <div className="hidden md:block"><OpenBadge hours={hours} className="font-slab text-sm" /></div>
          <nav aria-label="Primary" className="flex items-center gap-5 font-slab text-sm">
            <a href="#menu" className="hidden md:inline hover:text-[var(--a-red)]">Menu</a>
            <a href="#story" className="hidden md:inline hover:text-[var(--a-red)]">Since 1918</a>
            <a href="#visit" className="hidden md:inline hover:text-[var(--a-red)]">Visit</a>
            <a href={PHONE_HREF} className="rounded-full bg-[var(--a-blue)] text-[var(--a-cream)] px-4 py-2 hover:bg-[var(--a-red)] transition-colors whitespace-nowrap">
              <span className="md:hidden">Call</span>
              <span className="hidden md:inline">{PHONE}</span>
            </a>
          </nav>
        </div>
        <Awning />
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pt-14 pb-16 md:pt-24 md:pb-28 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div className="pv-reveal text-center md:text-left">
            <p className="font-slab tracking-[0.25em] text-xs uppercase text-[var(--a-blue)]">
              Kamas, Utah · Est. 1918
            </p>
            <h1 className="mt-4 font-script text-[clamp(3.5rem,17vw,7.5rem)] leading-[0.85] text-[var(--a-red)]">
              Hi-Mountain
            </h1>
            <p className="mt-2 font-slab text-xl sm:text-2xl md:text-4xl uppercase tracking-wide">
              Burgers · Shakes · Fries
            </p>
            <p className="mt-6 max-w-md text-lg italic text-[var(--a-ink)]/80 mx-auto md:mx-0">
              An old-fashioned soda fountain and grill that&rsquo;s been Kamas&rsquo;s
              &ldquo;Drug Store&rdquo; for over a century. Belly up to the counter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="#menu" className="font-slab rounded-full bg-[var(--a-red)] text-[var(--a-cream)] px-7 py-3 text-lg shadow-lg hover:-translate-y-0.5 transition">
                See the menu
              </a>
              <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="font-slab rounded-full border-2 border-[var(--a-ink)] px-7 py-3 text-lg hover:bg-[var(--a-ink)] hover:text-[var(--a-cream)] transition">
                Directions
              </a>
            </div>
            <div className="mt-6 md:hidden">
              <OpenBadge hours={hours} className="font-slab text-base" />
            </div>
          </div>

          {/* Oval photo cluster */}
          <div className="relative mx-auto w-full max-w-[340px] md:max-w-none h-[360px] md:h-[520px] pv-reveal-2">
            <img src="/images/hero-3.png" alt="Two waitresses in blue uniforms under the striped awning and Rexall sign" className="pv-oval-frame absolute left-1/2 top-0 -translate-x-1/2 h-52 w-52 md:h-80 md:w-80 object-cover object-top" />
            <img src="/images/hero-2.png" alt="Three fountain staff behind the soda counter, Coca-Cola clock on the wall" className="pv-oval-frame absolute left-2 bottom-8 h-36 w-36 md:h-56 md:w-56 object-cover" />
            <img src="/images/hero-4.png" alt="Pete's Drugs storefront with classic cars parked out front" className="pv-oval-frame absolute right-2 bottom-0 h-32 w-32 md:h-52 md:w-52 object-cover" />
            <div className="absolute right-0 top-2 md:right-4 md:top-6 rotate-6 rounded-full bg-[var(--a-mustard)] text-[var(--a-ink)] h-20 w-20 md:h-24 md:w-24 grid place-items-center text-center font-slab text-[10px] md:text-[11px] leading-tight shadow-xl ring-4 ring-[var(--a-cream)]">
              <span>
                16×<br />BEST OF<br />STATE
              </span>
            </div>
          </div>
        </div>
        <Awning blue />
      </section>

      {/* Neon open-status strip */}
      <section className="bg-[var(--a-ink)] text-[var(--a-cream)]">
        <div className="mx-auto max-w-6xl px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <OpenBadge
            hours={hours}
            className="pv-neon font-script text-4xl text-[#ff5a4e] drop-shadow-[0_0_12px_rgba(255,90,78,.8)]"
            dotClass="shadow-[0_0_10px_currentColor]"
            openText="Open"
            closedText="Closed"
          />
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 font-slab text-sm">
            {grouped.map((g) => (
              <div key={g.days}>
                <dt className="text-[var(--a-mustard)] text-xs tracking-widest uppercase">{g.days}</dt>
                <dd>{g.value}</dd>
              </div>
            ))}
          </dl>
          <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="font-slab text-sm underline underline-offset-4 decoration-[var(--a-mustard)] hover:text-[var(--a-mustard)]">
            {ADDRESS}
          </a>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-5xl px-5 py-20 scroll-mt-28">
        <div className="text-center mb-10">
          <BunMark className="h-10 w-16 mx-auto text-[var(--a-ink)]" />
          <h2 className="font-script text-6xl text-[var(--a-red)] mt-2">The Menu</h2>
          <p className="font-slab text-xs tracking-[0.3em] uppercase text-[var(--a-blue)] mt-2">
            Hand-pattied daily · 90+ shake flavors · Leatherby&rsquo;s ice cream
          </p>
        </div>
        <TabbedMenu styles={menuStyles} />
      </section>

      <Awning />

      {/* Story timeline */}
      <section id="story" className="bg-[var(--a-cream-2)] scroll-mt-28">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <h2 className="font-script text-6xl text-[var(--a-red)] text-center">A Walk Down Memory Lane</h2>
          <p className="text-center italic text-[var(--a-ink)]/70 mt-3 max-w-2xl mx-auto">
            Built in 1918 as a confectionary, the store has had very few changes since it first
            opened its doors. The pharmacy is closed, but to Kamas we&rsquo;re still &ldquo;The Drug Store.&rdquo;
          </p>

          <ol className="mt-14 relative border-l-4 border-dotted border-[var(--a-blue)]/40 ml-4 md:ml-0 md:border-l-0 md:grid md:grid-cols-3 md:gap-10">
            {[
              { year: "1918", img: "/images/hero-4.png", alt: "Pete's Drugs storefront", text: "Opens on Main Street as a confectionary and pharmacy. Locals start calling it the Drug Store, and never stop." },
              { year: "1950s", img: "/images/hero-2.png", alt: "Soda fountain staff", text: "The soda fountain becomes the heart of town. The original tile mural below the counter is still there. Go look." },
              { year: "Today", img: "/images/hero-6.png", alt: "Hi-Mountain Drug sign", text: "Same counter, same hand-pattied burgers, and 16 Best of State awards for the best burger in Utah." },
            ].map((s) => (
              <li key={s.year} className="relative pl-8 md:pl-0 pb-12 md:pb-0">
                <span className="absolute -left-[14px] top-0 h-6 w-6 rounded-full bg-[var(--a-red)] ring-4 ring-[var(--a-cream-2)] md:hidden" aria-hidden="true" />
                <img src={s.img} alt={s.alt} className="pv-oval-frame h-48 w-48 object-cover mx-auto" />
                <p className="mt-6 font-slab text-3xl text-[var(--a-blue)] text-center">{s.year}</p>
                <p className="mt-2 text-center text-[var(--a-ink)]/80">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="bg-[var(--a-blue)] text-[var(--a-cream)] scroll-mt-28">
        <div className="mx-auto max-w-5xl px-5 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-script text-6xl">Come see us</h2>
            <p className="mt-4 text-lg italic text-[var(--a-cream)]/85">
              Whether you&rsquo;ve traveled one mile or a thousand, we hope you&rsquo;ll agree we&rsquo;re well worth the trip.
            </p>
            <address className="not-italic mt-6 font-slab text-lg space-y-1">
              <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="block underline underline-offset-4 decoration-[var(--a-mustard)]">{ADDRESS}</a>
              <a href={PHONE_HREF} className="block underline underline-offset-4 decoration-[var(--a-mustard)]">{PHONE}</a>
            </address>
          </div>
          <div className="rounded-3xl bg-[var(--a-cream)] text-[var(--a-ink)] p-8 shadow-2xl">
            <h3 className="font-slab text-xl mb-4 text-center">Hours <span className="text-xs font-body italic opacity-60">(Mountain Time)</span></h3>
            <ul className="divide-y divide-dotted divide-[var(--a-ink)]/20">
              {grouped.map((g) => (
                <li key={g.days} className="flex justify-between py-2 font-slab">
                  <span>{g.days}</span>
                  <span className={g.value === "Closed" ? "text-[var(--a-red)]" : ""}>{g.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--a-ink)] text-[var(--a-cream)]/70 text-center text-sm py-8 px-5">
        <span className="font-script text-2xl text-[var(--a-cream)] block mb-1">Thank you for being a part of our history.</span>
        © {new Date().getFullYear()} Hi-Mountain · Kamas, Utah
      </footer>

      <MobileActionBar
        className="bg-[var(--a-cream)] border-t-2 border-[var(--a-red)]"
        itemClass="flex flex-col items-center gap-1 py-2.5 font-slab text-xs text-[var(--a-ink)]"
        primaryClass="bg-[var(--a-red)] text-[var(--a-cream)]"
      />
    </div>
  );
}
