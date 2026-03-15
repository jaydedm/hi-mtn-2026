# Hi-Mountain 🏔️

A rustic burger restaurant website built with Next.js, featuring a public-facing site and an admin dashboard. Woo!

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Clerk
- **Time Handling:** date-fns + date-fns-tz (Mountain Time)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Clerk

1. Create a free account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your keys into `.env`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY
```

### 3. Set up the database

Start a local Prisma Postgres instance, run migrations, and seed default hours:

```bash
npx prisma dev
npx prisma db seed
```

Or if using an external PostgreSQL (Supabase, Vercel Postgres, etc.), update `DATABASE_URL` in `.env` and run:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home (Hero + About Us)
│   ├── hours/                # Public hours page (Mountain Time logic)
│   ├── admin/                # Protected admin dashboard
│   │   ├── hours/            # Edit operating hours
│   │   └── banner/           # Manage global banner
│   └── api/
│       ├── hours/route.ts    # PUT - update hours
│       └── banner/route.ts   # PUT - create/update banner
├── components/
│   ├── navbar.tsx            # Global nav (Home, Hours, Menu PDF)
│   ├── banner.tsx            # Conditional announcement banner
│   └── ui/                   # Shadcn UI components
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   └── utils.ts              # Shadcn utilities
└── middleware.ts              # Clerk auth (protects /admin)
```

## Features

### Public

- **Home:** Hero section + About Us content in styled sections
- **Hours:** Weekly schedule table, current day highlighted, live "Open/Closed" indicator based on Mountain Time
- **Menu:** Opens a PDF in a new tab (placeholder at `public/menu.pdf`)
- **Banner:** Conditionally rendered site-wide announcement with start/end dates

### Admin (`/admin`)

- Protected by Clerk authentication
- Edit open/close times for each day of the week
- Manage the global banner (text, active toggle, date range)

## Design Theme

"National Forest Sign" — deep forest greens, wood browns, cream backgrounds, mustard-yellow accents. Playfair Display for headings, Inter for body text.

## TODO

- [ ] Replace `public/menu.pdf` with the real menu
- [ ] Add images to the Home page (hero background, about sections)
- [ ] Deploy to Vercel and connect a production PostgreSQL database
- [ ] Configure Clerk production keys
- [ ] Add mobile-responsive hamburger menu to navbar
