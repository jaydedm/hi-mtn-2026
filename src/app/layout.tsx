import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Playfair_Display, Inter, Plus_Jakarta_Sans } from "next/font/google";

export const dynamic = "force-dynamic";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Banner } from "@/components/banner";
import { getActiveMenuUrl } from "@/lib/menu";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700", "900"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const brand = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Hi-Mountain | Best Burgers in Utah | 16× Best of State Winner",
  description:
    "Hi-Mountain serves the best burgers in Utah with homestyle fries and thick milkshakes. A 16-time Best of State award winner since 1918.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuUrl = await getActiveMenuUrl();

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${serif.variable} ${sans.variable} ${brand.variable}`}>
        <head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-GE5E2TPZ76" />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-GE5E2TPZ76');`,
            }}
          />
        </head>
        <body className="min-h-screen flex flex-col">
          <Banner />
          <Navbar menuUrl={menuUrl} />
          <main className="flex-1">{children}</main>
          <footer className="bg-forest-dark text-cream py-8 text-center text-sm">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=40+N+Main+St,+Kamas,+UT+84036"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mustard hover:text-mustard-light underline underline-offset-2"
            >
              40 N Main St, Kamas, UT 84036
            </a>
            <span className="mx-2">·</span>
            <a
              href="mailto:<email>"
              className="text-mustard hover:text-mustard-light underline underline-offset-2"
            >
              Contact Us
            </a>
            <p className="mt-2">© {new Date().getFullYear()} Hi-Mountain. All rights reserved.</p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
