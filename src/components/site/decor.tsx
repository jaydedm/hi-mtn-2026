import Image from "next/image";
import burgerIcon from "../../../public/images/burger-icon.png";

/**
 * Hi-Mountain burger mark (red line-art burger). Decorative: pair it with visible
 * text such as the wordmark or a heading. Size it with a height class; width follows.
 */
export function BurgerMark({ className = "", preload = false }: { className?: string; preload?: boolean }) {
  return <Image src={burgerIcon} alt="" aria-hidden="true" preload={preload} sizes="96px" className={`w-auto ${className}`} />;
}

/** Red/cream striped awning with a scalloped edge. Decorative. */
export function Awning({ blue = false }: { blue?: boolean }) {
  return <div className={`${blue ? "ds-awning-blue" : "ds-awning"} ds-scallop h-10 w-full`} aria-hidden="true" />;
}
