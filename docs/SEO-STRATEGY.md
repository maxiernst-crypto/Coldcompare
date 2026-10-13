# SEO strategy

> **About the numbers.** No keyword tool (Ahrefs, Semrush, Google Keyword Planner) was available while building this, so **no search volumes are given**. "Value" and "difficulty" below are qualitative editorial estimates based on intent and on the type of sites that typically rank (manufacturers, large publishers, exchanges). Replace them with measured data from Keyword Planner / GSC before you set targets.

## Technical foundation (implemented)

- Static generation + hourly ISR; Core Web Vitals-friendly (~126 kB first-load JS on content pages, self-hosted font, no layout-shifting ads, SVG illustrations).
- Semantic HTML: one H1 per page, H2/H3 hierarchy, breadcrumbs, skip link, accessible tables.
- `<link rel=canonical>` on every page; **hreflang only between real translations** (`en`, `de`, `x-default` → en). Untranslated German stubs are `noindex`.
- XML sitemap with alternates; robots.txt blocks `/admin`, `/api`, `/go/`. Preview deployments are fully `noindex` and return an empty sitemap.
- Structured data: Organization, WebSite, BreadcrumbList, Product (+ Offer only when price is verified), Review with the editorial score (single critic, no AggregateRating), Article, FAQPage, ItemList.
- Affiliate links: `rel="sponsored nofollow"`, routed through `/go/` (noindex).
- Unique titles and meta descriptions per page, editable in the admin; meta-description length enforced (≤170 chars).

## Keyword clusters → target pages

| Cluster | Example queries | Intent | Target page | Value | Difficulty |
|---|---|---|---|---|---|
| Head commercial | best hardware wallet, best crypto hardware wallet, hardware wallet comparison | Commercial | `/best/best-hardware-wallets`, `/compare` | Very high | Very high |
| Bitcoin | best bitcoin wallet, bitcoin cold storage wallet, bitcoin only hardware wallet | Commercial | `/best/best-bitcoin-hardware-wallets` | High | High |
| Most secure | most secure bitcoin wallet, safest hardware wallet | Commercial/info | Guides + `/methodology` (honest "it depends" angle) | High | High |
| Product reviews | bitbox02 review, coldcard q review, trezor safe 5 review, ledger flex review, jade plus review | Commercial | `/wallets/{slug}` | High | Medium |
| Versus | ledger vs trezor, bitbox vs trezor, bitbox02 vs ledger, coldcard vs bitbox, jade vs trezor | Commercial | `/compare/{a}-vs-{b}` | High | Medium |
| Alternatives | best ledger alternative, trezor alternative | Commercial | New guide (roadmap) | High | Medium |
| Incident-driven | coldcard seed vulnerability, is coldcard safe, ledger recover | Info/news | COLDCARD/Ledger reviews (advisories) | Medium | Low–medium (time-sensitive) |
| Local | best hardware wallet uk, hardware wallet kaufen, beste hardware wallet | Commercial | `/best/best-hardware-wallets-uk`, `/de/best/beste-hardware-wallets-deutschland` | High | Medium |
| Use case | air-gapped wallet, multisig wallet, open source hardware wallet, hardware wallet for beginners | Commercial | Respective `/best/…` guides | Medium–high | Medium |
| Safety (informational) | are hardware wallets safe, what happens if a hardware wallet breaks, can bitcoin be stolen from a hardware wallet | Info | `/learn/what-is-a-hardware-wallet` (FAQs) | Medium | Medium |
| Backup | how to store a seed phrase safely, seed phrase backup, metal seed backup | Info | `/learn/how-to-back-up-bitcoin`, `/de/learn/seed-phrase-sicher-aufbewahren` | Medium | Medium |
| Concepts | passphrase 25th word, secure element explained, multisig explained, bitcoin inheritance | Info | `/learn/*` | Low–medium | Low–medium |
| Scams | ledger phishing letter, hardware wallet scam, fake hardware wallet | Info | `/learn/hardware-wallet-scams` | Medium (trust) | Low–medium |

### Long-tail opportunities with realistic ranking potential (new site)

1. Specific versus pairs not covered by big publishers: *bitbox02 nova vs trezor safe 7*, *jade plus vs keystone 3 pro*, *trezor safe 3 vs bitbox02 bitcoin only*.
2. Incident follow-ups that need accurate, maintained answers: *coldcard migrate seed after 2026 bug*, *is my coldcard affected*.
3. German long-tail where English publishers dominate but German content is thin: *bitcoin only hardware wallet deutsch*, *hardware wallet steuer haltefrist*, *seed phrase aufbewahren metall*.
4. Feature questions: *does bitbox02 work with iphone*, *trezor safe 5 bluetooth*, *jade plus without secure element safe*.
5. "Who should avoid X" angles — rarely answered honestly elsewhere.

## Internal linking model

Hub-and-spoke: guides (hubs) → reviews and versus pages (spokes) → academy articles (supporting). Every review links to alternatives, related comparisons/guides and the methodology; every academy article links to at least one guide or tool. Content tests (`tests/content.test.ts`) fail the build if an internal link points to a non-existent route or a shortcode references an unknown wallet.

## AI-search readiness

Clear Q&A blocks (FAQs), explicit "who should buy/avoid" sections, dated facts with sources, and consistent entity naming make content easy to cite accurately. Never sacrifice accuracy for snippet bait.

## Measurement

Import Search Console exports (pages and queries) in Admin → Analytics; track CTR, average position, top pages/queries and revenue per 1,000 sessions. Review monthly: refresh pages with impressions but low CTR (titles/meta), and pages ranking 5–15 (content depth, internal links).
