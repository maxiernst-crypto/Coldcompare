import type { ArticleData, ArticleType, ContentStatus, Locale } from "../../src/lib/schemas";

export interface SeedArticle {
  type: ArticleType;
  locale: Locale;
  slug: string;
  translationKey: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  body: string;
  /** Defaults to "review": awaiting human editorial verification before it can be published. */
  status?: ContentStatus;
  authorId?: string;
  productSlugs?: string[];
  data?: Partial<ArticleData>;
}
