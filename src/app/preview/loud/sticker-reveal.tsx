"use client";

import { useState } from "react";

/**
 * Sticker that flips to reveal an archive photo on hover, focus, or tap.
 */
export function StickerReveal({
  front,
  back,
  className = "",
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className={`group text-left [perspective:800px] ${className}`}
      onClick={() => setOn((v) => !v)}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      aria-pressed={on}
      aria-label="Reveal archive photo"
    >
      <span
        className="relative block transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: on ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <span className="block [backface-visibility:hidden]">{front}</span>
        <span className="absolute inset-0 block [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</span>
      </span>
    </button>
  );
}
