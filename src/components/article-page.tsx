import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getCatalog } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";
import { plainText } from "@/lib/markdown";
import { getAuthor } from "@/lib/repo/articles";
import { getSiteSettings } from "@/lib/repo/settings";
import { articlePath, resolveArticle } from "@/lib/resolve";
import type { ArticleType, Locale } from "@/lib/schemas";
import { absolute, pageMetadata } from "@/lib/site";
import { ArticleByline, articleJsonLd, Toc } from "./article-meta";
import { Prose } from "./prose";
import { AffiliateNote, Breadcrumbs, Container, Faq, JsonLd, SeedWarning, Sources } from "./ui";

export async function articleMetadata(type: ArticleType, locale: Locale, slug: string): Promise<Metadata> {
  const r = await resolveArticle(type, locale, slug);
  if (r.kind === "untranslated") return { title: r.original.title, robots: { index: false, follow: true } };
  if (r.kind !== "found") return {};
  const a = r.article;
  return pageMetadata({
    locale,
    path: articlePath(a),
    title: a.metaTitle ?? a.title,
    absoluteTitle: !!a.metaTitle,
    description: a.metaDescription ?? a.excerpt ?? plainText(a.body),
    alternates: r.alternates,
    type: type === "page" ? "website" : "article",
    publishedTime: a.publishedAt,
    modifiedTime: a.updatedAt,
    noindex: a.data.noindex,
  });
}

export async function ArticlePage({ type, locale, slug, section }: { type: ArticleType; locale: Locale; slug: string; section?: { name: string; href: string } }) {
  const d = getDictionary(locale);
  const r = await resolveArticle(type, locale, slug);
  if (r.kind === "missing") notFound();
  if (r.kind === "redirect") permanentRedirect(r.to);
  if (r.kind === "untranslated") {
    return (
      <Container className="py-16">
        <h1 className="text-3xl font-bold">{r.original.title}</h1>
        <p className="mt-4 text-fg-muted">{d.common.onlyInEnglish}</p>
        <Link href={articlePath(r.original)} hrefLang={r.original.locale} className="mt-4 inline-block font-semibold text-accent-strong underline">
          {d.common.readInEnglish} →
        </Link>
      </Container>
    );
  }
  const a = r.article;
  const [{ map, weights }, settings, author] = await Promise.all([getCatalog(locale), getSiteSettings(), a.authorId ? getAuthor(a.authorId) : null]);
  const url = absolute(articlePath(a));
  const crumbs = [{ name: d.nav.home, href: `/${locale}` }, ...(section ? [section] : []), { name: a.title, href: articlePath(a) }];
  const commercial = type === "guide" || type === "comparison";
  const wide = type !== "page";

  return (
    <Container className="py-10">
      {type !== "page" && <JsonLd data={articleJsonLd(a, url, author?.name, d.meta.siteName)} />}
      {type === "guide" && a.data.picks.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: a.title,
            itemListElement: a.data.picks.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absolute(`/${locale}/wallets/${p.product}`), name: map.get(p.product)?.model ?? p.product })),
          }}
        />
      )}
      <Breadcrumbs d={d} items={crumbs} />
      <div className={`mt-6 grid gap-10 ${wide ? "lg:grid-cols-[1fr_17rem]" : ""}`}>
        <article className="min-w-0 max-w-3xl">
          <header>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{a.title}</h1>
            {a.excerpt && <p className="mt-3 text-lg text-fg-muted">{a.excerpt}</p>}
            {type !== "page" && (
              <div className="mt-4">
                <ArticleByline article={a} locale={locale} d={d} />
              </div>
            )}
            {commercial && (
              <div className="mt-3">
                <AffiliateNote d={d} locale={locale} />
              </div>
            )}
          </header>
          {a.data.verdict && (
            <section className="mt-8 rounded-2xl border border-line bg-bg-subtle p-6">
              <h2 className="text-lg font-bold">{d.review.quickVerdict}</h2>
              <p className="mt-1 text-fg-muted">{a.data.verdict}</p>
            </section>
          )}
          {commercial && <p className="mt-6 rounded-xl border border-info/20 bg-info-soft p-3 text-sm text-info">{d.common.notHandsOn}</p>}
          <div className="mt-8">
            <Prose body={a.body} locale={locale} d={d} products={map} picks={a.data.picks} weights={weights} settings={settings} placement={`${type}-${a.slug}`} />
          </div>
          <Faq faqs={a.data.faqs} d={d} />
          <Sources sources={a.data.sources} d={d} />
          {type === "learn" && (
            <div className="mt-10">
              <SeedWarning d={d} />
            </div>
          )}
        </article>
        {wide && (
          <aside className="hidden space-y-4 lg:sticky lg:top-24 lg:block lg:self-start">
            <Toc body={a.body} d={d} />
            <Link href={`/${locale}/quiz`} className="block rounded-2xl border border-line bg-card p-5 hover:border-accent">
              <p className="font-semibold">{d.quiz.title}</p>
              <p className="mt-1 text-sm text-fg-muted">{d.nav.quiz} →</p>
            </Link>
          </aside>
        )}
      </div>
    </Container>
  );
}

export async function staticArticleParams(type: ArticleType) {
  const { listAllPublicArticles } = await import("@/lib/repo/articles");
  const all = await listAllPublicArticles();
  return all.filter((a) => a.type === type).map((a) => ({ locale: a.locale, slug: a.slug }));
}
