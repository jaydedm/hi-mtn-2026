import type { ScheduleGroup } from "@/lib/menu-schedule";
import {
  ADDRESS,
  BEST_OF_STATE_COUNT,
  FOUNDED_YEAR,
  PHONE,
  SITE_URL,
} from "@/lib/site";

export type Faq = { q: string; a: string };

/** "Mon–Fri 11am–8pm, Sat–Sun closed" from the grouped weekly schedule. */
export function hoursSentence(groups: ScheduleGroup[]): string {
  return groups
    .map((g) => `${g.days} ${g.hours === "Closed" ? "closed" : g.hours}`)
    .join(", ");
}

/**
 * Visitor questions for the home page and its FAQPage JSON-LD. Written around what people
 * search for near Kamas (Park City, Heber, the Uintas); hours come from the live schedule.
 */
export function buildFaqs(groups: ScheduleGroup[]): Faq[] {
  const afterHours = groups.find((g) => g.afterHours);
  return [
    {
      q: "Where is Hi-Mountain?",
      a: `We're at ${ADDRESS}, on Main Street in Kamas, at the start of the Mirror Lake Scenic Byway into the Uinta Mountains. It's about 20 minutes from Park City, about 25 minutes from Heber City, and about an hour from Salt Lake City.`,
    },
    {
      q: "Is Hi-Mountain a good burger stop near Park City?",
      a: `Yes. It's a short drive from Park City, and we have won Best of State ${BEST_OF_STATE_COUNT} times. It's an easy stop on the way to or from the Uintas.`,
    },
    {
      q: "What is Hi-Mountain known for?",
      a: `Award-winning burgers, fries, and thick milkshakes in dozens of flavors, served from an old-fashioned soda fountain that has been open on Kamas's Main Street since ${FOUNDED_YEAR}. Locals still call it "The Drug Store."`,
    },
    {
      q: "Can I order online?",
      a: `No, we don't take online orders. For takeout, give us a call at ${PHONE} and we'll have it ready, or order at the counter when you come in.`,
    },
    {
      q: "What are your hours?",
      a: `${hoursSentence(groups)} (Mountain Time).${
        afterHours
          ? ` On ${afterHours.days}, the Lunch Menu runs ${afterHours.lunch ?? afterHours.dining}, then After Hours runs ${afterHours.afterHours}.`
          : ""
      } Current hours are always on our hours page.`,
    },
    {
      q: "What's on the After Hours menu?",
      a: "Our full shake and ice cream menu, plus heartier favorites, salads, and box combos. You can see both menus, with prices, on our menu page.",
    },
  ];
}

/** schema.org FAQPage for the home page. */
export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: SITE_URL,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
