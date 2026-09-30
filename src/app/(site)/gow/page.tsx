import type { Metadata } from "next";
import HomePage from "../page";
import { GowExperience } from "@/components/gow/gow-experience";

// Easter egg: looks like the home page, then it isn't. Kept out of search results.
export const metadata: Metadata = {
  title: "Hi-Mountain",
  robots: { index: false, follow: false },
};

export default function GowPage() {
  return (
    <>
      <HomePage />
      <GowExperience />
    </>
  );
}
