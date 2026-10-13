import { cache } from "react";
import { query, queryOne, toDateString, toIso } from "../db";
import { articleDataSchema, type Article, type ArticleType, type Author, type ContentStatus, type Locale } from "../schemas";
import { visibleStatuses } from "../visibility";

interface ArticleRow {
  id: string;
  type: ArticleType;
  locale: Locale;
  slug: string;
  translation_key: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  excerpt: string | null;
  body: string;
  status: ContentStatus;
  author_id: string | null;
  product_slugs: string[];
  data: unknown;
  published_at: Date | null;
  reviewed_at: string | null;
  updated_at: Date;
}

function mapRow(r: ArticleRow): Article {
  return {
    id: r.id,
    type: r.type,
    locale: r.locale,
    slug: r.slug,
    translationKey: r.translation_key,
    title: r.title,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    excerpt: r.excerpt,
    body: r.body,
    status: r.status,
    authorId: r.author_id,
    productSlugs: r.product_slugs ?? [],
    data: articleDataSchema.parse(r.data ?? {}),
    publishedAt: toIso(r.published_at),
    reviewedAt: toDateString(r.reviewed_at),
    updatedAt: toIso(r.updated_at) ?? "",
  };
}

export const listPublicArticles = cache(async (type: ArticleType, locale: Locale): Promise<Article[]> => {
  const rows = await query<ArticleRow>(
    `SELECT * FROM articles WHERE type = $1 AND locale = $2 AND status = ANY($3) ORDER BY COALESCE(published_at, updated_at) DESC`,
    [type, locale, visibleStatuses()],
  );
  return rows.map(mapRow);
});

export const getPublicArticle = cache(async (type: ArticleType, locale: Locale, slug: string): Promise<Article | null> => {
  const row = await queryOne<ArticleRow>(`SELECT * FROM articles WHERE type = $1 AND locale = $2 AND slug = $3 AND status = ANY($4)`, [
    type,
    locale,
    slug,
    visibleStatuses(),
  ]);
  return row ? mapRow(row) : null;
});

/** Public translations of an article (used for hreflang and the language switcher). */
export const getTranslations = cache(async (translationKey: string): Promise<{ locale: Locale; slug: string }[]> => {
  return query<{ locale: Locale; slug: string }>(
    `SELECT locale, slug FROM articles WHERE translation_key = $1 AND status = ANY($2) ORDER BY locale`,
    [translationKey, visibleStatuses()],
  );
});

/** All public articles in all locales (for the sitemap and static params). */
export const listAllPublicArticles = cache(async (): Promise<Article[]> => {
  const rows = await query<ArticleRow>(`SELECT * FROM articles WHERE status = ANY($1) ORDER BY type, slug`, [visibleStatuses()]);
  return rows.map(mapRow);
});

/** Public articles mentioning a product (reviews, comparisons and guides that include it). */
export const listArticlesForProduct = cache(async (productSlug: string, locale: Locale): Promise<Article[]> => {
  const rows = await query<ArticleRow>(
    `SELECT * FROM articles WHERE $1 = ANY(product_slugs) AND locale = $2 AND status = ANY($3) AND type IN ('comparison','guide')
     ORDER BY type, title`,
    [productSlug, locale, visibleStatuses()],
  );
  return rows.map(mapRow);
});

export async function listArticlesAdmin(filter: { type?: string; locale?: string; status?: string; q?: string } = {}): Promise<Article[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (filter.type) where.push(`type = $${params.push(filter.type)}`);
  if (filter.locale) where.push(`locale = $${params.push(filter.locale)}`);
  if (filter.status) where.push(`status = $${params.push(filter.status)}`);
  if (filter.q) where.push(`(title ILIKE $${params.push(`%${filter.q}%`)} OR slug ILIKE $${params.length})`);
  const rows = await query<ArticleRow>(
    `SELECT * FROM articles ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY updated_at DESC`,
    params,
  );
  return rows.map(mapRow);
}

export async function getArticleById(id: string): Promise<Article | null> {
  const row = await queryOne<ArticleRow>(`SELECT * FROM articles WHERE id = $1`, [id]);
  return row ? mapRow(row) : null;
}

