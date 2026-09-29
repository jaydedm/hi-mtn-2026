# Hi-Mountain 🏔️

A production web application for Hi-Mountain, a rustic burger restaurant in Kamas, Utah. Features a public-facing site with SEO-optimized content and a protected admin dashboard for managing hours, banners, and menus.

**Live:** [himtnburgers.com](https://himtnburgers.com)

## Tech Stack

- **Framework:** Next.js 16 (App Router), React, TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** PostgreSQL via Supabase (transaction mode pooler)
- **Auth:** Clerk
- **Time Handling:** date-fns + date-fns-tz (Mountain Time)
- **Hosting:** Vercel

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home (Hero + About Us)
│   ├── hours/                      # Public hours page (Mountain Time logic)
│   ├── admin/                      # Protected admin dashboard
│   │   ├── hours/                  # Edit operating hours
│   │   ├── banner/                 # Manage global banner
│   │   └── menu/                   # Edit the online menu (sections, items, prices, flavors)
│   └── api/
│       ├── hours/route.ts          # PUT - update hours
│       ├── banner/route.ts         # PUT - create/update banner
│       ├── banner-status/route.ts  # GET - live banner status (polled)
│       ├── menu-sections/          # CRUD - menu sections
│       ├── menu-items/             # CRUD - menu items, extra prices, choice lists
│       └── menu-reorder/route.ts   # PUT - reorder sections/items
├── components/
│   ├── banner.tsx                  # Client-side banner (polls every 5s)
│   └── ui/                         # Shadcn UI components
├── lib/
│   ├── prisma.ts                   # Prisma client singleton (pg adapter)
│   ├── menu-model.ts               # Menu types, formatting, validation
│   ├── menu-data.ts                # Menu queries (server-only)
│   └── utils.ts                    # Shadcn utilities
└── proxy.ts                        # Clerk auth (protects /admin)
```

## Features

### Public Site
- **Home:** Hero section with photo grid background, Best of State award medals (2009–2024), SEO-targeted copy ("Best Burgers in Utah")
- **Hours:** Weekly schedule fetched from DB, current day highlighted with gold pill badge, live "Open/Closed" indicator evaluated strictly in Mountain Time (refreshes every 30s)
- **Menu:** Web-native Lunch and After Hours menus at `/menu`, with flavor search and schema.org Menu data
- **Banner:** Two styles — casual (gold with shimmer animation) and emergency (red pulsing alert). Polls every 5 seconds + checks on tab focus for near-instant updates
- **Footer:** Clickable address (opens Google Maps directions), contact email link

### Admin Dashboard (`/admin`)
- Protected by Clerk authentication
- **Operating Hours:** Toggle open/closed per day, set open/close times (Mountain Time)
- **Global Banner:** Casual/emergency type toggle, active/inactive switch, optional date scheduling (start/end), preview required before saving, validation (start date requires end date)
- **Menu:** Edit sections, items, prices, add-ons and flavor/topping lists; choose which items show on Lunch, After Hours or both

## Design Theme

"National Forest Sign" — rich browns, warm cream/peach gradients, mustard-gold accents. Plus Jakarta Sans for brand text and headings, Playfair Display for serif accents, Inter for body text.

## Environment Variables

### Required for production (set in Vercel dashboard)

```
# Database (Supabase - use transaction mode pooler, port 6543)
DIRECT_DATABASE_URL=postgres://postgres.[ref]:[password]@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Database (for migrations only - use session mode, port 5432)
DATABASE_URL=postgres://postgres.[ref]:[password]@aws-1-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start local database

In a separate terminal:

```bash
npx prisma dev
```

### 3. Run migrations and seed

```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Set up Clerk

Add your Clerk keys to `.env` (get them from [dashboard.clerk.com](https://dashboard.clerk.com)).

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying

### Initial setup

1. Connect the GitHub repo to Vercel
2. Add all environment variables (see above)
3. Run migrations against production:
   ```bash
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   ```
4. Seed production database:
   ```bash
   NODE_TLS_REJECT_UNAUTHORIZED=0 DIRECT_DATABASE_URL="your-production-url" npx prisma db seed
   ```

### Ongoing deploys

Push to `main` — Vercel auto-deploys.

### Database migrations

After changing `prisma/schema.prisma`:

```bash
# Create migration locally
npx prisma migrate dev --name description-of-change

# Deploy to production
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

## TODO

- [ ] Add Google Analytics
- [ ] Add images to hero via admin (replace static hero images)
- [ ] Mobile hamburger menu for navbar
- [ ] Contact form
- [ ] Clerk production keys (switch from test to live)
