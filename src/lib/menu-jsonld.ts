import type { MenuSectionDto } from "@/lib/menu-model";
import { formatPrice } from "@/lib/menu-model";
import { MENU_INFO, MENU_TYPES, type MenuType } from "@/lib/menu-schedule";
import { SITE_URL } from "@/lib/site";

const clean = (s: string) => s.replace(/\*/g, "");

/** schema.org Menu per menu type, with sections, items and USD offers. */
export function menuJsonLd(menus: Record<MenuType, MenuSectionDto[]>) {
  return {
    "@context": "https://schema.org",
    "@graph": MENU_TYPES.filter((t) => menus[t].length).map((t) => ({
      "@type": "Menu",
      name: MENU_INFO[t].title,
      url: `${SITE_URL}/menu?menu=${t}`,
      hasMenuSection: menus[t].map((s) => ({
        "@type": "MenuSection",
        name: s.title,
        ...(s.intro ? { description: s.intro } : {}),
        hasMenuItem: s.items.map((i) => {
          const prices = [
            ...(i.priceCents !== null ? [{ name: i.name, cents: i.priceCents }] : []),
            ...i.options.filter((o) => !o.isAddOn).map((o) => ({ name: `${i.name} (${o.label})`, cents: o.priceCents })),
          ];
          const description = [i.description, i.choices.length ? i.choices.map((c) => clean(c.name)).join(", ") : null]
            .filter(Boolean)
            .join(". ");
          return {
            "@type": "MenuItem",
            name: i.name,
            ...(description ? { description: clean(description) } : {}),
            ...(prices.length
              ? {
                  offers: prices.map((p) => ({
                    "@type": "Offer",
                    name: p.name,
                    price: formatPrice(p.cents),
                    priceCurrency: "USD",
                  })),
                }
              : {}),
          };
        }),
      })),
    })),
  };
}
