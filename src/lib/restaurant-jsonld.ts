import type { HoursRow } from "@/lib/hours-logic";
import { DAY_LONG, isRowOpen } from "@/lib/hours-format";
import { MENU_INFO, MENU_TYPES, type MenuType } from "@/lib/menu-schedule";
import {
  CITY,
  FOUNDED_YEAR,
  PHONE_E164,
  POSTAL_CODE,
  REGION,
  SITE_NAME,
  SITE_URL,
  STREET,
} from "@/lib/site";

/**
 * schema.org Restaurant structured data. Opening hours come from the admin-managed
 * hours table; each menu with online items links to its tab on /menu.
 */
export function restaurantJsonLd(hours: HoursRow[], online: Partial<Record<MenuType, boolean>> = {}) {
  // One spec per distinct open/close window, listing all days that share it.
  const windows = new Map<string, { opens: string; closes: string; days: string[] }>();
  for (const r of [...hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek)) {
    if (!isRowOpen(r)) continue;
    const key = `${r.openTime}-${r.closeTime}`;
    const w = windows.get(key) ?? { opens: r.openTime, closes: r.closeTime, days: [] };
    w.days.push(DAY_LONG[r.dayOfWeek]);
    windows.set(key, w);
  }

  const hasMenu = MENU_TYPES.filter((t) => online[t]).map((t) => ({
    "@type": "Menu",
    name: MENU_INFO[t].title,
    url: absolute(`/menu?menu=${t}`),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/images/hero-3.png`,
    logo: `${SITE_URL}/images/burger-icon.png`,
    telephone: PHONE_E164,
    priceRange: "$",
    servesCuisine: ["Burgers", "American", "Ice Cream", "Milkshakes"],
    foundingDate: String(FOUNDED_YEAR),
    acceptsReservations: false,
    address: {
      "@type": "PostalAddress",
      streetAddress: STREET,
      addressLocality: CITY,
      addressRegion: REGION,
      postalCode: POSTAL_CODE,
      addressCountry: "US",
    },
    openingHoursSpecification: [...windows.values()].map((w) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: w.days,
      opens: w.opens,
      closes: w.closes,
    })),
    ...(hasMenu.length ? { hasMenu } : {}),
  };
}

function absolute(url: string) {
  return url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Serializes for a <script type="application/ld+json">, escaping `<` so content can't close the tag. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
