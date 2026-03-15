"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/hours", label: "Hours" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-forest text-cream px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-serif text-2xl font-bold text-mustard tracking-wide">
        Hi-Mountain
      </Link>
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-mustard transition-colors ${
              pathname === link.href ? "text-mustard font-semibold" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
        <a
          href="/menu.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-mustard text-forest-dark px-4 py-2 rounded font-semibold hover:bg-mustard-light transition-colors"
        >
          Menu
        </a>
      </div>
    </nav>
  );
}
