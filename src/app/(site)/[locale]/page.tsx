import Link from "next/link";
import type { Metadata } from "next";
import { ComparePreview } from "@/components/compare-preview";
import { ProductCard } from "@/components/product-card";
import { SponsoredSlot } from "@/components/sponsored";
import { getSiteSettings } from "@/lib/repo/settings";
import { AffiliateNote, Container, JsonLd, SectionHeading, SeedWarning } from "@/components/ui";
import { getCatalog } from "@/lib/catalog";
import { formatDate, getDictionary } from "@/lib/i18n";
import { listPublicArticles } from "@/lib/repo/articles";
import { SCORE_KEYS, type Locale } from "@/lib/schemas";
import { absolute, both, pageMetadata } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return pageMetadata({
    locale,
    path: `/${locale}`,
    title: locale === "de" ? "Hardware Wallets vergleichen – unabhängig & transparent | ColdCompare" : "Compare Hardware Wallets — Independent & Transparent | ColdCompare",
    absoluteTitle: true,
    description: d.meta.defaultDescription,
    alternates: both(""),
  });
}

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const d = getDictionary(locale);
  const [{ list, weights }, guides, reviews, learn, settings] = await Promise.all([
    getCatalog(locale),
    listPublicArticles("guide", locale),
    listPublicArticles("review", locale),
    listPublicArticles("learn", locale),
    getSiteSettings(),
  ]);
  const top = list.slice(0, 6);
  const guideSlugs = new Set(guides.map((g) => g.slug));
  const useCaseLinks: { key: keyof typeof d.home.useCases; href: string; icon: string }[] = (
    [
      { key: "beginners", guide: "best-hardware-wallets-for-beginners", fallback: "/compare?sort=usability", icon: "◎" },
      { key: "bitcoin", guide: "best-bitcoin-hardware-wallets", fallback: "/compare?f=btc", icon: "₿" },
      { key: "airgapped", guide: "best-air-gapped-hardware-wallets", fallback: "/compare?f=airgap", icon: "⌁" },
      { key: "multisig", guide: "best-hardware-wallets-for-long-term-bitcoin-storage", fallback: "/compare?f=multisig", icon: "⧉" },
      { key: "opensource", guide: "", fallback: "/compare?f=open", icon: "</>" },
      { key: "longterm", guide: "best-hardware-wallets-for-long-term-bitcoin-storage", fallback: "/compare?sort=security", icon: "⏳" },
    ] as const
  ).map((u) => ({ key: u.key, icon: u.icon, href: `/${locale}${u.guide && guideSlugs.has(u.guide) ? `/best/${u.guide}` : u.fallback}` }));

  const featuredLearn = ["what-is-a-hardware-wallet", "seed-phrases-and-recovery", "how-to-back-up-bitcoin", "hardware-wallet-scams", "passphrases-and-hidden-wallets", "multisig-custody", "was-ist-eine-hardware-wallet", "seed-phrase-sicher-aufbewahren"];
  const learnCards = learn.filter((a) => featuredLearn.includes(a.slug)).slice(0, 4);
  const beginnerGuide = guideSlugs.has("best-hardware-wallets-for-beginners") ? `/${locale}/best/best-hardware-wallets-for-beginners` : `/${locale}/learn`;

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "Organization", name: d.meta.siteName, url: absolute(`/${locale}`), logo: absolute("/icon.svg") },
          { "@context": "https://schema.org", "@type": "WebSite", name: d.meta.siteName, url: absolute(`/${locale}`), inLanguage: locale },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />
        <Container className="relative grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="animate-fade-up">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">{d.home.heroTitle}</h1>
            <p className="mt-5 max-w-xl text-lg text-fg-muted">{d.home.heroSub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${locale}/compare`} className="rounded-xl bg-fg px-5 py-3 font-semibold text-bg shadow-sm hover:opacity-90">
                {d.home.ctaCompare}
              </Link>
              <Link href={`/${locale}/quiz`} className="rounded-xl border border-line-strong bg-card px-5 py-3 font-semibold hover:border-accent">
                {d.home.ctaQuiz}
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-fg-muted sm:flex sm:flex-wrap">
              {d.home.trust.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-fade-up rounded-2xl border border-line bg-card p-5 shadow-sm [animation-delay:120ms]">
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">{d.home.topRatedTitle}</p>
            <ol className="mt-3 divide-y divide-line">
              {list.slice(0, 5).map((p, i) => (
                <li key={p.slug} className="flex items-center gap-3 py-3">
                  <span className="w-5 text-sm font-bold text-fg-subtle tabular">{i + 1}</span>
                  <Link href={`/${locale}/wallets/${p.slug}`} className="flex-1 font-medium hover:text-accent-strong">
                    {p.model}
                  </Link>
                  <span className="rounded-md bg-bg-subtle px-2 py-0.5 text-sm font-semibold tabular">{p.overall.toFixed(1)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-fg-subtle">{d.home.topRatedSub}</p>
          </div>
        </Container>
      </section>

      {/* Top rated */}
      <Container className="py-16">
        <SectionHeading
          title={d.home.topRatedTitle}
          sub={d.home.topRatedSub}
          action={
            <Link href={`/${locale}/wallets`} className="text-sm font-semibold text-accent-strong hover:underline">
              {d.common.seeAll} →
            </Link>
          }
        />
        {top.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {top.map((p, i) => (
              <ProductCard key={p.slug} p={p} locale={locale} d={d} rank={i + 1} placement="home-top-rated" />
            ))}
          </div>
        ) : (
          <p className="text-fg-muted">{d.home.noProducts}</p>
        )}
        <div className="mt-4">
          <AffiliateNote d={d} locale={locale} />
        </div>
      </Container>

      {/* Comparison preview */}
      {list.length > 1 && (
        <section className="border-y border-line bg-bg-subtle">
          <Container className="py-16">
            <SectionHeading title={d.home.comparePreviewTitle} sub={d.home.comparePreviewSub} />
            <div data-island="compare-preview">
              <ComparePreview products={list.slice(0, 8)} />
            </div>
          </Container>
        </section>
      )}

      <Container>
        <SponsoredSlot settings={settings} d={d} />
      </Container>

      {/* Use cases */}
      <Container className="py-16">
        <SectionHeading title={d.home.useCasesTitle} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {useCaseLinks.map((u) => (
            <Link key={u.key} href={u.href} className="group flex items-center gap-3 rounded-2xl border border-line bg-card p-5 transition hover:border-accent">
              <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft font-mono text-sm font-bold text-accent-strong">
                {u.icon}
              </span>
              <span className="font-semibold group-hover:text-accent-strong">{d.home.useCases[u.key]}</span>
            </Link>
          ))}
        </div>
      </Container>

      {/* Security education */}
      <section className="border-y border-line bg-bg-subtle">
        <Container className="py-16">
          <SectionHeading
            title={d.home.securityTitle}
            sub={d.home.securitySub}
            action={
              <Link href={`/${locale}/learn`} className="text-sm font-semibold text-accent-strong hover:underline">
                {d.nav.learn} →
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {learnCards.map((a) => (
              <Link key={a.id} href={`/${locale}/learn/${a.slug}`} className="rounded-2xl border border-line bg-card p-5 transition hover:border-line-strong">
                <h3 className="font-semibold">{a.title}</h3>
                {a.excerpt && <p className="mt-2 text-sm text-fg-muted">{a.excerpt}</p>}
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <SeedWarning d={d} />
          </div>
        </Container>
      </section>

      {/* Latest reviews */}
      {reviews.length > 0 && (
        <Container className="py-16">
          <SectionHeading title={d.home.latestTitle} />
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.slice(0, 6).map((r) => (
              <Link key={r.id} href={`/${locale}/wallets/${r.slug}`} className="rounded-2xl border border-line bg-card p-5 transition hover:border-line-strong">
                <p className="text-xs text-fg-subtle">{formatDate(r.reviewedAt ?? r.updatedAt, locale)}</p>
                <h3 className="mt-1 font-semibold leading-snug">{r.title}</h3>
                {r.excerpt && <p className="mt-2 line-clamp-3 text-sm text-fg-muted">{r.excerpt}</p>}
              </Link>
            ))}
          </div>
        </Container>
      )}

      {/* Beginner's guide */}
      <section className="border-t border-line">
        <Container className="grid gap-10 py-16 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{d.home.beginnerTitle}</h2>
            <Link href={beginnerGuide} className="mt-5 inline-flex rounded-xl bg-fg px-5 py-3 font-semibold text-bg hover:opacity-90">
              {d.home.beginnerCta}
            </Link>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {d.home.beginnerSteps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-card p-5">
                <span className="text-sm font-bold text-accent-strong tabular">0{i + 1}</span>
                <h3 className="mt-1 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-fg-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Methodology */}
      <section className="border-t border-line bg-bg-subtle">
        <Container className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{d.home.methodTitle}</h2>
            <p className="mt-4 text-fg-muted">{d.home.methodBody}</p>
            <Link href={`/${locale}/methodology`} className="mt-5 inline-flex font-semibold text-accent-strong hover:underline">
              {d.home.methodCta} →
            </Link>
          </div>
          <ul className="space-y-3 rounded-2xl border border-line bg-card p-6" aria-label={d.scores.weight}>
            {SCORE_KEYS.map((k) => (
              <li key={k}>
                <div className="flex justify-between text-sm">
                  <span>{d.scores[k]}</span>
                  <span className="font-semibold tabular">{weights[k]}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-bg-subtle">
                  <div className="h-2 rounded-full bg-accent" style={{ width: `${Math.min(100, weights[k] * 2)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
