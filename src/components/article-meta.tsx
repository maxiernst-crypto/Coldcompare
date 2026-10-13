import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/en";
import { formatDate, pick } from "@/lib/i18n";
import { getAuthor } from "@/lib/repo/articles";
import type { Article, Locale } from "@/lib/schemas";
import { extractHeadings } from "@/lib/markdown";

export async function ArticleByline({ article, locale, d }: { article: Article; locale: Locale; d: Dictionary }) {
  const author = article.authorId ? await getAuthor(article.authorId) : null;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-subtle">
      {author && (
        <span>
          {d.common.by}{" "}
          <Link href={`/${locale}/about`} className="font-medium text-fg-muted hover:text-fg" title={pick(author.bio, locale)}>
            {author.name}
          </Link>
          {author.isPlaceholder && <span className="sr-only"> ({d.common.authorPlaceholder})</span>}
        </span>
      )}
      {article.publishedAt && (
        <span>
          {d.common.published} <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
        </span>
      )}
      <span>
        {d.common.updated} <time dateTime={article.updatedAt}>{formatDate(article.updatedAt, locale)}</time>
      </span>
      {article.reviewedAt && (
        <span className="text-ok">
          {d.common.reviewed} <time dateTime={article.reviewedAt}>{formatDate(article.reviewedAt, locale)}</time>
        </span>
      )}
    </div>
  );
}

export function Toc({ body, d }: { body: string; d: Dictionary }) {
  const hs = extractHeadings(body);
  if (hs.length < 3) return null;
  return (
    <nav aria-label={d.common.tableOfContents} className="rounded-2xl border border-line bg-card p-5 text-sm">
      <p className="font-semibold">{d.common.tableOfContents}</p>
      <ol className="mt-3 space-y-2 text-fg-muted">
        {hs.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="hover:text-fg">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function articleJsonLd(article: Article, url: string, authorName: string | undefined, siteName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription ?? article.excerpt ?? undefined,
    inLanguage: article.locale,
    mainEntityOfPage: url,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: authorName ?? siteName },
    publisher: { "@type": "Organization", name: siteName },
  };
}
