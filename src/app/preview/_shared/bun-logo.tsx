/**
 * Line-art burger bun mark, redrawn from the printed menu logo, with the
 * wordmark set between the buns. Inherits `currentColor`.
 */
export function BunLogo({
  className = "",
  wordmark = "HI-MOUNTAIN",
  sub = "BURGERS · SHAKES · FRIES",
  strokeWidth = 5,
}: {
  className?: string;
  wordmark?: string;
  sub?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      role="img"
      aria-label={`${wordmark} — ${sub}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* top bun */}
      <path d="M40 120 C 40 40, 360 40, 360 120" />
      <path d="M30 120 H 370" />
      {/* patty squiggle */}
      <path d="M40 176 c 12 -10 24 10 36 0 s 24 10 36 0 s 24 10 36 0 s 24 10 36 0 s 24 10 36 0 s 24 10 36 0 s 24 10 36 0 s 24 10 36 0 s 18 8 36 0" />
      {/* bottom bun */}
      <path d="M50 195 H 350 C 366 195, 366 240, 350 240 H 50 C 34 240, 34 195, 50 195 Z" />
      {/* wordmark */}
      <text
        x="200"
        y="150"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="var(--font-display, Impact, 'Arial Narrow', sans-serif)"
        fontWeight={900}
        fontSize="42"
        letterSpacing="-1"
        textLength="290"
        lengthAdjust="spacingAndGlyphs"
      >
        {wordmark}
      </text>
      <text
        x="200"
        y="170"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="var(--font-slab, Georgia, serif)"
        fontSize="13"
        letterSpacing="3"
      >
        {sub}
      </text>
    </svg>
  );
}

/** Just the bun outline, for dividers and stickers. */
export function BunMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 64" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round">
      <path d="M8 30 C 8 4, 92 4, 92 30" />
      <path d="M6 30 H 94" />
      <path d="M10 42 c 5 -4 10 4 15 0 s 10 4 15 0 s 10 4 15 0 s 10 4 15 0 s 10 4 15 0" />
      <path d="M12 50 H 88 C 94 50, 94 60, 88 60 H 12 C 6 60, 6 50, 12 50 Z" />
    </svg>
  );
}
