"use client";

import { usePathname } from "next/navigation";

/**
 * Renders the current site's header/footer chrome everywhere except the
 * /preview redesign prototypes, which supply their own.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/preview")) return null;
  return <>{children}</>;
}
