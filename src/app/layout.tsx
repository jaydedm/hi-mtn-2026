import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Banner } from "@/components/banner";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700", "900"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Hi-Mountain | Juicy Burgers & Homestyle Fries",
  description:
    "Juicy Burgers. Homestyle Fries. Thick Milkshakes. A walk down memory lane since 1918.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${serif.variable} ${sans.variable}`}>
        <body className="min-h-screen flex flex-col">
          <Banner />
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-forest-dark text-cream py-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Hi-Mountain. All rights reserved.</p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
