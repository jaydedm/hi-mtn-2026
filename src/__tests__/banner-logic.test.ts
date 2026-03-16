import { describe, it, expect } from "vitest";
import { isBannerVisible } from "@/lib/banner-logic";

const base = {
  isActive: true,
  startDate: null,
  endDate: null,
};

describe("isBannerVisible", () => {
  it("returns false when banner is null", () => {
    expect(isBannerVisible(null)).toBe(false);
  });

  it("returns false when banner is inactive", () => {
    expect(isBannerVisible({ ...base, isActive: false })).toBe(false);
  });

  it("returns true when active with no date window", () => {
    expect(isBannerVisible(base)).toBe(true);
  });

  it("returns false before the start date", () => {
    const banner = {
      ...base,
      startDate: new Date("2099-01-01T00:00:00Z"),
    };
    expect(isBannerVisible(banner, new Date("2026-03-16T12:00:00Z"))).toBe(false);
  });

  it("returns true after the start date with no end date", () => {
    const banner = {
      ...base,
      startDate: new Date("2020-01-01T00:00:00Z"),
    };
    expect(isBannerVisible(banner, new Date("2026-03-16T12:00:00Z"))).toBe(true);
  });

  it("returns false after the end date", () => {
    const banner = {
      ...base,
      startDate: new Date("2026-03-01T00:00:00Z"),
      endDate: new Date("2026-03-10T00:00:00Z"),
    };
    expect(isBannerVisible(banner, new Date("2026-03-15T00:00:00Z"))).toBe(false);
  });

  it("returns true within the date window", () => {
    const banner = {
      ...base,
      startDate: new Date("2026-03-01T00:00:00Z"),
      endDate: new Date("2026-03-31T00:00:00Z"),
    };
    expect(isBannerVisible(banner, new Date("2026-03-16T12:00:00Z"))).toBe(true);
  });

  it("returns true with only an end date in the future", () => {
    const banner = {
      ...base,
      endDate: new Date("2099-12-31T00:00:00Z"),
    };
    expect(isBannerVisible(banner, new Date("2026-03-16T12:00:00Z"))).toBe(true);
  });

  it("returns false with only an end date in the past", () => {
    const banner = {
      ...base,
      endDate: new Date("2020-01-01T00:00:00Z"),
    };
    expect(isBannerVisible(banner, new Date("2026-03-16T12:00:00Z"))).toBe(false);
  });
});
