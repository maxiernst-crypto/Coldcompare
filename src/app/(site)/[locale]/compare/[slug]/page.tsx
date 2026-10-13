import type { Metadata } from "next";
import { ArticlePage, articleMetadata, staticArticleParams } from "@/components/article-page";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/schemas";

export const dynamicParams = true;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return (await staticArticleParams("comparison")).filter((p) => p.locale === params.locale).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  return articleMetadata("comparison", locale, slug);
}

export default async function Page({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const d = getDictionary(locale);
  return <ArticlePage type="comparison" locale={locale} slug={slug} section={{ name: d.comparisons.title, href: `/${locale}/compare/head-to-head` }} />;
}
