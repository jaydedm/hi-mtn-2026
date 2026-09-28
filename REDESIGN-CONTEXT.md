# Hi-Mountain Redesign — Session Context

Handoff doc for continuing the himtnburgers.com redesign in a fresh session.
Read this first, then `src/app/preview/drug-store/page.tsx`.

## Where things stand (2026-09-28)

- **Production codebase:** this repo (`~/Code/hi-mtn-kiro`, GitHub `jaydedm/hi-mtn-2026`),
  deployed on Vercel at himtnburgers.com. `~/Code/himtn` (old static Bootstrap site +
  abandoned experiments) and `~/Code/hi-mountain-next` (abandoned T3 rewrite) are dead.
- **Branch:** `jaydedm/redesign-prototypes`, 2 commits ahead of `main`, **not pushed**.
  - `d708cac` — built three clickable prototypes (A/B/C) under `/preview/*`
  - `d3f2d65` — kept only A, deleted B/C and the direction switcher
- **Decision made:** Direction A, **"The Drug Store"** (soda-fountain revival). Jayde
  liked it; B (Main Street / New Western) and C (Loud & Proud / neo-brutalist) are gone.
- **Live site is untouched.** `/preview` is `robots: noindex` and unlinked. The root
  layout wraps the existing Banner/Navbar/footer in `<SiteChrome>` which hides them only
  under `/preview`. Everything else renders exactly as before.

## What the prototype is

Route: `/preview/drug-store` (`/preview` redirects there). One long page:

1. Sticky header — bun mark + script wordmark, live open badge (desktop), nav, phone pill
   (collapses to "Call" on mobile). Red/cream striped awning with scalloped edge below.
