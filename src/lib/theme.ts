/**
 * Public-site theme: the one place to change the site's colors, edges and fonts.
 *
 * How it fits together:
 *  - Each palette/night set below becomes CSS variables (--ds-paper, --ds-primary, …)
 *    via `themeCss()`, injected in the root layout.
 *  - Tailwind utilities read those variables: bg-ds-primary, text-ds-ink, ring-ds-night-ink/40, …
 *    (mapped in globals.css), so components never hard-code a color.
 *  - `ACTIVE_THEME` picks what the live site uses. To try others without deploying,
 *    open any page with `?themelab` to get a picker (it remembers your choice per browser).
 *
 * To add a palette: copy an entry in PALETTES, change the hex values, and it shows up in the
 * theme lab automatically.
 */

export type Palette = {
  label: string;
  /** Page background */
  paper: string;
  /** Alternate section background */
  paper2: string;
  /** Cards and panels on top of paper */
  card: string;
  /** Body text and dark UI */
  ink: string;
  /** Lead brand color: script titles, main buttons, active chips */
  primary: string;
  onPrimary: string;
  /** Supporting color: links, small caps labels, hero edge */
  secondary: string;
  onSecondary: string;
  /** Small highlight fills: "Today", "Now serving", add-on tags */
  highlight: string;
  onHighlight: string;
  /** Urgent banner. Keep this a clear red in every palette. */
  alert: string;
  onAlert: string;
};

/** After Hours ("night") colors, used on the After Hours card, tab and menu accents. */
export type Night = {
  label: string;
  /** Dark background */
  night: string;
  /** After Hours accent on light backgrounds (rings, titles, active chips) */
  nightInk: string;
  /** Bright glow color on the dark background */
  glow: string;
  /** Soft text color on the dark background */
  glowSoft: string;
};

export const PALETTES = {
  trailhead: {
    label: "Trailhead (root beer + pine)",
    paper: "#f3ebdb",
    paper2: "#e7dcc4",
    card: "#fffaf1",
    ink: "#241811",
    primary: "#6b2f1d",
    onPrimary: "#f7eedd",
    secondary: "#2f4a38",
    onSecondary: "#f3ebdb",
    highlight: "#d9a03a",
    onHighlight: "#241811",
    alert: "#b3261e",
    onAlert: "#ffffff",
  },
  pine: {
    label: "Pine lead (pine + root beer)",
    paper: "#f1ecdf",
    paper2: "#e2dcc8",
    card: "#fffbf3",
    ink: "#1f2119",
    primary: "#2f4a38",
    onPrimary: "#f1ecdf",
    secondary: "#6b2f1d",
    onSecondary: "#f7eedd",
    highlight: "#d9a03a",
    onHighlight: "#1f2119",
    alert: "#b3261e",
    onAlert: "#ffffff",
  },
  campfire: {
    label: "Campfire (rust + slate)",
    paper: "#f2e9da",
    paper2: "#e5d7bf",
    card: "#fffaf2",
    ink: "#2a1d15",
    primary: "#8a3b1f",
    onPrimary: "#f8ecd9",
    secondary: "#3d4f58",
    onSecondary: "#f2e9da",
    highlight: "#e0a54a",
    onHighlight: "#2a1d15",
    alert: "#b3261e",
    onAlert: "#ffffff",
  },
  drugstore: {
    label: "Drug Store (original red + blue)",
    paper: "#fbf3e2",
    paper2: "#f3e6c9",
    card: "#ffffff",
    ink: "#2a1a12",
    primary: "#c8322b",
    onPrimary: "#fbf3e2",
    secondary: "#1f4e8c",
    onSecondary: "#fbf3e2",
    highlight: "#f2b632",
    onHighlight: "#2a1a12",
    alert: "#c8322b",
    onAlert: "#ffffff",
  },
} satisfies Record<string, Palette>;

