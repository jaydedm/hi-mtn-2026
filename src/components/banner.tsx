"use client";

import { useEffect, useState, useCallback } from "react";

type BannerStatus = { bannerText: string; bannerType: string } | null;

export function Banner() {
  const [banner, setBanner] = useState<BannerStatus>(null);

  const check = useCallback(() => {
    fetch("/api/banner-status")
      .then((r) => r.json())
      .then((d) => setBanner(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, 5_000);
    const onFocus = () => check();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [check]);

  if (!banner) return null;

  const isEmergency = banner.bannerType === "emergency";

  return (
    <div
      className={
        isEmergency
          ? "bg-red-700 text-white text-center py-3 px-4 font-bold text-base tracking-wide animate-pulse"
          : "banner-casual bg-mustard text-forest-dark text-center py-2 px-4 font-semibold text-sm"
      }
    >
      {isEmergency && "⚠️ "}
      {banner.bannerText}
    </div>
  );
}