2. Hero — "KAMAS, UTAH · EST. 1918" eyebrow, huge Yellowtail "Hi-Mountain", slab
   "BURGERS · SHAKES · FRIES", blurb, See-the-menu / Directions CTAs, oval-framed
   archive-photo cluster (Rexall awning, fountain crew, Pete's Drugs) + 16× Best of State
   mustard badge. Blue awning below.
3. Dark strip — neon-flicker "Open · Closes 4pm" script, grouped hours (Mon–Fri / Sat–Sun),
   address link.
4. Menu — tabbed HTML menu (8 sections) transcribed from the printed PDF. Dotted price
   leaders, slab names, red prices, italic Lora descriptions.
5. Memory Lane — 1918 / 1950s / Today timeline with oval photos.
6. Visit — blue block, address/phone, hours card.
7. Footer — script "Thank you for being a part of our history."
8. Mobile only — sticky bottom bar: Directions / Call / Menu.

Verified: 200s, zero horizontal overflow at 1440 and 390 px, tsc clean, eslint 0 errors
(only `<img>` warnings, same as current homepage), 24/24 vitest pass.

## File map (`src/app/preview/`)

| File | Purpose |
|---|---|
| `layout.tsx` | Loads Yellowtail (`--font-script`), Alfa Slab One (`--font-slab`), Lora (`--font-body`); noindex |
| `preview.css` | `--a-*` palette + `pv-awning`, `pv-awning-blue`, `pv-scallop`, `pv-oval-frame`, `pv-neon`, `pv-reveal` |
| `page.tsx` | redirect → `/preview/drug-store` |
| `drug-store/page.tsx` | the whole page (server component); `menuStyles` object styles the shared TabbedMenu |
| `_shared/menu-data.ts` | `MENU` (sections/items/prices), `ADDRESS`, `DIRECTIONS_URL`, `PHONE`, `PHONE_HREF` |
| `_shared/hours.ts` | **server-only** `getPreviewHours()` — reads `operatingHours` table, falls back to summer schedule (Mon–Fri 11–4, closed Sat/Sun) |
| `_shared/hours-format.ts` | pure `fmtTime`, `groupHours`, `DAY_SHORT` — safe for client imports |
| `_shared/use-open-state.ts` | client hook: open/closed + "Closes 4pm" / "Opens tomorrow 11am" in America/Denver, 30 s tick |
| `_shared/open-badge.tsx` | `<OpenBadge hours className dotClass openText closedText>` — note it hardcodes `inline-flex`; to hide it responsively wrap it in a `<div className="hidden md:block">` |
| `_shared/tabbed-menu.tsx` | `<TabbedMenu styles={MenuStyles}>` accessible tabs + panel |
| `_shared/mobile-action-bar.tsx` | sticky bottom Directions/Call/Menu bar |
| `_shared/bun-logo.tsx` | `BunMark` — line-art bun outline SVG redrawn from the menu logo |
| `../../components/site-chrome.tsx` | hides old chrome under `/preview` |

Palette (`preview.css`): cream `#fbf3e2`, cream-2 `#f3e6c9`, red `#c8322b`, blue `#1f4e8c`,
mustard `#f2b632`, ink `#2a1a12`.

## Real-world facts verified

- Phone **(435) 783-4466**, address 40 N Main St, Kamas, UT 84036.
- Printed menu logo = line-art bun with distressed condensed "HI-MOUNTAIN" and
  "BURGERS · SHAKES · FRIES" between the buns. The real logo art is **not** in the repo —
  only the PDF at `public/menus/1773604081227-final-01.pdf` (6 image-only pages,
  rendered to `/tmp/himtn/m1-6.png` during the session — will be gone after restart).
- Archive photos in `public/images/hero-1..6.png`: 1 = photos on counter, 2 = 1950s
  fountain crew w/ Coca-Cola clock, 3 = waitresses under Rexall sign + striped awning,
  4 = Pete's Drugs storefront w/ classic cars, 5 = vintage soda bottles,
  6 = "Hi-Mountain Drug / Good Luck Cats" sign. `best-of-state.png` = gold medal.
- Current banner in prod: summer hours, grill till 4pm, carry-out shakes/ice cream till
  8pm, closed Sat/Sun. Family-owned since 1968; built 1918.
- No food photography exists anywhere in the repo. Biggest content gap.

## Local dev gotchas

- **Use Node 22**: `export PATH=$HOME/.nvm/versions/node/v22.17.0/bin:$PATH`
  (default node 20 lacks `node:sqlite`, which `prisma dev` needs).
- Local Postgres: `npx prisma dev -d` (background). Runs on :51214. Migrations applied;
  **not seeded** — `npx tsx prisma/seed.ts` and `psql` both hung the shell during the
  session, so hours fall back to the hardcoded schedule. Don't block on this.
- Dev server used port **3111** (`npx next dev -p 3111`). Phone testing on LAN:
  `http://192.168.1.149:3111/preview/drug-store`.
- `next build` fails locally with "supabaseUrl is required" — **pre-existing on main**
  (Vercel has the env; `.env` doesn't). Not caused by this branch.
- chrome-devtools MCP was locked by another session; screenshots were done with
  puppeteer-core at `/tmp/himtn/shoot.js` (gone after restart). Recipe:
  `npm i puppeteer-core` in a scratch dir, launch with
  `executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`,
  `page.setCacheEnabled(false)`, viewports 1440×900 and 390×844.
- Don't export non-component constants from `"use client"` files — RSC boundary breaks
  (`DIRECTIONS.map is not a function`). Put shared constants in plain `.ts` modules.
- Don't import anything that imports `@/lib/prisma` from a client component
  (`Module not found: Can't resolve 'net'`). That's why `hours-format.ts` exists.

## Research takeaways that drove the design

- Closest real-world analog: **La Revoltosa** (larevoltosa.es, Awwwards SOTD 2026) —
  1953 soda brand revived via recovered logo, first-person copy, scroll chapters.
- Consensus best practices: hours/directions/menu one tap from the fold; HTML menu not
  PDF (SEO, a11y, mobile); live open/closed; `schema.org/Restaurant` JSON-LD with
  `openingHoursSpecification`; one good food photo shoot beats any redesign.
- Risk for this direction: kitsch. Mitigate with restraint and real food photos next to
  the archive photos.

## Suggested next steps (in rough order)

1. **Review on phone + desktop**, note what to change (copy, spacing, photo choices).
2. **Photography plan** — the design has slots for food but zero food images. Even
   phone shots of a Gonburger, a shake, fries, and the counter would transform it.
3. **Logo** — get the real vector/PNG bun logo from whoever made the menu, or trace
   it. `BunMark` is a stand-in.
4. **Menu data → database + admin.** Add `MenuSection`/`MenuItem` Prisma models, seed
   from `menu-data.ts`, build an admin CRUD page (existing admin uses Clerk at
   `/admin/*`, shadcn UI). Keep the PDF upload as a "printable menu" download.
5. **JSON-LD** — `Restaurant` schema with menu + `openingHoursSpecification` generated
   from the hours table.
6. **Promote to the real routes.** Move drug-store page → `/`, menu section → `/menu`,
   reuse the existing `/hours` data. Port `Banner` (emergency/casual) into the new
   design. Delete `SiteChrome`, old `Navbar`, old `page.tsx`, old palette tokens
   (`forest`, `mustard`, etc.) in `globals.css`.
7. **Polish** — `next/image` for photos, hero LCP, reduced-motion already handled,
   contrast check on mustard-on-cream text, `<h1>` per page, page `<title>`s.
8. Open MR, deploy to Vercel preview, then merge. Pre-push hook runs `npm test`.

## Open questions for Jayde

- Is there an actual logo file? Any brand colors the owners already use on signage/merch?
- Walk-in only, or should there be an "Order" CTA (Toast/Square/phone)?
- Tourist vs. local mix — affects how hard to lean on "gateway to the Uintas" copy
  (that positioning came from direction B and was dropped; worth keeping a line of it?).
- Winter hours — does the schedule change seasonally? (Affects hours UI + banner.)
