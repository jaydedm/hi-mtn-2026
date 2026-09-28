import type { Metadata } from "next";
import {
  Yellowtail,
  Alfa_Slab_One,
  Rye,
  Archivo_Black,
  Archivo,
  Lora,
  Bebas_Neue,
} from "next/font/google";
import { DirectionSwitcher } from "./_shared/direction-switcher";
import "./preview.css";

export const metadata: Metadata = {
  title: "Hi-Mountain — Redesign Prototypes",
  robots: { index: false, follow: false },
};

// Direction A — sign-painter script + slab
const script = Yellowtail({ subsets: ["latin"], weight: "400", variable: "--font-script" });
const slab = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--font-slab" });
// Direction B — wood type
const wood = Rye({ subsets: ["latin"], weight: "400", variable: "--font-wood" });
const body = Lora({ subsets: ["latin"], variable: "--font-body" });
// Direction C — heavy grotesk
const display = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const grotesk = Archivo({ subsets: ["latin"], variable: "--font-grotesk" });
const condensed = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-condensed" });

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`preview-root ${script.variable} ${slab.variable} ${wood.variable} ${body.variable} ${display.variable} ${grotesk.variable} ${condensed.variable}`}
    >
      {children}
      <DirectionSwitcher />
    </div>
  );
}
