import type { Metadata } from "next";
import { Yellowtail, Alfa_Slab_One, Lora } from "next/font/google";
import "./preview.css";

export const metadata: Metadata = {
  title: "Hi-Mountain — Redesign Preview",
  robots: { index: false, follow: false },
};

// "The Drug Store" direction: sign-painter script + slab display + Lora body
const script = Yellowtail({ subsets: ["latin"], weight: "400", variable: "--font-script" });
const slab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--font-slab" });
const body = Lora({ subsets: ["latin"], variable: "--font-body" });

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`preview-root ${script.variable} ${slab.variable} ${body.variable}`}>
      {children}
    </div>
  );
}
