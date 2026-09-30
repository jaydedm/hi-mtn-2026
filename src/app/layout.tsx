import type { Metadata } from "next";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ACTIVE_THEME, themeCss } from "@/lib/theme";
import "./globals.css";

// Admin dashboard fonts. The public site loads its own in (site)/layout.tsx.
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const brand = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-brand", weight: ["700", "800"] });

const DESCRIPTION =
  "Hi-Mountain serves the best burgers in Utah with hand-cut fries and thick milkshakes. A 16-time Best of State winner in Kamas, Utah, since 1918.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hi-Mountain | Best Burgers in Utah | 16× Best of State Winner",
    template: `%s | ${SITE_NAME} · Kamas, Utah`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "Hi-Mountain | Best Burgers in Utah",
    description: DESCRIPTION,
    images: [{ url: "/images/hero-3.png", alt: "Waitresses under the striped awning and Rexall sign" }],
  },
};

const GA_ID = "G-GE5E2TPZ76";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${sans.variable} ${brand.variable}`}
        data-edge={ACTIVE_THEME.edge}
        data-type={ACTIVE_THEME.type}
      >
        <head>
          {/* Site theme colors (src/lib/theme.ts) as --ds-* variables */}
          <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </head>
        <body className="min-h-screen">{children}</body>
      </html>
    </ClerkProvider>
  );
}
