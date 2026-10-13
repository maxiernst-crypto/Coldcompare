# Architecture

## Stack

Next.js 15 (App Router, React 19, TypeScript, Server Components, Server Actions) · Tailwind CSS 4 · PostgreSQL (Supabase-compatible) via `pg` · Zod validation · `marked` for Markdown · Vitest + Playwright. No paid third-party services are required.

## Site map

```
/                         → 307 to /en or /de (cookie, then Accept-Language)
/{en,de}                  Homepage
/{l}/compare              Comparison engine (?w=a,b,c,d&f=btc,airgap&sort=…&max=…)
/{l}/compare/head-to-head Index of editorial comparisons
/{l}/compare/{slug}       Head-to-head comparison article
/{l}/wallets              Wallet directory with filters
/{l}/wallets/{slug}       Wallet profile + review (review article with the same slug)
/{l}/best, /{l}/best/{s}  Buying guides
/{l}/learn, /{l}/learn/{s} Academy
/{l}/quiz                 Recommendation quiz (answers in the URL → shareable results)
/{l}/{page}               about, methodology, editorial-policy, affiliate-disclosure, privacy, cookies, terms, contact, impressum
/go/{wallet}              Affiliate redirect (noindex, no cookies)
/admin/*                  CMS (noindex, no-store)
/sitemap.xml, /robots.txt
```

Article slugs can differ per language. If a visitor switches language on an article, the page 308-redirects to the translation, or shows a noindexed "only available in English" notice.

## Data model (`db/migrations/001_init.sql`)

- `manufacturers`, `products` — stable columns (slug, status, verification date) plus a Zod-validated JSONB `data` document for evolving specs (`src/lib/schemas.ts`). Each attribute group has a fact status: `verified | manufacturer_claim | unverified`.
- `affiliate_links` — product × country (`GB`, `DE`, `INTL`, `*`), retailer, network, `is_affiliate`, status (`active | placeholder | paused`), UTM flag, priority, health-check results.
- `outbound_clicks` — anonymous click log (no IP, no user agent, no identifiers).
- `revenue_reports`, `traffic_metrics` — network-reported commission and imported GSC/GA4/Plausible metrics.
- `articles` — reviews, comparisons, guides, academy articles, pages; `translation_key` links languages; `status` and `reviewed_at` drive the editorial gate.
- `authors`, `users` (scrypt hashes, `session_version` for revocation), `audit_log`, `settings` (weights, legal details, sponsored slot), `newsletter_subscribers` (double opt-in).

## Key modules (`src/lib`)

| Module | Purpose |
|---|---|
| `scoring.ts` | Weighted score model (reproducible, editable weights) |
| `quiz.ts` | Rule-based recommendations; input type excludes all commercial data |
| `affiliate.ts` | Country-aware link selection, UTM building, URL safety |
| `filters.ts`, `compare-rows.ts` | Comparison engine logic shared by server and client |
| `markdown.ts` | Safe Markdown (raw HTML escaped, `javascript:` links dropped) + shortcodes |
| `resolve.ts` | Article lookup, translation redirects, hreflang alternates |
| `auth/*` | scrypt hashing, HMAC-signed session cookies, RBAC matrix |
| `visibility.ts` | Editorial gate (`CONTENT_PREVIEW`) |
| `repo/*` | SQL repositories |

## Rendering & caching

Public pages are statically generated at build time and revalidated hourly (ISR); any admin save calls `revalidatePath("/", "layout")` so changes appear immediately. Country-specific prices and retailer choice are resolved client-side (prices) and in `/go` (links), so pages stay cacheable.

## Security

- Admin: scrypt password hashes, HttpOnly/SameSite=Strict signed session cookies (12h), session revocation via `session_version`, login throttling, RBAC checked in every page and server action, audit log, Next.js server-action origin checks.
- Headers: CSP, HSTS, X-Frame-Options DENY, nosniff, strict Referrer-Policy, Permissions-Policy.
- Content: raw HTML in Markdown is never rendered; outbound URLs validated as http(s).
- No form anywhere accepts seed phrases; a warning is shown site-wide.
- The in-memory login throttle is per instance. Behind multiple instances, add a WAF/edge rate limit (e.g. Vercel Firewall) for `/admin/login`.
