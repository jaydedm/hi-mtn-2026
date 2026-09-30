import { Yellowtail, Alfa_Slab_One, Lora, Outfit, Inter, Manrope, Space_Grotesk, Fraunces, Oswald, Bitter, Bricolage_Grotesque, Young_Serif, Instrument_Serif } from "next/font/google";
import { Banner } from "@/components/banner";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { ThemeLab } from "@/components/site/theme-lab";
import { getHours } from "@/lib/hours";
import { getOnlineMenus } from "@/lib/menu-data";
import { jsonLdString, restaurantJsonLd } from "@/lib/restaurant-jsonld";
import "./site.css";

export const dynamic = "force-dynamic";

// Every family a type set can use (TYPE_SETS in src/lib/theme.ts), exposed as --ff-<key>.
// next/font needs literal options, so `preload` is set by hand: true only for the active type
// set's families (currently "poster": Oswald + Alfa Slab + Lora). The browser downloads the others only if a
// page uses them (e.g. in the theme lab). Update these flags if ACTIVE_THEME.type changes.
const script = Yellowtail({ subsets: ["latin"], weight: "400", variable: "--ff-script", preload: false });
const slab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--ff-slab", preload: true });
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--ff-lora", preload: true });
const outfit = Outfit({ subsets: ["latin"], variable: "--ff-outfit", preload: false });
const inter = Inter({ subsets: ["latin"], variable: "--ff-inter", preload: false });
const manrope = Manrope({ subsets: ["latin"], variable: "--ff-manrope", preload: false });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--ff-grotesk", preload: false });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--ff-fraunces", preload: false });
const oswald = Oswald({ subsets: ["latin"], variable: "--ff-oswald", preload: true });
const bitter = Bitter({ subsets: ["latin"], variable: "--ff-bitter", preload: false });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--ff-bricolage", preload: false });
const young = Young_Serif({ subsets: ["latin"], weight: "400", variable: "--ff-young", preload: false });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--ff-instrument", preload: false });
const fontVars = [script, slab, lora, outfit, inter, manrope, grotesk, fraunces, oswald, bitter, bricolage, young, instrument].map((f) => f.variable).join(" ");

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [hours, online] = await Promise.all([getHours(), getOnlineMenus()]);

  return (
    // overflow-x-clip: anything wider than the phone would widen the layout viewport and push the
    // fixed bottom bar below the screen. "clip" (not "hidden") keeps the sticky header working.
    <div
      className={`${fontVars} ds-site min-h-screen flex flex-col overflow-x-clip bg-ds-paper text-ds-ink font-body pb-16 md:pb-0`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(restaurantJsonLd(hours, online)) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ds-ink focus:px-4 focus:py-2 focus:text-ds-paper"
      >
        Skip to content
      </a>
      {/* Banner + header stick together, so the banner stays visible until it's closed. */}
      <div data-site-top className="sticky top-0 z-40">
        <Banner />
        <SiteHeader hours={hours} />
      </div>
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <MobileActionBar />
      <ThemeLab />
    </div>
  );
}
