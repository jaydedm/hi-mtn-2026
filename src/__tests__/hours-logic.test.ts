import { describe, it, expect } from "vitest";
import { isOpenNow, type HoursRow } from "@/lib/hours-logic";

// Helper: create a Date for a specific day/time (no TZ concerns — pure logic test)
function makeDate(dayOfWeek: number, hours: number, minutes: number): Date {
  // Jan 5 2026 is a Monday (dayOfWeek=1), so Jan 4 is Sunday (0)
  const d = new Date(2026, 0, 4 + dayOfWeek, hours, minutes);
  return d;
}

const weeklyHours: HoursRow[] = [
  { dayOfWeek: 0, openTime: null, closeTime: null, isClosed: true }, // Sunday closed
  { dayOfWeek: 1, openTime: "11:00", closeTime: "21:00", isClosed: false },
  { dayOfWeek: 2, openTime: "11:00", closeTime: "21:00", isClosed: false },
  { dayOfWeek: 3, openTime: "11:00", closeTime: "21:00", isClosed: false },
  { dayOfWeek: 4, openTime: "11:00", closeTime: "21:00", isClosed: false },
  { dayOfWeek: 5, openTime: "11:00", closeTime: "22:00", isClosed: false },
  { dayOfWeek: 6, openTime: "11:00", closeTime: "22:00", isClosed: false },
];

describe("isOpenNow", () => {
  it("returns false on a closed day", () => {
    expect(isOpenNow(weeklyHours, makeDate(0, 12, 0))).toBe(false); // Sunday noon
  });

  it("returns false before opening time", () => {
    expect(isOpenNow(weeklyHours, makeDate(1, 10, 59))).toBe(false); // Monday 10:59
  });

  it("returns true exactly at opening time", () => {
    expect(isOpenNow(weeklyHours, makeDate(1, 11, 0))).toBe(true); // Monday 11:00
  });

  it("returns true during open hours", () => {
    expect(isOpenNow(weeklyHours, makeDate(3, 15, 30))).toBe(true); // Wednesday 3:30pm
  });

  it("returns false exactly at closing time", () => {
    expect(isOpenNow(weeklyHours, makeDate(1, 21, 0))).toBe(false); // Monday 9:00pm
  });

  it("returns false after closing time", () => {
    expect(isOpenNow(weeklyHours, makeDate(5, 22, 1))).toBe(false); // Friday 10:01pm
  });

  it("returns true just before closing", () => {
    expect(isOpenNow(weeklyHours, makeDate(5, 21, 59))).toBe(true); // Friday 9:59pm
  });

  it("returns false with empty hours array", () => {
    expect(isOpenNow([], makeDate(1, 12, 0))).toBe(false);
  });

  it("returns false when open/close times are null", () => {
    const hours: HoursRow[] = [
      { dayOfWeek: 1, openTime: null, closeTime: null, isClosed: false },
    ];
    expect(isOpenNow(hours, makeDate(1, 12, 0))).toBe(false);
  });
});
