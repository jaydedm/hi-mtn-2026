import { Yellowtail, Alfa_Slab_One, Lora } from "next/font/google";
import { Banner } from "@/components/banner";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { getHours } from "@/lib/hours";
import { getOnlineMenus } from "@/lib/menu-data";
import { jsonLdString, restaurantJsonLd } from "@/lib/restaurant-jsonld";
import "./site.css";

export const dynamic = "force-dynamic";

// Sign-painter script + slab display + Lora body
const script = Yellowtail({ subsets: ["latin"], weight: "400", variable: "--font-script" });
const slab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--font-slab" });
const body = Lora({ subsets: ["latin"], variable: "--font-body" });

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [hours, online] = await Promise.all([getHours(), getOnlineMenus()]);

  return (
    // overflow-x-clip: anything wider than the phone would widen the layout viewport and push the
    // fixed bottom bar below the screen. "clip" (not "hidden") keeps the sticky header working.
    <div
      className={`${script.variable} ${slab.variable} ${body.variable} min-h-screen flex flex-col overflow-x-clip bg-ds-cream text-ds-ink font-body pb-16 md:pb-0`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(restaurantJsonLd(hours, online)) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ds-ink focus:px-4 focus:py-2 focus:text-ds-cream"
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
    </div>
  );
}
