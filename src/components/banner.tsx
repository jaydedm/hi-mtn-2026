"use client";

import { useCallback, useEffect, useId, useState } from "react";

export type BannerContent = {
  label?: string | null;
  bannerText: string;
  details?: string | null;
  linkUrl?: string | null;
  linkText?: string | null;
  bannerType: string;
};

type BannerStatus = (BannerContent & { key: string }) | null;

const DISMISS_KEY = "hm-banner-dismissed";

const chevron = (up: boolean) => (
  <svg
    viewBox="0 0 24 24"
    className={`size-3.5 transition-transform duration-300 motion-reduce:transition-none ${up ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/**
 * Headline banner:  [ LABEL ]  One-line headline   ✕
 *                        Details ⌄        (or  Link →  inline)
 * One toggle: tapping Details slides the text open *above* it, so the same button travels down
 * and flips to "Show less ⌃" under the text. Also used as the admin preview.
 */
export function BannerBar({ content, onDismiss }: { content: BannerContent; onDismiss?: () => void }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const urgent = content.bannerType === "emergency";
  // Urgent uses the theme alert color (always a clear red).
  const tone = urgent ? "bg-ds-alert text-ds-on-alert" : "bg-ds-ink text-ds-paper";
  const chip = urgent ? "bg-ds-on-alert text-ds-alert" : "bg-ds-highlight text-ds-on-highlight";
  const action =
    "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 font-label text-[13px] tracking-wide text-current/85 outline-none transition-colors hover:text-current focus-visible:ring-2 focus-visible:ring-current/60";
  const external = content.linkUrl ? /^https?:/.test(content.linkUrl) : false;

  return (
    <div role={urgent ? "alert" : "status"} className={`motion-safe:animate-[ds-banner-in_.4s_ease-out] ${tone}`}>
      <div className="relative mx-auto max-w-6xl px-10 py-2.5 text-center md:px-12">
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="sr-only">{urgent ? "Important notice: " : "Announcement: "}</span>
          {content.label && (
            <span className="relative inline-flex">
              {/* Urgent: a single soft ring radiates out from the label once it appears. */}
              {urgent && <span aria-hidden="true" className="absolute inset-0 rounded-full bg-white/70 opacity-0 motion-safe:animate-[ds-ping-once_0.9s_cubic-bezier(0,0,0.2,1)_0.45s_1_both]" />}
              <span className={`relative rounded-full px-2.5 py-0.5 font-label text-[11px] uppercase tracking-[0.18em] ${chip}`}>{content.label}</span>
            </span>
          )}
          <span className="font-body text-[15px] font-semibold leading-snug">{content.bannerText}</span>
          {!content.details && content.linkUrl && (
            <a href={content.linkUrl} className={action} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {content.linkText || "Learn more"}
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          )}
        </p>

        {content.details && (
          <>
            {/* grid-rows 0fr → 1fr animates to the text's natural height without measuring it. */}
            <div
              id={panelId}
              inert={!open}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`mx-auto max-w-xl whitespace-pre-line pt-2 font-body text-sm leading-relaxed opacity-95 transition-transform duration-300 ease-out motion-reduce:transition-none ${
                    open ? "translate-y-0" : "-translate-y-2"
                  }`}
                >
                  {content.details}
                </p>
              </div>
            </div>
            <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)} className={`${action} mt-1`}>
              {open ? "Show less" : "Details"}
              {chevron(open)}
            </button>
          </>
        )}

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss announcement"
            className="absolute top-2 right-2 grid size-8 place-items-center rounded-full opacity-70 transition hover:bg-white/10 hover:opacity-100 md:right-3"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Site-wide announcement managed at /admin/banner. Polls every 5s and on tab focus.
 * Closing it hides that exact message (remembered in localStorage); editing or posting a new
 * banner changes its key, so it shows again.
 */
export function Banner() {
  const [banner, setBanner] = useState<BannerStatus>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);

  const check = useCallback(() => {
    fetch("/api/banner-status")
      .then((r) => r.json())
      .then((d) => setBanner(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read once after hydration
      setDismissed(localStorage.getItem(DISMISS_KEY));
    } catch {}
    check();
    const id = setInterval(check, 5_000);
    const onFocus = () => check();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [check]);

  if (!banner || banner.key === dismissed) return null;

  return (
    <BannerBar
      key={banner.key}
      content={banner}
      onDismiss={() => {
        setDismissed(banner.key);
        try {
          localStorage.setItem(DISMISS_KEY, banner.key);
        } catch {}
      }}
    />
  );
}
