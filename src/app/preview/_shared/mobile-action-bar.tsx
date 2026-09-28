import { DIRECTIONS_URL, PHONE_HREF } from "./menu-data";

/**
 * Sticky bottom action bar on phones: the three things a visitor
 * actually wants — directions, call, menu.
 */
export function MobileActionBar({
  className,
  itemClass,
  primaryClass,
}: {
  className: string;
  itemClass: string;
  primaryClass: string;
}) {
  return (
    <nav
      aria-label="Quick actions"
      className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 md:hidden ${className}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className={itemClass}>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 21s-7-6.5-7-11a7 7 0 1 1 14 0c0 4.5-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        Directions
      </a>
      <a href={PHONE_HREF} className={itemClass}>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
        Call
      </a>
      <a href="#menu" className={`${itemClass} ${primaryClass}`}>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        Menu
      </a>
    </nav>
  );
}
