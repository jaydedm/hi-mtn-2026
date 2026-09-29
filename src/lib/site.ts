/** Static business facts shared by the public site, metadata, and JSON-LD. */

export const SITE_NAME = "Hi-Mountain";
// www is the primary domain on Vercel (the bare domain redirects to it), so canonical
// URLs, the sitemap and JSON-LD must use www too.
export const SITE_URL = "https://www.himtnburgers.com";
export const MOUNTAIN_TZ = "America/Denver";

export const STREET = "40 N Main St";
export const CITY = "Kamas";
export const REGION = "UT";
export const POSTAL_CODE = "84036";
export const ADDRESS = `${STREET}, ${CITY}, ${REGION} ${POSTAL_CODE}`;
export const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=40+N+Main+St,+Kamas,+UT+84036";

export const PHONE = "(435) 783-4466";
export const PHONE_E164 = "+14357834466";
export const PHONE_HREF = `tel:${PHONE_E164}`;

export const FOUNDED_YEAR = 1918;
export const BEST_OF_STATE_COUNT = 16;
