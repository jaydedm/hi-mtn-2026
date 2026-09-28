import { getPreviewHours, groupHours } from "../_shared/hours";
import { ADDRESS, DIRECTIONS_URL, MENU, PHONE, PHONE_HREF } from "../_shared/menu-data";
import { OpenBadge } from "../_shared/open-badge";
import { MobileActionBar } from "../_shared/mobile-action-bar";
import { TabbedMenu, type MenuStyles } from "../_shared/tabbed-menu";
import { BunLogo } from "../_shared/bun-logo";
import { StickerReveal } from "./sticker-reveal";

export const dynamic = "force-dynamic";

const menuStyles: MenuStyles = {
  tabs: "flex flex-wrap gap-2 mb-10",
  tab: "font-condensed text-xl px-4 py-1.5 border-[3px] border-[var(--c-black)] pv-hard-sm pv-hard-hover",
  tabActive: "bg-[var(--c-red)] text-white",
  tabIdle: "bg-white text-[var(--c-black)]",
  blurb: "font-grotesk font-semibold text-lg max-w-2xl mb-8 border-l-[6px] border-[var(--c-yellow)] pl-4",
  item: "py-3 border-b-[3px] border-[var(--c-black)]",
  name: "font-display text-lg uppercase",
  price: "font-condensed text-2xl bg-[var(--c-yellow)] px-2 leading-none border-2 border-[var(--c-black)]",
  desc: "font-grotesk text-sm mt-1",
  footer: "font-grotesk text-sm mt-8 font-semibold",
};

const TICKER = [
  "16× Best of State",
  "Since 1918",
  "Hand-pattied daily",
  "90+ shake flavors",
  "Hand-cut fries",
  "Kamas, Utah",
  "Leatherby's ice cream",
];

function Sticker({ children, tilt = "-4deg", className = "" }: { children: React.ReactNode; tilt?: string; className?: string }) {
  return (
    <span
      className={`pv-sticker inline-block font-condensed text-lg md:text-2xl leading-none px-3 py-2 border-[3px] border-[var(--c-black)] pv-hard-sm ${className}`}
      style={{ "--tilt": tilt } as React.CSSProperties}
    >
      {children}
    </span>
  );
}

