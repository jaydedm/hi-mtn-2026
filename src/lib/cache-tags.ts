import { revalidateTag } from "next/cache";

/** Cache tags for public-site data. Admin API routes expire them on every save. */
export const TAGS = { menu: "menu", hours: "hours" } as const;

/**
 * Admin saves expire the cache immediately; this is only the fallback for changes made outside
 * the admin (scripts, direct DB edits), so they still show up within a few minutes.
 */
export const CACHE_SECONDS = 300;

/**
 * Bump when the shape of cached data changes (e.g. new fields), so old cache entries that
 * predate the change are never served.
 */
export const CACHE_VERSION = "2";

/** Expire a tag immediately, so the very next page view reads fresh data. Server-only. */
export const expire = (tag: (typeof TAGS)[keyof typeof TAGS]) => revalidateTag(tag, { expire: 0 });
