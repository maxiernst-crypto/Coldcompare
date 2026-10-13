# Implementation phases — status

## Phase 1 — Foundation ✅
**Done:** brand proposal (docs/BRAND.md), design tokens with light/dark themes, responsive layout, header/footer, PostgreSQL schema and migrations, product database (20 wallets from 11 manufacturers; 18 in review, 2 drafts), homepage with all required sections.
**Outstanding:** licensed product photography; final domain/trademark checks.
**Decisions needed:** final brand name and domain; whether to commission a designer for a logo refresh.

## Phase 2 — Core functionality ✅
**Done:** comparison engine (search, 6 filters, price cap, 6 sorts, max 4, difference highlighting/"only differences", mobile sticky column, shareable URLs); wallet profiles and review pages; 8-question quiz with top-3 explanations, limitations, alternatives and security notes; admin CMS with roles, editorial workflow, Markdown editor/preview, translations, product editor with fact status and advisories.
**Outstanding:** media upload (currently image URLs); revision history beyond the audit log.
**Decisions needed:** who are the named editors/reviewers (E-E-A-T)?

## Phase 3 — SEO & content ✅ (pending editorial sign-off)
**Done:** technical SEO (SSG/ISR, canonical, hreflang, sitemap, robots, structured data, breadcrumbs); 5 reviews (+1 German), 5 head-to-heads, 8 guides (incl. UK and Germany; DE translation of the Germany guide), 12 academy articles (+2 German), 9 trust/legal pages in EN and DE; content-integrity tests; keyword strategy (docs/SEO-STRATEGY.md).
**Outstanding:** human fact-check and publication of every item (see docs/EDITORIAL-CHECKLIST.md); more German translations; GBP prices.
**Decisions needed:** which items to publish first (suggest: methodology, about, disclosure, then the BitBox02/Trezor reviews and the main guide).

## Phase 4 — Monetisation ✅ (infrastructure)
**Done:** per-product × country links, multiple networks, `/go/` redirect, anonymous click tracking, UTM, daily link health checks, revenue entry, RPM and revenue by wallet/country, disclosures, consent-gated GA4, optional cookieless analytics, GSC verification + CSV import, double opt-in newsletter, labelled sponsored slot.
**Outstanding:** real affiliate agreements (all links are clearly marked placeholders to official stores); network API imports for conversions (manual/CSV today); email provider setup.
**Decisions needed:** which programmes to apply to (see docs/MONETISATION-ROADMAP.md); email provider.

## Phase 5 — Launch 🚧
**Done:** production build verified; 63 unit/integration tests and 22 end-to-end tests (desktop + mobile) passing; security headers; RBAC; deployment guide; CI workflow.
**Outstanding:** deploy to Vercel + Supabase; Lighthouse run on the production domain; legal review; fill operator details; replace placeholder author; publish verified content; submit sitemap.
**Decisions needed:** legal entity (UK Ltd / German GmbH / sole trader) — this determines Impressum, VAT and tax setup.
