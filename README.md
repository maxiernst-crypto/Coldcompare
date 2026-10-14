# ColdCompare — Bitcoin & crypto hardware wallet comparison site

A production-ready Next.js (App Router, TypeScript, Tailwind CSS) affiliate comparison website with:

- **Public site (EN + DE)**: homepage, interactive comparison engine (up to 4 wallets, filters, sorting, difference highlighting, shareable URLs), wallet profiles and reviews, head-to-head comparisons, best-of guides, academy, recommendation quiz, trust and legal pages.
- **Product database** in PostgreSQL with per-attribute fact status (*independently verified / manufacturer claim / not yet verified*), dated verification, security advisories and sources.
- **Transparent scoring** (weights editable in the admin; published on the methodology page).
- **Affiliate infrastructure**: central link management per product × country, `/go/<wallet>` redirect with anonymous click tracking, UTM support, link health checks (daily cron), revenue reporting, `rel="sponsored nofollow"`.
- **CMS / admin** at `/admin` with roles (admin, editor, writer, analyst), editorial workflow (draft → review → published, with a mandatory fact-check checklist), Markdown editor with live preview, translations, SEO metadata, analytics dashboard, CSV imports (Search Console / GA4 / Plausible), audit log.
- **SEO**: static generation + ISR, canonical URLs, hreflang (only for real translations), XML sitemap, robots.txt, breadcrumbs, Product/Review/Article/FAQPage/ItemList/BreadcrumbList structured data (no fabricated ratings).
- **Privacy**: consent banner (GA4 only after opt-in), optional cookieless analytics, no IPs stored for clicks, double opt-in newsletter, 26-month click retention.

> **Editorial gate.** All seeded content is in status `review`: it was researched, but no human has fact-checked it yet. In production (`CONTENT_PREVIEW=false`) only `published` content is public. Editors publish item by item after completing the checklist. See `docs/EDITORIAL-CHECKLIST.md`.

## Quick start

```bash
cp .env.example .env.local          # then set AUTH_SECRET (openssl rand -base64 48)
docker compose up -d                # or point DATABASE_URL at any Postgres 14+ / Supabase
npm install
npm run db:setup                    # migrations + seed (wallets, articles, first admin from ADMIN_EMAIL/ADMIN_PASSWORD)
npm run dev                         # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run typecheck` | TypeScript |
| `npm test` | Unit + content-integrity tests (Vitest). Set `TEST_DATABASE_URL` to also run DB integration tests (that database is wiped). |
| `npm run test:e2e` | Playwright end-to-end tests (desktop + mobile) against `next start` |
| `npm run db:migrate` | Apply SQL migrations in `db/migrations` |
| `npm run db:seed` | Idempotent seed; never overwrites admin edits. `-- --force` re-applies seed content. |
| `npm run admin:create -- email "Name" role` | Create/reset a user (password from `ADMIN_PASSWORD`) |
| `npm run demo:static` | Build a clickable static snapshot (no server needed) into `static-demo/` from a running preview build on :3000 |

## Project layout

```
content/               Seed data: products.ts (wallet database) and articles/* (reviews, guides, academy, pages)
db/migrations/         SQL schema
docs/                  Brand, architecture, SEO, deployment, roadmaps, phase status, editorial checklist
src/app/(site)/[locale] Public site (en/de)
src/app/(admin)/admin  Admin dashboard + server actions
src/app/go/[slug]      Affiliate redirect
src/app/api            Newsletter, cron
src/components         UI components
src/lib                Domain logic: scoring, quiz, affiliate, filters, i18n, repositories, auth
tests/ · e2e/          Vitest and Playwright suites
```

See `docs/` for everything else: [Brand](docs/BRAND.md) · [Architecture](docs/ARCHITECTURE.md) · [SEO strategy](docs/SEO-STRATEGY.md) · [Deployment](docs/DEPLOYMENT.md) · [Phases & status](docs/PHASES.md) · [Content roadmap](docs/CONTENT-ROADMAP.md) · [Monetisation roadmap](docs/MONETISATION-ROADMAP.md) · [Editorial checklist](docs/EDITORIAL-CHECKLIST.md)