export default async function LoudPage() {
  const hours = await getPreviewHours();
  const grouped = groupHours(hours);
  const tiles = MENU.filter((s) => ["burgers", "shakes", "sides", "soda-shoppe", "kids", "all-the-rest"].includes(s.id));

  return (
    <div className="bg-[var(--c-paper)] text-[var(--c-black)] font-grotesk pb-20 md:pb-0">
      {/* Ticker */}
      <div className="bg-[var(--c-black)] text-[var(--c-yellow)] overflow-hidden border-b-[3px] border-[var(--c-black)]" aria-hidden="true">
        <div className="pv-marquee flex w-max whitespace-nowrap font-condensed text-lg tracking-wider py-1.5">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="px-6">
              {t} <span className="text-[var(--c-red)] ml-6">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 bg-[var(--c-paper)] border-b-[3px] border-[var(--c-black)]">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <a href="#top" className="font-display text-xl md:text-2xl uppercase tracking-tight whitespace-nowrap">Hi-Mountain</a>
          <div className="hidden md:block"><OpenBadge hours={hours} className="font-condensed text-lg border-2 border-[var(--c-black)] px-3 py-1 bg-white whitespace-nowrap" /></div>
          <nav aria-label="Primary" className="flex items-center gap-2 md:gap-3 font-condensed text-lg">
            <a href="#menu" className="hidden md:inline-block px-3 py-1.5 border-[3px] border-[var(--c-black)] bg-white pv-hard-sm pv-hard-hover">Menu</a>
            <a href="#story" className="hidden md:inline-block px-3 py-1.5 border-[3px] border-[var(--c-black)] bg-white pv-hard-sm pv-hard-hover">1918</a>
            <a href={PHONE_HREF} className="px-3 py-1.5 border-[3px] border-[var(--c-black)] bg-[var(--c-yellow)] pv-hard-sm pv-hard-hover whitespace-nowrap">
              <span className="md:hidden">Call us</span>
              <span className="hidden md:inline">{PHONE}</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="border-b-[3px] border-[var(--c-black)] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-12 pb-16 md:pt-20 md:pb-24 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div className="pv-reveal">
            <div className="flex flex-wrap gap-3 mb-6">
              <Sticker className="bg-[var(--c-yellow)]" tilt="-5deg">16× Best of State</Sticker>
              <Sticker className="bg-white" tilt="3deg">Kamas, UT</Sticker>
              <Sticker className="bg-[var(--c-red)] text-white" tilt="-2deg">Thick shakes</Sticker>
            </div>
            <h1 className="font-display uppercase leading-[0.85] text-[15vw] lg:text-[8.5rem] tracking-tighter">
              Best<br />
              <span className="text-[var(--c-red)]">burger</span><br />
              in Utah.<br />
              <span className="font-condensed text-[7vw] lg:text-6xl tracking-normal">Since 1918. Not kidding.</span>
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#menu" className="font-condensed text-2xl px-7 py-3 bg-[var(--c-red)] text-white border-[3px] border-[var(--c-black)] pv-hard pv-hard-hover">
                See the menu →
              </a>
              <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="font-condensed text-2xl px-7 py-3 bg-white border-[3px] border-[var(--c-black)] pv-hard pv-hard-hover">
                Take me there
              </a>
            </div>
            <div className="mt-6 md:hidden">
              <OpenBadge hours={hours} className="font-condensed text-xl border-2 border-[var(--c-black)] px-3 py-1 bg-white" />
            </div>
          </div>

          <div className="pv-reveal-2 relative">
            <div className="border-[3px] border-[var(--c-black)] bg-white p-6 pv-hard">
              <BunLogo className="w-full text-[var(--c-black)]" strokeWidth={6} />
            </div>
            <StickerReveal
              className="absolute -bottom-6 -left-4 md:-left-10 w-40 md:w-52 rotate-[-6deg]"
              front={
                <span className="block bg-[var(--c-yellow)] border-[3px] border-[var(--c-black)] pv-hard-sm p-3 font-condensed text-xl text-center">
                  Peel me →<br /><span className="text-sm font-grotesk font-semibold normal-case">1950s fountain crew</span>
                </span>
              }
              back={<img src="/images/hero-2.png" alt="Fountain staff behind the counter, 1950s" className="w-full aspect-[4/3] object-cover border-[3px] border-[var(--c-black)] pv-hard-sm" />}
            />
            <StickerReveal
              className="absolute -top-6 -right-3 md:-right-8 w-36 md:w-44 rotate-[5deg]"
              front={
                <span className="block bg-[var(--c-red)] text-white border-[3px] border-[var(--c-black)] pv-hard-sm p-3 font-condensed text-xl text-center">
                  Rexall days
                </span>
              }
              back={<img src="/images/hero-3.png" alt="Waitresses under the Rexall sign" className="w-full aspect-[4/3] object-cover object-top border-[3px] border-[var(--c-black)] pv-hard-sm" />}
            />
          </div>
        </div>
      </section>

      {/* Hours + tiles */}
      <section className="bg-[var(--c-yellow)] border-b-[3px] border-[var(--c-black)] pv-halftone">
        <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-[auto_1fr] gap-8 items-start">
          <div className="bg-white border-[3px] border-[var(--c-black)] pv-hard p-5 min-w-[260px]">
            <h2 className="font-display uppercase text-xl mb-3">Hours</h2>
            <ul className="font-condensed text-xl divide-y-2 divide-[var(--c-black)]">
              {grouped.map((g) => (
                <li key={g.days} className="flex justify-between gap-8 py-1.5">
                  <span>{g.days}</span>
                  <span className={g.value === "Closed" ? "text-[var(--c-red)]" : ""}>{g.value}</span>
                </li>
              ))}
            </ul>
            <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="mt-4 block font-grotesk font-bold text-sm underline underline-offset-4">
              {ADDRESS} ↗
            </a>
          </div>
          <div>
            <h2 className="font-display uppercase text-3xl md:text-5xl leading-none mb-5">Jump to the good stuff</h2>
            <ul className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {tiles.map((s, i) => (
                <li key={s.id}>
                  <a
                    href="#menu"
                    className={`block border-[3px] border-[var(--c-black)] pv-hard pv-hard-hover p-4 md:p-5 min-h-28 ${
                      i % 3 === 0 ? "bg-[var(--c-red)] text-white" : i % 3 === 1 ? "bg-white" : "bg-[var(--c-black)] text-[var(--c-yellow)]"
                    }`}
                  >
                    <span className="font-display uppercase text-xl md:text-2xl leading-none block">{s.title}</span>
                    <span className="font-grotesk text-xs mt-2 block opacity-80">{s.items.length} items</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="scroll-mt-24 border-b-[3px] border-[var(--c-black)]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter mb-8">
            The <span className="bg-[var(--c-yellow)] px-2">menu.</span>
          </h2>
          <TabbedMenu styles={menuStyles} />
        </div>
      </section>

      {/* Story */}
      <section id="story" className="bg-[var(--c-black)] text-[var(--c-paper)] scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Sticker className="bg-[var(--c-yellow)] text-[var(--c-black)] mb-6" tilt="-3deg">Est. 1918</Sticker>
            <h2 className="font-display uppercase text-4xl md:text-6xl leading-[0.9] tracking-tight">
              Still the<br /><span className="text-[var(--c-red)]">Drug Store.</span>
            </h2>
            <p className="mt-6 text-lg text-[var(--c-paper)]/80 max-w-md">
              Built in 1918 as a confectionary. The pharmacy&rsquo;s gone, the counter isn&rsquo;t. Peek
              under the ice-cream bar for the original tile mural, then order a shake. We have 90 flavors.
              You&rsquo;ll be fine.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/images/hero-4.png" alt="Pete's Drugs storefront" className="border-[3px] border-[var(--c-paper)] aspect-square object-cover rotate-[-2deg]" />
            <img src="/images/hero-6.png" alt="Hi-Mountain Drug sign" className="border-[3px] border-[var(--c-paper)] aspect-square object-cover object-top rotate-[3deg] mt-6" />
            <img src="/images/hero-5.png" alt="Vintage soda bottles" className="border-[3px] border-[var(--c-paper)] aspect-square object-cover rotate-[2deg]" />
            <img src="/images/hero-1.png" alt="Historic photos on the counter" className="border-[3px] border-[var(--c-paper)] aspect-square object-cover rotate-[-3deg] mt-6" />
          </div>
        </div>
      </section>

      <footer className="bg-[var(--c-red)] text-white border-t-[3px] border-[var(--c-black)]">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row justify-between gap-4 font-condensed text-xl">
          <span>Hi-Mountain · <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="underline">{ADDRESS}</a> · <a href={PHONE_HREF} className="underline">{PHONE}</a></span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>

      <MobileActionBar
        className="bg-[var(--c-paper)] border-t-[3px] border-[var(--c-black)] divide-x-[3px] divide-[var(--c-black)]"
        itemClass="flex flex-col items-center gap-1 py-2.5 font-condensed text-base text-[var(--c-black)]"
        primaryClass="bg-[var(--c-yellow)]"
      />
    </div>
  );
}
