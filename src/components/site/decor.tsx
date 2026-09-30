import burgerIcon from "../../../public/images/burger-icon.png";

/**
 * Hi-Mountain burger mark (line-art burger), tinted with the theme's primary color by using the
 * PNG as a mask. Decorative: pair it with visible text. Size it with a height class; width follows.
 */
export function BurgerMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block bg-ds-primary ${className}`}
      style={{
        aspectRatio: `${burgerIcon.width} / ${burgerIcon.height}`,
        mask: `url(${burgerIcon.src}) center / contain no-repeat`,
      }}
    />
  );
}

/** Themed decorative band (ridge, pines, wood or awning, per data-edge). `alt` uses the secondary color. */
export function Edge({ alt = false }: { alt?: boolean }) {
  return <div className={`ds-edge ${alt ? "ds-edge-alt" : ""} h-10 w-full`} aria-hidden="true" />;
}
