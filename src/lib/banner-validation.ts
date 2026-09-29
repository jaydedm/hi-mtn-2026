/** Banner input shape shared by the admin form and PUT /api/banner. Pure; client-safe. */
export type BannerInput = {
  id?: string;
  label: string;
  bannerText: string;
  details: string;
  linkUrl: string;
  linkText: string;
  bannerType: "casual" | "emergency";
  isActive: boolean;
  startDate: string;
  endDate: string;
};

export const BANNER_LIMITS = { label: 24, headline: 80, details: 600, linkText: 24 } as const;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** A link is either a site path ("/hours") or an http(s) URL. */
export function isValidBannerLink(url: string) {
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

type BannerData = {
  label: string | null;
  bannerText: string;
  details: string | null;
  linkUrl: string | null;
  linkText: string | null;
  bannerType: "casual" | "emergency";
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

/** Trims/normalizes raw input and returns the DB-ready fields, or the first error message. */
export function validateBanner(raw: Record<string, unknown>): { data: BannerData; error?: undefined } | { error: string; data?: undefined } {
  const label = str(raw.label);
  const bannerText = str(raw.bannerText);
  const details = str(raw.details);
  const linkUrl = details ? "" : str(raw.linkUrl);
  const linkText = linkUrl ? str(raw.linkText) || "Learn more" : "";
  const bannerType = raw.bannerType === "emergency" ? "emergency" : "casual";
  const isActive = raw.isActive === true;
  const startDate = str(raw.startDate) ? new Date(str(raw.startDate)) : null;
  const endDate = str(raw.endDate) ? new Date(str(raw.endDate)) : null;

  const fail = (error: string) => ({ error });
  if (isActive && !bannerText) return fail("Add a headline before turning the banner on.");
  if (label.length > BANNER_LIMITS.label) return fail(`Keep the label to ${BANNER_LIMITS.label} characters.`);
  if (bannerText.length > BANNER_LIMITS.headline) return fail(`Keep the headline to ${BANNER_LIMITS.headline} characters.`);
  if (details.length > BANNER_LIMITS.details) return fail(`Keep the details to ${BANNER_LIMITS.details} characters.`);
  if (linkText.length > BANNER_LIMITS.linkText) return fail(`Keep the link text to ${BANNER_LIMITS.linkText} characters.`);
  if (linkUrl && !isValidBannerLink(linkUrl)) return fail("The link should be a page like /hours or a full https:// address.");
  if ((startDate && Number.isNaN(+startDate)) || (endDate && Number.isNaN(+endDate))) return fail("Check the start and end dates.");
  if (startDate && !endDate) return fail("Add an end date too, so the banner turns itself off.");
  if (startDate && endDate && endDate <= startDate) return fail("The end has to be after the start.");

  return {
    data: {
      label: label || null,
      bannerText,
      details: details || null,
      linkUrl: linkUrl || null,
      linkText: linkText || null,
      bannerType,
      isActive,
      startDate,
      endDate,
    },
  };
}
