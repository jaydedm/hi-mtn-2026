import { describe, it, expect } from "vitest";
import type { HoursRow } from "@/lib/hours-logic";
import { fmtTime, groupHours } from "@/lib/hours-format";
import { MENU_INFO, groupSchedule, isMenuType, menuTypeAt, menuWindowSummary, menuWindows } from "@/lib/menu-schedule";
import { invalidHoursDays } from "@/lib/hours-validation";
import { jsonLdString, restaurantJsonLd } from "@/lib/restaurant-jsonld";
import { openStatus } from "@/lib/open-status";

const weekdays: HoursRow[] = [
  { dayOfWeek: 0, openTime: null, closeTime: null, isClosed: true },
  ...[1, 2, 3, 4, 5].map((d) => ({ dayOfWeek: d, openTime: "11:00", closeTime: "20:00", isClosed: false })),
  { dayOfWeek: 6, openTime: null, closeTime: null, isClosed: true },
];

describe("fmtTime", () => {
  it("formats whole and partial hours", () => {
    expect(fmtTime("11:00")).toBe("11am");
    expect(fmtTime("16:00")).toBe("4pm");
    expect(fmtTime("12:30")).toBe("12:30pm");
    expect(fmtTime("00:15")).toBe("12:15am");
  });
});

describe("groupHours", () => {
  it("collapses consecutive days and wraps Sat–Sun", () => {
    expect(groupHours(weekdays)).toEqual([
      { days: "Mon–Fri", value: "11am–8pm" },
      { days: "Sat–Sun", value: "Closed" },
    ]);
  });

  it("keeps a single differing day on its own", () => {
    const hours = weekdays.map((h) => (h.dayOfWeek === 5 ? { ...h, closeTime: "21:00" } : h));
    expect(groupHours(hours)).toEqual([
      { days: "Mon–Thu", value: "11am–8pm" },
      { days: "Fri", value: "11am–9pm" },
      { days: "Sat–Sun", value: "Closed" },
    ]);
  });

  it("treats missing days as closed", () => {
    expect(groupHours([])).toEqual([{ days: "Mon–Sun", value: "Closed" }]);
  });
});

describe("menu schedule", () => {
  const at = (h: number, m = 0) => new Date(2026, 8, 28, h, m);
  const mon = weekdays[1];

  it("serves lunch all day when no After Hours start is set", () => {
    expect(menuWindows(mon)).toEqual({ lunch: { start: "11:00", end: "20:00" }, "after-hours": null });
    expect(menuTypeAt(mon, at(19))).toBe("lunch");
  });

  it("splits the day at the After Hours start", () => {
    const row = { ...mon, afterHoursStart: "16:00" };
    expect(menuWindows(row)).toEqual({
      lunch: { start: "11:00", end: "16:00" },
      "after-hours": { start: "16:00", end: "20:00" },
    });
    expect(menuTypeAt(row, at(15, 59))).toBe("lunch");
    expect(menuTypeAt(row, at(16))).toBe("after-hours");
  });

  it("ignores an After Hours start outside open hours", () => {
    expect(menuWindows({ ...mon, afterHoursStart: "21:00" })["after-hours"]).toBeNull();
    expect(menuWindows({ ...mon, afterHoursStart: "11:00" })["after-hours"]).toBeNull();
  });

  it("has no windows on closed days", () => {
    expect(menuWindows(weekdays[0])).toEqual({ lunch: null, "after-hours": null });
    expect(menuWindows(undefined)).toEqual({ lunch: null, "after-hours": null });
  });

  it("summarizes windows across the week", () => {
    const split = weekdays.map((h) => (h.isClosed ? h : { ...h, afterHoursStart: "16:00" }));
    expect(menuWindowSummary(split, "lunch")).toBe("11am – 4pm");
    expect(menuWindowSummary(split, "after-hours")).toBe("4pm – 8pm");
    expect(menuWindowSummary(weekdays, "after-hours")).toBeNull();
    const varied = split.map((h) => (h.dayOfWeek === 5 ? { ...h, closeTime: "21:00" } : h));
    expect(menuWindowSummary(varied, "after-hours")).toBe("Times vary by day");
  });

  it("groups days by hours and menu windows", () => {
    const split = weekdays.map((h) => (h.dayOfWeek === 5 ? { ...h, afterHoursStart: "16:00" } : h));
    expect(groupSchedule(split)).toEqual([
      { days: "Mon–Thu", hours: "11am–8pm", lunch: null, afterHours: null, dining: "11am – 8pm" },
      { days: "Fri", hours: "11am–8pm", lunch: "11am – 4pm", afterHours: "4pm – 8pm", dining: "11am – 4pm" },
      { days: "Sat–Sun", hours: "Closed", lunch: null, afterHours: null, dining: null },
    ]);
  });

  it("validates menu types", () => {
    expect(isMenuType("lunch")).toBe(true);
    expect(isMenuType("after-hours")).toBe(true);
    expect(isMenuType("dinner")).toBe(false);
    expect(isMenuType(undefined)).toBe(false);
  });
});