export const NIGHTS = {
  lantern: {
    label: "Lantern (night pine + amber)",
    night: "#131c16",
    nightInk: "#3b5a44",
    glow: "#f0b04e",
    glowSoft: "#f6dfb4",
  },
  starlight: {
    label: "Starlight (night sky + pale blue)",
    night: "#0f1a2b",
    nightInk: "#2c4a6e",
    glow: "#bcd7ff",
    glowSoft: "#dbe7f7",
  },
  ember: {
    label: "Ember (dark root beer + orange)",
    night: "#1d120c",
    nightInk: "#6b2f1d",
    glow: "#ff9a4d",
    glowSoft: "#f5d6bd",
  },
  neon: {
    label: "Neon (original navy + blue)",
    night: "#0b1628",
    nightInk: "#1f4e8c",
    glow: "#5cd0ff",
    glowSoft: "#dbeafe",
  },
} satisfies Record<string, Night>;

/** Decorative band under the header and at the bottom of the hero. */
export const EDGES = {
  gingham: "Gingham (the old uniforms)",
  ridge: "Mountain ridge",
  pines: "Pine treeline",
  wood: "Wood plank",
  awning: "Striped awning (original)",
} as const;

/**
 * Font families loaded in (site)/layout.tsx, exposed as --ff-<key>. Only fonts a page actually
 * uses are downloaded, so unused options cost nothing.
 */
export const FONT_FAMILIES = [
  "script",
  "slab",
  "lora",
  "outfit",
  "inter",
  "manrope",
  "grotesk",
  "fraunces",
  "oswald",
  "bitter",
  "bricolage",
  "young",
  "instrument",
] as const;
export type FontFamily = (typeof FONT_FAMILIES)[number];

/** A type set: which font plays each role, plus how "plain" the styling is. */
export type TypeSet = {
  label: string;
  /** "Hi-Mountain" wordmark (header + hero) */
  logo: FontFamily;
  /** Big section and page titles */
  title: FontFamily;
  /** Labels, buttons, item names, prices (the "font-label" utility) */
  ui: FontFamily;
  /** Paragraphs */
  body: FontFamily;
  logoWeight: number;
  titleWeight: number;
  labelWeight: number;
  /**
   * Non-script sets: size titles and the logo for a regular typeface (the script is set very
   * large and needs it). Classic keeps the original sizes.
   */
  plain: boolean;
  /** Turn off the decorative italics (for strictly minimal sets). */
  noItalics?: boolean;
  /** Uppercase section titles (park-sign style) */
  upperTitles?: boolean;
};

export const TYPE_SETS = {
  bricolage: {
    label: "Bricolage (playful modern sans + Lora)",
    logo: "bricolage",
    title: "bricolage",
    ui: "bricolage",
    body: "lora",
    logoWeight: 800,
    titleWeight: 700,
    labelWeight: 600,
    plain: true,
  },
  young: {
    label: "Young Serif (warm serif + Bricolage labels)",
    logo: "young",
    title: "young",
    ui: "bricolage",
    body: "lora",
    logoWeight: 400,
    titleWeight: 400,
    labelWeight: 600,
    plain: true,
  },
  instrument: {
    label: "Instrument (editorial serif + Inter)",
    logo: "instrument",
    title: "instrument",
    ui: "inter",
    body: "inter",
    logoWeight: 400,
    titleWeight: 400,
    labelWeight: 600,
    plain: true,
  },
  lodge: {
    label: "Lodge (Fraunces + slab + Lora)",
    logo: "fraunces",
    title: "fraunces",
    ui: "slab",
    body: "lora",
    logoWeight: 800,
    titleWeight: 700,
    labelWeight: 400,
    plain: true,
  },
  poster: {
    label: "Park poster (Oswald caps + slab + Lora)",
    logo: "oswald",
    title: "oswald",
    ui: "slab",
    body: "lora",
    logoWeight: 700,
    titleWeight: 600,
    labelWeight: 400,
    plain: true,
    upperTitles: true,
  },
  trail: {
    label: "Trail marker (Bitter + Lora)",
    logo: "bitter",
    title: "bitter",
    ui: "bitter",
    body: "lora",
    logoWeight: 800,
    titleWeight: 700,
    labelWeight: 700,
    plain: true,
  },
  modern: {
    label: "Modern (Outfit + Inter)",
    logo: "outfit",
    title: "outfit",
    ui: "outfit",
    body: "inter",
    logoWeight: 700,
    titleWeight: 600,
    labelWeight: 600,
    plain: true,
    noItalics: true,
  },
  clean: {
    label: "Clean (Manrope)",
    logo: "manrope",
    title: "manrope",
    ui: "manrope",
    body: "manrope",
    logoWeight: 800,
    titleWeight: 700,
    labelWeight: 700,
    plain: true,
    noItalics: true,
  },
  grotesk: {
    label: "Grotesk (Space Grotesk + Inter)",
    logo: "grotesk",
    title: "grotesk",
    ui: "grotesk",
    body: "inter",
    logoWeight: 700,
    titleWeight: 600,
    labelWeight: 600,
    plain: true,
    noItalics: true,
  },
  parksign: {
    label: "Park sign (slab + Lora)",
    logo: "slab",
    title: "slab",
    ui: "slab",
    body: "lora",
    logoWeight: 400,
    titleWeight: 400,
    labelWeight: 400,
    plain: true,
    upperTitles: true,
  },
  classic: {
    label: "Classic (script + slab, original)",
    logo: "script",
    title: "script",
    ui: "slab",
    body: "lora",
    logoWeight: 400,
    titleWeight: 400,
    labelWeight: 400,
    plain: false,
  },
} satisfies Record<string, TypeSet>;

