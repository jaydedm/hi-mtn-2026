import { describe, expect, it } from "vitest";
import { buildFaqs, faqJsonLd, hoursSentence } from "@/lib/faq";
import type { ScheduleGroup } from "@/lib/menu-schedule";

const groups: ScheduleGroup[] = [
  { days: "Mon–Fri", hours: "11am–8pm", lunch: "11am – 4pm", afterHours: "4pm – 8pm", dining: "11am – 4pm" },
  { days: "Sat–Sun", hours: "Closed", lunch: null, afterHours: null, dining: null },
];

describe("faq", () => {
  it("summarizes the live schedule", () => {
    expect(hoursSentence(groups)).toBe("Mon–Fri 11am–8pm, Sat–Sun closed");
    const hours = buildFaqs(groups).find((f) => f.q === "What are your hours?")!;
    expect(hours.a).toContain("Mon–Fri 11am–8pm, Sat–Sun closed");
    expect(hours.a).toContain("After Hours runs 4pm – 8pm");
  });

  it("omits the After Hours sentence when no day has it", () => {
    const hours = buildFaqs([groups[1]]).find((f) => f.q === "What are your hours?")!;
    expect(hours.a).not.toContain("After Hours");
  });

  it("builds FAQPage JSON-LD with one Question per entry", () => {
    const faqs = buildFaqs(groups);
    const ld = faqJsonLd(faqs);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.url).toBe("https://www.himtnburgers.com");
    expect(ld.mainEntity).toHaveLength(faqs.length);
    expect(ld.mainEntity[0]).toMatchObject({ "@type": "Question", acceptedAnswer: { "@type": "Answer" } });
  });
});