describe("invalidHoursDays", () => {
  it("accepts well-ordered days and closed days", () => {
    expect(invalidHoursDays(weekdays.map((h) => (h.isClosed ? h : { ...h, afterHoursStart: "16:00" })))).toEqual([]);
  });
  it("flags close before open and After Hours outside open hours", () => {
    expect(
      invalidHoursDays([
        { dayOfWeek: 1, openTime: "11:00", closeTime: "10:00", isClosed: false },
        { dayOfWeek: 2, openTime: "11:00", closeTime: "20:00", afterHoursStart: "20:00", isClosed: false },
        { dayOfWeek: 3, openTime: "11:00", closeTime: "20:00", afterHoursStart: "09:00", isClosed: false },
      ])
    ).toEqual([1, 2, 3]);
  });
});

describe("restaurantJsonLd", () => {
  it("builds opening hours from the table and skips closed days", () => {
    const ld = restaurantJsonLd(weekdays, {});
    expect(ld["@type"]).toBe("Restaurant");
    expect(ld.openingHoursSpecification).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "11:00",
        closes: "20:00",
      },
    ]);
    expect(ld).not.toHaveProperty("hasMenu");
  });

  it("lists only menus with online items, linking to their /menu tab", () => {
    const ld = restaurantJsonLd(weekdays, { lunch: false, "after-hours": true });
    expect(ld.hasMenu).toEqual([
      { "@type": "Menu", name: MENU_INFO["after-hours"].title, url: "https://www.himtnburgers.com/menu?menu=after-hours" },
    ]);
  });

  it("escapes < when serialized", () => {
    expect(jsonLdString({ a: "</script>" })).not.toContain("</script>");
  });
});

describe("openStatus", () => {
  // Sep 28 2026 is a Monday
  const on = (dayOffset: number, h: number, m = 0) => new Date(2026, 8, 28 + dayOffset, h, m);

  const split = weekdays.map((h) => (h.isClosed ? h : { ...h, afterHoursStart: "16:00" }));

  it("reports open with close time and the lunch menu before After Hours", () => {
    expect(openStatus(split, on(0, 12))).toEqual({
      open: true,
      detail: "Closes 8pm",
      today: 1,
      serving: "lunch",
      servingDetail: "Lunch until 4pm",
    });
  });

  it("reports the After Hours menu once it starts", () => {
    expect(openStatus(split, on(0, 17))).toMatchObject({ serving: "after-hours", servingDetail: "After Hours until 8pm" });
  });

  it("serves lunch until close on days without After Hours", () => {
    expect(openStatus(weekdays, on(0, 17))).toMatchObject({ serving: "lunch", servingDetail: "Lunch until 8pm" });
  });

  it("reports opening later today", () => {
    expect(openStatus(weekdays, on(0, 9))).toMatchObject({ open: false, detail: "Opens 11am", serving: null });
  });

  it("reports opening tomorrow after close", () => {
    expect(openStatus(weekdays, on(0, 21)).detail).toBe("Opens tomorrow 11am");
  });

  it("names the day when the next opening is further out", () => {
    expect(openStatus(weekdays, on(5, 12)).detail).toBe("Opens Mon 11am"); // Saturday
  });

  it("handles a week with no open days", () => {
    expect(openStatus([], on(0, 12)).detail).toBe("Closed");
  });
});
