import type { Metadata } from "next";
import { toZonedTime } from "date-fns-tz";
import { BurgerMark } from "@/components/site/decor";
import { MenuView } from "@/components/site/menu/menu-view";
import { HouseIcon } from "@/components/site/menu/menu-parts";
import { getHours } from "@/lib/hours";
import { getMenu, getSearchGroups } from "@/lib/menu-data";
import { sectionsForMenu } from "@/lib/menu-model";
import {
  isMenuType,
  menuWindowSummary,
  type MenuType,
} from "@/lib/menu-schedule";
import { menuJsonLd } from "@/lib/menu-jsonld";
import { jsonLdString } from "@/lib/restaurant-jsonld";
import { openStatus } from "@/lib/open-status";
import { MOUNTAIN_TZ, PHONE, PHONE_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The full Hi-Mountain menu: award-winning hand-pattied burgers, fries, salads, 90+ shake and malt flavors, Soda Shoppe sundaes, and the After Hours dinner boxes. Kamas, Utah.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ menu?: string }>;
}) {
  const [hours, sections, groups, { menu }] = await Promise.all([
    getHours(),
    getMenu(),
    getSearchGroups(),
    searchParams,
  ]);

  const menus: Record<MenuType, ReturnType<typeof sectionsForMenu>> = {
    lunch: sectionsForMenu(sections, "lunch"),
    "after-hours": sectionsForMenu(sections, "after-hours"),
  };
  const serving = openStatus(
    hours,
    toZonedTime(new Date(), MOUNTAIN_TZ),
  ).serving;
  const initial: MenuType = isMenuType(menu) ? menu : (serving ?? "lunch");
  const hasOnlineMenu = menus.lunch.length + menus["after-hours"].length > 0;

  return (
    <section className="mx-auto max-w-5xl px-5 pt-12 pb-16 md:pt-16">
      {hasOnlineMenu && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(menuJsonLd(menus)) }}
        />
      )}
      <div className="text-center mb-8">
        <BurgerMark className="h-12 mx-auto" />
        <h1 className="ds-title font-title text-6xl md:text-7xl text-ds-primary mt-2">
          Our Menu
        </h1>
        <p className="font-label text-xs tracking-[0.3em] uppercase text-ds-secondary mt-3">
          Hand-pattied daily · 90+ shake flavors · Leatherby&rsquo;s ice cream
        </p>
        <p className="italic text-ds-ink/75 mt-5 max-w-2xl mx-auto">
          Dine in all day. After lunch the grill shuts down and we switch to
          Hi-Mountain After Hours: our full shake and ice cream menu, plus comfy
          favorites, salads, and box combos.
        </p>
        <p className="mt-4 font-label text-sm text-ds-ink">
          For takeout, call{" "}
          <a
            href={PHONE_HREF}
            className="text-ds-secondary underline underline-offset-4 decoration-2"
          >
            {PHONE}
          </a>
          .
        </p>
      </div>

      {hasOnlineMenu ? (
        <MenuView
          menus={menus}
          groups={groups}
          initial={initial}
          serving={serving}
          windows={{
            lunch: menuWindowSummary(hours, "lunch"),
            "after-hours": menuWindowSummary(hours, "after-hours"),
          }}
        />
      ) : (
        <p className="rounded-3xl bg-ds-card p-8 text-center shadow ring-1 ring-ds-ink/10">
          Our menu is being updated. Call us at{" "}
          <a
            href={PHONE_HREF}
            className="font-label underline underline-offset-4"
          >
            {PHONE}
          </a>{" "}
          and we&rsquo;ll tell you what&rsquo;s on today.
        </p>
      )}

      <footer className="mt-12 space-y-2 text-center text-xs text-ds-ink/70">
        <p>
          <HouseIcon className="mr-1 -translate-y-px text-ds-primary" />{" "}
          House-made
        </p>
        <p>
          Consuming raw or undercooked meat, seafood, or egg products can
          increase your risk of foodborne illness, especially if you have
          certain medical conditions.
        </p>
        <p>
          The food we serve may contain traces of egg, peanut, tree nuts, soy,
          milk, shellfish, gluten, or sesame seeds. Please alert us to food
          allergies, or call{" "}
          <a
            href={PHONE_HREF}
            className="font-label text-ds-secondary underline underline-offset-4"
          >
            {PHONE}
          </a>
          .
        </p>
      </footer>
    </section>
  );
}