export type ThemeChoice = {
  palette: keyof typeof PALETTES;
  night: keyof typeof NIGHTS;
  edge: keyof typeof EDGES;
  type: keyof typeof TYPE_SETS;
};

/** What the live site uses. */
export const ACTIVE_THEME: ThemeChoice = {
  palette: "trailhead",
  night: "starlight",
  edge: "gingham",
  type: "poster",
};

export const THEME_OPTIONS = {
  palette: PALETTES,
  night: NIGHTS,
  edge: EDGES,
  type: TYPE_SETS,
} as const;

export function isThemeValue<K extends keyof ThemeChoice>(
  key: K,
  v: unknown,
): v is ThemeChoice[K] {
  return typeof v === "string" && Object.hasOwn(THEME_OPTIONS[key], v);
}

const kebab = (s: string) =>
  s.replace(/[A-Z0-9]+/g, (m) => `-${m.toLowerCase()}`);

function vars(set: Record<string, string>): string {
  return Object.entries(set)
    .filter(([k]) => k !== "label")
    .map(([k, v]) => `--ds-${kebab(k)}:${v};`)
    .join("");
}

function typeCss(key: string, t: TypeSet): string {
  const scope = `:root[data-type="${key}"] .ds-site`;
  const out = [
    `${scope}{--ds-font-logo:var(--ff-${t.logo});--ds-font-title:var(--ff-${t.title});--ds-font-label:var(--ff-${t.ui});--ds-font-body:var(--ff-${t.body});--ds-logo-weight:${t.logoWeight};--ds-title-weight:${t.titleWeight};--ds-label-weight:${t.labelWeight};}`,
  ];
  if (t.noItalics) out.push(`${scope} .italic{font-style:normal}`);
  if (t.plain) {
    out.push(
      `${scope} .ds-title{font-size:clamp(2rem,5vw,3.25rem);line-height:1.1;letter-spacing:-0.02em${t.upperTitles ? ";text-transform:uppercase;letter-spacing:0.02em" : ""}}`,
      `${scope} .ds-logo{font-size:clamp(2.75rem,12vw,6rem);line-height:0.95;letter-spacing:-0.03em}`,
      `${scope} .ds-logo-sm{font-size:1.5rem;letter-spacing:-0.02em}`,
    );
  }
  return out.join("\n");
}

/**
 * CSS for every palette, night and type set. The active colors apply at :root; the others apply
 * when <html> carries data-palette / data-night. Type sets and edges always key off data-type /
 * data-edge on <html> (set from ACTIVE_THEME in the root layout; the theme lab changes them).
 */
export function themeCss(active: ThemeChoice = ACTIVE_THEME): string {
  const out = [
    `:root{${vars(PALETTES[active.palette])}${vars(NIGHTS[active.night])}}`,
  ];
  for (const [k, p] of Object.entries(PALETTES))
    out.push(`:root[data-palette="${k}"]{${vars(p)}}`);
  for (const [k, n] of Object.entries(NIGHTS))
    out.push(`:root[data-night="${k}"]{${vars(n)}}`);
  // Fonts resolve inside .ds-site, where the --ff-* variables from next/font are defined.
  for (const [k, t] of Object.entries(TYPE_SETS)) out.push(typeCss(k, t));
  return out.join("\n");
}
