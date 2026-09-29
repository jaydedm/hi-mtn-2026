import { describe, expect, it } from "vitest";
import { isValidBannerLink, validateBanner } from "@/lib/banner-validation";

describe("validateBanner", () => {
  it("trims fields and nulls empty optionals", () => {
    const r = validateBanner({ label: "  Summer hours ", bannerText: " Open late ", details: " ", isActive: true });
    expect(r).toEqual({
      data: {
        label: "Summer hours",
        bannerText: "Open late",
        details: null,
        linkUrl: null,
        linkText: null,
        bannerType: "casual",
        isActive: true,
        startDate: null,
        endDate: null,
      },
    });
  });

  it("drops the link when there are details, and defaults link text", () => {
    expect(validateBanner({ bannerText: "x", details: "More", linkUrl: "/hours" }).data?.linkUrl).toBeNull();
    const r = validateBanner({ bannerText: "x", linkUrl: "/hours" });
    expect(r.data?.linkUrl).toBe("/hours");
    expect(r.data?.linkText).toBe("Learn more");
  });

  it("rejects missing headline when active, long fields, bad links and bad date ranges", () => {
    expect(validateBanner({ bannerText: "", isActive: true }).error).toMatch(/headline/);
    expect(validateBanner({ bannerText: "x".repeat(81) }).error).toMatch(/80/);
    expect(validateBanner({ bannerText: "x", linkUrl: "javascript:alert(1)" }).error).toMatch(/link/);
    expect(validateBanner({ bannerText: "x", startDate: "2026-10-01T10:00" }).error).toMatch(/end date/);
    expect(validateBanner({ bannerText: "x", startDate: "2026-10-02T10:00", endDate: "2026-10-01T10:00" }).error).toMatch(/after/);
  });

  it("allows an inactive empty draft", () => {
    expect(validateBanner({ bannerText: "", isActive: false }).data?.isActive).toBe(false);
  });
});

describe("isValidBannerLink", () => {
  it("accepts site paths and http(s) URLs only", () => {
    expect(isValidBannerLink("/hours")).toBe(true);
    expect(isValidBannerLink("https://example.com/x")).toBe(true);
    expect(isValidBannerLink("//evil.com")).toBe(false);
    expect(isValidBannerLink("mailto:a@b.c")).toBe(false);
  });
});
