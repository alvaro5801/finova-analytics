## Dashboard on a 1920*1080 screenshot - 

<img width="1917" height="1080" alt="Screenshot 2026-07-25 at 7 40 40 PM" src="https://github.com/user-attachments/assets/2dc43dca-f494-49be-86e0-57e45af59870" />


# Material Dashboard (Next.js + Redux Toolkit)

A full-stack recreation of a Material-style admin dashboard, built with the
Next.js App Router, TypeScript, Redux Toolkit (RTK Query), Tailwind CSS,
Framer Motion, Recharts, and a Prisma/SQLite-backed API seeded with dummy
data.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| State management | Redux Toolkit + RTK Query |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion (layout/mount transitions) + Recharts (chart-mount animation) |
| Charts | Recharts (area, bar, radial gauge, sparklines) |
| Database | SQLite via Prisma ORM (libSQL driver adapter — same client works locally or against a hosted Turso database) |
| Icons | lucide-react |

## Setup instructions

There's no separate backend to stand up — the "backend" is a set of Next.js
API routes (`src/app/api/*/route.ts`) backed by Prisma/SQLite, deployed
together with the frontend as a single app. One setup covers both.

**Requirements:** Node.js 20+, npm.

```bash
npm install
npm run db:push   # creates prisma/dev.db from the schema
npm run db:seed   # seeds ~5-10 rows per table with dummy data
```

## Running locally

```bash
npm run dev       # http://localhost:3000
```

`npm run db:reset` re-creates the database from scratch and reseeds it in
one step, useful if the schema changes.

The app redirects `/` to `/dashboard`. Sign-in/sign-up are mocked (see
below) — any valid-looking email + a 6+ character password works.

## Hosted version

Deploy on **Vercel** — it's the only host needed, since the API routes
ship as part of the same Next.js app rather than a standalone backend
service. Import the repo in Vercel and it'll pick up `next build`
automatically; no separate backend deployment (Render/Heroku/etc.) applies
here.

The one thing to set up for a real deployment: local dev uses a
file-based SQLite database (`prisma/dev.db`), which doesn't persist on
Vercel's serverless filesystem. The Prisma client already goes through
the `@prisma/adapter-libsql` driver adapter (`src/lib/prisma.ts`,
`prisma.config.ts`), so switching to a hosted database is just env vars,
no code changes:

1. Create a free database at [turso.tech](https://turso.tech).
2. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in Vercel's project
   environment variables.
3. Push the schema and seed it once against that database:
   ```bash
   TURSO_DATABASE_URL="<url>" TURSO_AUTH_TOKEN="<token>" npm run db:push
   TURSO_DATABASE_URL="<url>" TURSO_AUTH_TOKEN="<token>" npm run db:seed
   ```

Without those env vars set, the adapter falls back to the local
`prisma/dev.db` file — so local dev and `npm run db:*` scripts work
unchanged.

## Project structure

```
prisma/
  schema.prisma        # StatCard, SalesPoint, ActiveUsersPoint/Stat,
                        # SatisfactionRate, ReferralPoint/Summary, Project,
                        # OrderEvent, Author, Invoice
  seed.ts               # populates every table with dummy data

src/
  app/
    (app)/              # sidebar + navbar shell (route group, no URL segment)
      layout.tsx
      dashboard/page.tsx
      tables/page.tsx
      billing/page.tsx
      rtl/page.tsx
      profile/page.tsx
    (auth)/             # centered gradient shell for auth pages
      sign-in/page.tsx
      sign-up/page.tsx
    api/                # REST route handlers (see below)
  components/
    layout/             # Sidebar, Navbar
    ui/                 # Card, Skeleton, Toggle, Reveal (mount animation)
    dashboard/          # one component + matching *Skeleton per widget
    tables/ billing/    # page-specific widgets
  store/
    api/dashboardApi.ts # RTK Query endpoints
    slices/uiSlice.ts   # sidebar open/closed, ltr/rtl direction
    slices/authSlice.ts # mocked signed-in user
    store.ts, provider.tsx, hooks.ts
  lib/
    prisma.ts           # Prisma client singleton
    api-utils.ts        # response helpers + simulated network latency
    icon-map.tsx         # DB icon-key -> lucide icon, rendered via renderIcon()
  types/dashboard.ts    # shared API/domain types
```

## API design

All routes live under `src/app/api/*/route.ts` and return a consistent
envelope:

- Success: `200 { data: T }`
- Failure: `4xx { error: { message: string } }`

| Route | Method | Purpose |
|---|---|---|
| `/api/stats` | GET | The 4 top-row stat cards (money, users, clients, sales) |
| `/api/sales-overview` | GET | Monthly revenue series for the gradient area chart |
| `/api/active-users` | GET | Weekly bar-chart series + 4 mini stat chips |
| `/api/satisfaction` | GET | Satisfaction-rate gauge value |
| `/api/referral` | GET | Invited/Bonus sparkline series + summaries |
| `/api/projects` | GET | Projects table (also reused on the Tables page) |
| `/api/orders` | GET | Orders-overview timeline |
| `/api/authors` | GET | Authors table (Tables page) |
| `/api/invoices` | GET | Invoices list (Billing page) |
| `/api/auth/sign-in` | POST | Mock auth — validates email/password, returns a fake token |
| `/api/auth/sign-up` | POST | Mock auth — validates name/email/password |

Every GET route adds a randomized 350–750ms delay (`simulateLatency` in
`lib/api-utils.ts`) purely so the loading skeletons are visible instead of
flashing instantly — remove it if you don't want the artificial latency.

## State management

- **RTK Query** (`store/api/dashboardApi.ts`) owns all server data: caching,
  loading/error flags, and refetching. Every dashboard widget reads its own
  `useGetXQuery()` hook and renders a matching skeleton while
  `isLoading`, or an inline error state on `isError` — no widget can crash
  the rest of the page.
- **`uiSlice`** holds `sidebarOpen` (mobile drawer) and `direction`
  (`ltr`/`rtl`). The RTL page dispatches `setDirection('rtl')` on mount and
  reverts on unmount, which flips the whole app shell (sidebar side, padding,
  icon positions) via Tailwind logical properties (`start-*`/`end-*`,
  `ps-*`/`pe-*`), not just the page content.
- **`authSlice`** holds the mocked signed-in user set after a successful
  sign-in/up, read by the Navbar and Profile page.

## Animations

- **Sidebar**: active nav item is a shared `layoutId` pill that slides
  between items (Framer Motion shared-layout animation); the mobile drawer
  slides in/out with a spring transition and a fading backdrop.
- **Cards**: `<Reveal>` fades + slides every widget in on mount, staggered
  per row so the dashboard doesn't pop in all at once.
- **Charts**: Recharts' built-in mount animation is enabled on every
  area/bar/radial/line chart (`isAnimationActive`), and table rows /
  progress bars animate in individually.
- **Micro-interactions**: hover-lift on cards, rotate-on-hover settings
  icon, animated toggle switches on the Profile page.

None of this blocks interaction — it's CSS/opacity/transform driven, so
scrolling and clicking are never blocked mid-animation.

## Responsive design

- `lg` breakpoint (1024px): fixed sidebar, full navbar search box.
- Below `lg`: sidebar becomes an off-canvas drawer (opened via the navbar's
  hamburger button), 2-column stat-card grid, and the search input hides to
  save space.
- All chart cards use `ResponsiveContainer` so charts reflow with their
  parent grid cell at every width.

## Known limitations / next steps

- Auth is intentionally mocked (no session persistence, no real password
  hashing) — it's here to demonstrate a validated REST endpoint + RTK Query
  mutation + error handling, not to be production auth.
- SQLite is used for zero-setup local development, via the
  `@prisma/adapter-libsql` driver adapter — the same client works
  unchanged against a hosted Turso database in production (see "Hosted
  version" above), no provider swap needed.
- The `/rtl` page renders the same dashboard components with a second,
  independent set of dummy data (for previewing widgets outside the main
  dashboard page); it doesn't mirror the app shell or pull from the
  dashboard's live API data.

