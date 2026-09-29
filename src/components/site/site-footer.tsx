import { ADDRESS, DIRECTIONS_URL, PHONE, PHONE_HREF } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ds-ink text-ds-cream/70 text-center text-sm py-10 px-5">
      <span className="font-script text-2xl text-ds-cream block mb-3">Thank you for being a part of our history.</span>
      <p className="font-slab space-x-2">
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-ds-mustard hover:text-ds-mustard">
          {ADDRESS}
        </a>
        <span aria-hidden="true">·</span>
        <a href={PHONE_HREF} className="underline underline-offset-4 decoration-ds-mustard hover:text-ds-mustard">
          {PHONE}
        </a>
      </p>
      <p className="mt-3">© {new Date().getFullYear()} Hi-Mountain · Kamas, Utah</p>
    </footer>
  );
}
