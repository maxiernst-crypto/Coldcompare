import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleByline, Toc } from "@/components/article-meta";
import { BuyButton } from "@/components/buy-button";
import { DeviceIllustration } from "@/components/device";
import { PriceTag } from "@/components/price-tag";
import { ProductCard } from "@/components/product-card";
import { Prose } from "@/components/prose";
import { SpecList } from "@/components/spec-list";
import { AdvisoryList, AffiliateNote, Breadcrumbs, Container, Faq, JsonLd, Pill, ScoreBadge, SeedWarning, Sources } from "@/components/ui";
import { getCatalog } from "@/lib/catalog";
import { formatDate, getDictionary, pick, pickList } from "@/lib/i18n";
import { getAuthor, getPublicArticle, getTranslations, listArticlesForProduct } from "@/lib/repo/articles";
import { getPublicProduct, listPublicProducts } from "@/lib/repo/products";
import { getSiteSettings } from "@/lib/repo/settings";
import { articlePath } from "@/lib/resolve";
import { LOCALES, SCORE_KEYS, type Locale } from "@/lib/schemas";
import { scoreBreakdown } from "@/lib/scoring";
import { absolute, pageMetadata } from "@/lib/site";
import { isPreviewMode } from "@/lib/visibility";

export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await listPublicProducts();
  return products.map((p) => ({ slug: p.slug }));
}

