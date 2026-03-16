/**
 * Determines whether a banner should be visible right now
 * based on its active flag and optional date window.
 */
export function isBannerVisible(
  banner: {
    isActive: boolean;
    startDate: Date | null;
    endDate: Date | null;
  } | null,
  now: Date = new Date()
): boolean {
  if (!banner || !banner.isActive) return false;
  if (banner.startDate && now < banner.startDate) return false;
  if (banner.endDate && now > banner.endDate) return false;
  return true;
}
