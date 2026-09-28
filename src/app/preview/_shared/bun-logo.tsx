/**
 * Line-art burger bun outline, redrawn from the printed menu logo.
 * Used as a small mark in the header and section dividers. Inherits `currentColor`.
 */
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