async function load(locale: Locale, slug: string) {
  const product = await getPublicProduct(slug);
  if (!product) return null;
  const review = await getPublicArticle("review", locale, slug);
  return { product, review };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await load(locale, slug);
  if (!data) return {};
  const { product, review } = data;
  const d = getDictionary(locale);
  const title = review?.metaTitle ?? review?.title ?? (locale === "de" ? `${product.model}: Daten, Sicherheit & Preis` : `${product.model}: Specs, Security & Price`);
  const description = review?.metaDescription ?? `${pick(product.data.tagline, locale)}. ${d.common.claimsNote}`;
  return pageMetadata({
    locale,
    path: `/${locale}/wallets/${slug}`,
    title,
    absoluteTitle: !!review?.metaTitle,
    description,
    alternates: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/wallets/${slug}`])),
    type: review ? "article" : "website",
    publishedTime: review?.publishedAt,
    modifiedTime: review?.updatedAt ?? product.updatedAt,
    noindex: review?.data.noindex,
  });
}

export default async function WalletPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const data = await load(locale, slug);
  if (!data) notFound();
  const { product, review } = data;
  const d = getDictionary(locale);
  const [{ list, map, weights }, related, settings, otherReview] = await Promise.all([
    getCatalog(locale),
    listArticlesForProduct(slug, locale),
    getSiteSettings(),
    review ? Promise.resolve(null) : getPublicArticle("review", "en", slug),
  ]);
  const p = map.get(slug)!;
  const pd = product.data;
  const author = review?.authorId ? await getAuthor(review.authorId) : null;
  const translations = review ? await getTranslations(review.translationKey) : [];
  const critical = pd.advisories.filter((a) => a.severity === "critical");
  const alternatives = list
    .filter((x) => x.slug !== slug && x.bitcoinOnly === p.bitcoinOnly)
    .sort((a, b) => Math.abs(a.overall - p.overall) - Math.abs(b.overall - p.overall))
    .slice(0, 3);
  const url = absolute(`/${locale}/wallets/${slug}`);
  const h1 = review?.title ?? (locale === "de" ? `${product.model}: Daten, Sicherheit & Preis` : `${product.model}: specs, security & price`);

  // Structured data: Product (+ editorial Review when a review is published). No aggregate ratings.
  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.model,
    brand: { "@type": "Brand", name: product.manufacturer.name },
    description: pick(pd.tagline, locale),
    url,
  };
  if (pd.image?.url) productLd.image = pd.image.url.startsWith("http") ? pd.image.url : absolute(pd.image.url);
  if (pd.factStatus.price === "verified") {
    const cur = locale === "de" ? "EUR" : pd.prices.GBP != null ? "GBP" : "EUR";
    const price = pd.prices[cur];
    if (price != null) productLd.offers = { "@type": "Offer", price, priceCurrency: cur, url };
  }
  if (review) {
    productLd.review = {
      "@type": "Review",
      name: review.title,
      reviewRating: { "@type": "Rating", ratingValue: p.overall, bestRating: 10, worstRating: 0 },
      author: { "@type": "Organization", name: author?.name ?? d.meta.siteName },
      publisher: { "@type": "Organization", name: d.meta.siteName },
      datePublished: review.publishedAt ?? undefined,
      dateModified: review.updatedAt,
      inLanguage: locale,
    };
  }

  return (
    <Container className="py-10">
      <JsonLd data={productLd} />
      <Breadcrumbs
        d={d}
        items={[
          { name: d.nav.home, href: `/${locale}` },
          { name: d.nav.wallets, href: `/${locale}/wallets` },
          { name: product.model, href: `/${locale}/wallets/${slug}` },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <article className="min-w-0">
          <header>
            <p className="text-sm font-medium text-fg-subtle">{product.manufacturer.name}</p>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{h1}</h1>
            <p className="mt-3 text-lg text-fg-muted">{pick(pd.tagline, locale)}</p>
            <div className="mt-4">{review ? <ArticleByline article={review} locale={locale} d={d} /> : null}</div>
            {translations.length > 1 && (
              <p className="mt-2 text-sm">
                {translations
                  .filter((t) => t.locale !== locale)
                  .map((t) => (
                    <Link key={t.locale} hrefLang={t.locale} href={articlePath({ type: "review", locale: t.locale, slug: t.slug })} className="text-accent-strong underline">
                      {t.locale === "de" ? "Auf Deutsch lesen" : "Read in English"}
                    </Link>
                  ))}
              </p>
            )}
          </header>

          {critical.length > 0 && (
            <div className="mt-6">
              <AdvisoryList advisories={critical} locale={locale} d={d} />
            </div>
          )}

          {review?.data.verdict && (
            <section aria-labelledby="verdict" className="mt-8 rounded-2xl border border-line bg-bg-subtle p-6">
              <div className="flex items-start gap-4">
                <ScoreBadge score={p.overall} size="lg" label={d.common.editorialScore} />
                <div>
                  <h2 id="verdict" className="text-lg font-bold">
                    {d.review.quickVerdict}
                  </h2>
                  <p className="mt-1 text-fg-muted">{review.data.verdict}</p>
                </div>
              </div>
            </section>
          )}

          <p className="mt-6 rounded-xl border border-info/20 bg-info-soft p-3 text-sm text-info">{d.common.notHandsOn}</p>

          <section aria-labelledby="proscons" className="mt-8">
            <h2 id="proscons" className="text-2xl font-bold tracking-tight">
              {d.review.prosCons}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-ok/30 bg-ok-soft/50 p-5">
                <h3 className="font-semibold text-ok">{d.review.pros}</h3>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {pickList(pd.pros, locale).map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden className="text-ok">+</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-danger/25 bg-danger-soft/50 p-5">
                <h3 className="font-semibold text-danger">{d.review.cons}</h3>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {pickList(pd.cons, locale).map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden className="text-danger">−</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {review ? (
            <div className="mt-10">
              <Prose body={review.body} locale={locale} d={d} products={map} weights={weights} settings={settings} placement="review-body" />
            </div>
          ) : (
            <section className="mt-10 space-y-4">
              <p className="rounded-xl border border-dashed border-line p-4 text-sm text-fg-muted">
                {d.review.profileOnly}{" "}
                {otherReview && locale !== "en" && (
                  <Link href={`/en/wallets/${slug}`} hrefLang="en" className="text-accent-strong underline">
                    {d.common.readInEnglish}
                  </Link>
                )}
              </p>
              <h2 className="text-2xl font-bold tracking-tight">{d.review.security}</h2>
              <p className="text-fg-muted">{pick(pd.securityArchitecture, locale)}</p>
              {pick(pd.usabilityNotes, locale) && (
                <>
                  <h2 className="text-2xl font-bold tracking-tight">{d.review.usability}</h2>
                  <p className="text-fg-muted">{pick(pd.usabilityNotes, locale)}</p>
                </>
              )}
            </section>
          )}

          <section aria-labelledby="who" className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-card p-5">
              <h2 id="who" className="font-bold">
                {d.review.whoBuy}
              </h2>
              <p className="mt-2 text-sm text-fg-muted">{pick(pd.bestFor, locale)}</p>
            </div>
            <div className="rounded-2xl border border-line bg-card p-5">
              <h2 className="font-bold">{d.review.whoAvoid}</h2>
              <p className="mt-2 text-sm text-fg-muted">{pick(pd.avoidIf, locale)}</p>
            </div>
          </section>

          <section aria-labelledby="score" className="mt-12">
            <h2 id="score" className="text-2xl font-bold tracking-tight">
              {d.review.scoreTitle}
            </h2>
            <p className="mt-2 text-sm text-fg-muted">{d.review.scoreNote}</p>
            <div className="mt-4 rounded-2xl border border-line bg-card p-5">
              <ul className="space-y-3">
                {scoreBreakdown(pd.scores, weights).map((s) => (
                  <li key={s.key} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 text-sm">
                    <span>
                      {d.scores[s.key]} <span className="text-fg-subtle">({s.weight}%)</span>
                    </span>
                    <span className="font-semibold tabular">{s.score.toFixed(1)}</span>
                    <div className="col-span-2 h-2 rounded-full bg-bg-subtle">
                      <div className="h-2 rounded-full bg-accent" style={{ width: `${s.score * 10}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="font-semibold">{d.scores.overall}</span>
                <ScoreBadge score={p.overall} size="sm" />
              </div>
              {pick(pd.scoreRationale, locale) && <p className="mt-3 text-sm text-fg-muted">{pick(pd.scoreRationale, locale)}</p>}
              <Link href={`/${locale}/methodology`} className="mt-3 inline-block text-sm font-medium text-accent-strong underline">
                {d.footer.methodology}
              </Link>
            </div>
          </section>

          <section aria-labelledby="specs" className="mt-12">
            <h2 id="specs" className="text-2xl font-bold tracking-tight">
              {d.review.specs}
            </h2>
            <p className="mt-1 text-sm text-fg-subtle">
              {d.common.lastVerified}: {product.lastVerifiedAt ? formatDate(product.lastVerifiedAt, locale) : d.fact.unverified}
              {pd.priceCheckedAt && ` · ${d.attrs.price}: ${formatDate(pd.priceCheckedAt, locale)}`}
            </p>
            <div className="mt-4">
              <SpecList
                p={p}
                d={d}
                extra={[
                  { label: d.attrs.hq, value: product.manufacturer.hqCountry || d.fact.unverified },
                  ...(pd.editions.length ? [{ label: d.attrs.editions, value: pd.editions.join(", ") }] : []),
                  { label: d.attrs.apps, value: pd.companionApps || "—" },
                  { label: d.attrs.warranty, value: pick(pd.warranty, locale) },
                  { label: d.attrs.shippingGB, value: pick(pd.shipping.GB, locale) },
                  { label: d.attrs.shippingDE, value: pick(pd.shipping.DE, locale) },
                ]}
              />
            </div>
          </section>

          {pd.advisories.length > 0 && (
            <section aria-labelledby="advisories" className="mt-12">
              <h2 id="advisories" className="text-2xl font-bold tracking-tight">
                {d.review.advisories}
              </h2>
              <div className="mt-4">
                <AdvisoryList advisories={pd.advisories} locale={locale} d={d} />
              </div>
            </section>
          )}

          {alternatives.length > 0 && (
            <section aria-labelledby="alternatives" className="mt-12">
              <h2 id="alternatives" className="text-2xl font-bold tracking-tight">
                {d.review.alternatives}
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {alternatives.map((a) => (
                  <ProductCard key={a.slug} p={a} locale={locale} d={d} placement="review-alternatives" />
                ))}
              </div>
              <Link href={`/${locale}/compare?w=${[slug, ...alternatives.map((a) => a.slug)].join(",")}`} className="mt-4 inline-block text-sm font-semibold text-accent-strong hover:underline">
                {d.common.compare} →
              </Link>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold">{d.review.relatedComparisons}</h2>
              <ul className="mt-3 space-y-2">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={articlePath(r)} className="text-accent-strong underline underline-offset-2">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {review && <Faq faqs={review.data.faqs} d={d} />}
          <Sources sources={[...pd.sources, ...(review?.data.sources ?? [])].filter((s, i, arr) => arr.findIndex((x) => x.url === s.url) === i)} d={d} />
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center justify-between">
              <DeviceIllustration formFactor={pd.formFactor} label={pd.image?.alt ?? product.model} imageUrl={pd.image?.url} className="h-24 w-24" />
              <ScoreBadge score={p.overall} size="lg" label={d.common.editorialScore} />
            </div>
            {pd.image?.credit && <p className="mt-1 text-[10px] text-fg-subtle">{pd.image.credit}</p>}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {pd.bitcoinOnly && <Pill tone="accent">{d.compare.filterBtcOnly}</Pill>}
              {critical.length > 0 && <Pill tone="danger">{d.attrs.advisories}</Pill>}
              {isPreviewMode() && product.status !== "published" && <Pill tone="warn">{product.status}</Pill>}
            </div>
            <div className="mt-4">
              <PriceTag prices={pd.prices} status={pd.factStatus.price} />
            </div>
            <BuyButton slug={slug} locale={locale} placement="review-sidebar" label={d.common.visitStore} className="mt-4 w-full" />
            <p className="mt-3 text-xs text-fg-subtle">{d.review.buyNote}</p>
            <div className="mt-3">
              <AffiliateNote d={d} locale={locale} />
            </div>
          </div>
          {review && <Toc body={review.body} d={d} />}
          <div className="rounded-2xl border border-line bg-card p-5 text-sm">
            <p className="font-semibold">{d.common.factLegend}</p>
            <ul className="mt-2 space-y-1 text-fg-muted">
              {(["verified", "manufacturer_claim", "unverified"] as const).map((s) => (
                <li key={s}>{d.fact[s]}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-fg-subtle">{SCORE_KEYS.length} categories · {d.common.claimsNote}</p>
          </div>
          <SeedWarning d={d} compact />
        </aside>
      </div>
    </Container>
  );
}
