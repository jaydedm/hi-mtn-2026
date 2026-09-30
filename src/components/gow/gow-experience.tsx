"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import "./gow.css";

type Phase = "calm" | "unease" | "glitch" | "shatter" | "dark" | "eyes";

/** How long each phase lasts before the next one starts (ms). */
const TIMELINE: [Phase, number][] = [
  ["calm", 1400],
  ["unease", 1100],
  ["glitch", 1100],
  ["shatter", 1100],
  ["dark", 1500],
  ["eyes", 0],
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Random horizontal bands covering the screen: [top %, bottom %]. */
function bands(): [number, number][] {
  const out: [number, number][] = [];
  for (let top = 0; top < 100; ) {
    const bottom = Math.min(100, top + rand(2.5, 10));
    out.push([top, bottom]);
    top = bottom;
  }
  return out;
}

/**
 * The "gow" easter egg, set off by searching the shakes for "gow" on /menu. It runs a timeline
 * over the live page:
 * calm, then unease (micro jitters), then a glitch (colour split, slicing), then the page breaks
 * into glitching bands that blink out one by one, then darkness, then two glowing red eyes that
 * follow the pointer and blink.
 *
 * `startAt` skips the opening phases and `inPlace` keeps the reader's scroll position (the menu
 * trigger uses both).
 *
 * The break-up works by cloning the live page into full-screen layers, each clipped to one
 * horizontal band, with its own random jumps and cut-out time. With reduced motion, the page just
 * fades to black before the eyes appear, and nothing flashes.
 */
export function GowExperience({ startAt = "calm", inPlace = false }: { startAt?: Phase; inPlace?: boolean } = {}) {
  const [phase, setPhase] = useState<Phase>(startAt);
  const [mounted, setMounted] = useState(false);
  const tearRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);

  // Run the timeline once.
  useEffect(() => {
    // Portals need document.body, which only exists after mount.
    setMounted(true);
    if (!inPlace) window.scrollTo(0, 0);
    const root = document.documentElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timers: number[] = [];
    let at = 0;
    for (const [p, ms] of TIMELINE.slice(TIMELINE.findIndex(([p]) => p === startAt))) {
      timers.push(window.setTimeout(() => setPhase(p), at));
      at += ms;
    }
    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = prevOverflow;
      delete root.dataset.gow;
    };
    // Runs once; props are fixed for the life of the experience.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Phase classes on <html> drive the CSS (jitter, glitch, hiding the real page).
  useEffect(() => {
    document.documentElement.dataset.gow = phase;
  }, [phase]);

  // Shatter: clone the page into horizontal bands that jump around and blink out one by one.
  useEffect(() => {
    if (phase !== "shatter" || !tearRef.current) return;
    const site = document.querySelector<HTMLElement>(".ds-site");
    if (!site) return;
    const host = tearRef.current;
    for (const [top, bottom] of bands()) {
      const piece = document.createElement("div");
      piece.className = "gow-piece";
      piece.style.clipPath = `inset(${top}% 0 ${100 - bottom}% 0)`;
      piece.style.setProperty("--dx1", `${rand(-60, 60).toFixed(0)}px`);
      piece.style.setProperty("--dx2", `${rand(-140, 140).toFixed(0)}px`);
      piece.style.setProperty("--jitter", `${rand(0.12, 0.3).toFixed(2)}s`);
      piece.style.setProperty("--gone", `${rand(150, 950).toFixed(0)}ms`);
      const copy = site.cloneNode(true) as HTMLElement;
      // Line the copy up with what's on screen right now (the reader may be scrolled down).
      copy.style.transform = `translateY(${-window.scrollY}px)`;
      copy.setAttribute("aria-hidden", "true");
      copy.inert = true;
      piece.appendChild(copy);
      host.appendChild(piece);
    }
    return () => {
      host.replaceChildren();
    };
  }, [phase]);

  // Eyes follow the pointer a little.
  useEffect(() => {
    if (phase !== "eyes") return;
    const move = (e: PointerEvent) => {
      const el = eyesRef.current;
      if (!el) return;
      const dx = (e.clientX / window.innerWidth - 0.5) * 2;
      const dy = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.setProperty("--look-x", `${dx * 3}px`);
      el.style.setProperty("--look-y", `${dy * 2}px`);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [phase]);

  if (!mounted) return null;

  return createPortal(
    <div className="gow-stage" aria-live="polite">
      <div className="gow-scanlines" aria-hidden="true" />
      <div ref={tearRef} className="gow-tear" aria-hidden="true" />
      <div className="gow-dark" aria-hidden="true">
        <div className="gow-grain" />
        <div ref={eyesRef} className="gow-eyes">
          <span className="gow-eye" />
          <span className="gow-eye" />
        </div>
        <div className="gow-haze" />
      </div>
      {phase === "eyes" && (
        <>
          <p className="sr-only">In the darkness, two glowing red eyes are watching you.</p>
          <Link href="/" className="gow-escape">
            back to the light
          </Link>
        </>
      )}
    </div>,
    document.body,
  );
}
