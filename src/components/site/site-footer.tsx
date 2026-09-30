import { ADDRESS, DIRECTIONS_URL, PHONE, PHONE_HREF } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ds-ink text-ds-paper/70 text-center text-sm py-10 px-5">
      <span className="font-logo text-2xl text-ds-paper block mb-3">Thank you for being a part of our history.</span>
      <p className="font-label space-x-2">
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-ds-highlight hover:text-ds-highlight">
          {ADDRESS}
        </a>
        <span aria-hidden="true">·</span>
        <a href={PHONE_HREF} className="underline underline-offset-4 decoration-ds-highlight hover:text-ds-highlight">
          {PHONE}
        </a>
      </p>
      <p className="mt-3">© {new Date().getFullYear()} Hi-Mountain · Kamas, Utah</p>
    </footer>
  );
}