export async function listTranslationsAdmin(translationKey: string): Promise<Article[]> {
  const rows = await query<ArticleRow>(`SELECT * FROM articles WHERE translation_key = $1 ORDER BY locale`, [translationKey]);
  return rows.map(mapRow);
}

export interface ArticleInput {
  type: ArticleType;
  locale: Locale;
  slug: string;
  translationKey: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  excerpt: string | null;
  body: string;
  status: ContentStatus;
  authorId: string | null;
  productSlugs: string[];
  data: Article["data"];
  reviewedAt: string | null;
}

export async function saveArticle(id: string | null, a: ArticleInput): Promise<string> {
  const data = JSON.stringify(articleDataSchema.parse(a.data));
  const params = [
    a.type,
    a.locale,
    a.slug,
    a.translationKey,
    a.title,
    a.metaTitle,
    a.metaDescription,
    a.excerpt,
    a.body,
    a.status,
    a.authorId,
    a.productSlugs,
    data,
    a.reviewedAt,
  ];
  if (id) {
    await query(
      `UPDATE articles SET type=$1::article_type, locale=$2, slug=$3, translation_key=$4, title=$5, meta_title=$6, meta_description=$7,
         excerpt=$8, body=$9, status=$10::content_status, author_id=$11, product_slugs=$12, data=$13, reviewed_at=$14, updated_at=now(),
         published_at = CASE WHEN $10::content_status = 'published' AND published_at IS NULL THEN now() ELSE published_at END
       WHERE id = $15`,
      [...params, id],
    );
    return id;
  }
  const row = await queryOne<{ id: string }>(
    `INSERT INTO articles (type, locale, slug, translation_key, title, meta_title, meta_description, excerpt, body, status,
       author_id, product_slugs, data, reviewed_at, published_at)
     VALUES ($1::article_type,$2,$3,$4,$5,$6,$7,$8,$9,$10::content_status,$11,$12,$13,$14, CASE WHEN $10::content_status = 'published' THEN now() ELSE NULL END)
     ON CONFLICT (type, locale, slug) DO UPDATE SET translation_key=EXCLUDED.translation_key, title=EXCLUDED.title,
       meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, excerpt=EXCLUDED.excerpt, body=EXCLUDED.body,
       status=EXCLUDED.status, author_id=EXCLUDED.author_id, product_slugs=EXCLUDED.product_slugs, data=EXCLUDED.data,
       reviewed_at=EXCLUDED.reviewed_at, updated_at=now()
     RETURNING id`,
    params,
  );
  return row!.id;
}

export async function deleteArticle(id: string): Promise<void> {
  await query(`DELETE FROM articles WHERE id = $1`, [id]);
}

export const getAuthor = cache(async (id: string): Promise<Author | null> => {
  const r = await queryOne<{ id: string; name: string; role: Author["role"]; bio: Author["bio"]; avatar_url: string | null; is_placeholder: boolean }>(
    `SELECT * FROM authors WHERE id = $1`,
    [id],
  );
  return r ? { id: r.id, name: r.name, role: r.role, bio: r.bio, avatarUrl: r.avatar_url, isPlaceholder: r.is_placeholder } : null;
});

export async function listAuthors(): Promise<Author[]> {
  const rows = await query<{ id: string; name: string; role: Author["role"]; bio: Author["bio"]; avatar_url: string | null; is_placeholder: boolean }>(
    `SELECT * FROM authors ORDER BY name`,
  );
  return rows.map((r) => ({ id: r.id, name: r.name, role: r.role, bio: r.bio, avatarUrl: r.avatar_url, isPlaceholder: r.is_placeholder }));
}

export async function saveAuthor(a: Author): Promise<void> {
  await query(
    `INSERT INTO authors (id, name, role, bio, avatar_url, is_placeholder) VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, role=EXCLUDED.role, bio=EXCLUDED.bio, avatar_url=EXCLUDED.avatar_url,
       is_placeholder=EXCLUDED.is_placeholder, updated_at=now()`,
    [a.id, a.name, JSON.stringify(a.role), JSON.stringify(a.bio), a.avatarUrl, a.isPlaceholder],
  );
}
