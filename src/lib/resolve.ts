import { cache } from "react";
import { query } from "./db";
import { getPublicArticle, getTranslations } from "./repo/articles";
import type { Article, ArticleType, Locale } from "./schemas";
import { visibleStatuses } from "./visibility";

export const SECTION: Record<ArticleType, string> = {
  review: "wallets",
  comparison: "compare",
  guide: "best",
  learn: "learn",
  page: "",
};

export function articlePath(a: { type: ArticleType; locale: Locale; slug: string }): string {
  const section = SECTION[a.type];
  return `/${a.locale}${section ? `/${section}` : ""}/${a.slug}`;
}

export type Resolved =
  | { kind: "found"; article: Article; alternates: Partial<Record<Locale, string>> }
  | { kind: "redirect"; to: string }
  | { kind: "untranslated"; original: Article }
  | { kind: "missing" };

/**
 * Find an article for a locale. If the slug belongs to another language (e.g. after the language
 * switcher swapped the prefix), redirect to the translation, or report that none exists yet.
 */
export const resolveArticle = cache(async (type: ArticleType, locale: Locale, slug: string): Promise<Resolved> => {
  const article = await getPublicArticle(type, locale, slug);
  if (article) {
    const tr = await getTranslations(article.translationKey);
    const alternates: Partial<Record<Locale, string>> = {};
    for (const t of tr) alternates[t.locale] = articlePath({ type, locale: t.locale, slug: t.slug });
    return { kind: "found", article, alternates };
  }
  const other = await query<{ translation_key: string; locale: Locale }>(
    `SELECT translation_key, locale FROM articles WHERE type = $1 AND slug = $2 AND locale <> $3 AND status = ANY($4) LIMIT 1`,
    [type, slug, locale, visibleStatuses()],
  );
  if (!other.length) return { kind: "missing" };
  const tr = await getTranslations(other[0].translation_key);
  const mine = tr.find((t) => t.locale === locale);
  if (mine) return { kind: "redirect", to: articlePath({ type, locale, slug: mine.slug }) };
  const original = await getPublicArticle(type, other[0].locale, slug);
  return original ? { kind: "untranslated", original } : { kind: "missing" };
});
