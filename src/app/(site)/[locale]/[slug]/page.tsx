import type { Metadata } from "next";
import { ArticlePage, articleMetadata, staticArticleParams } from "@/components/article-page";
import type { Locale } from "@/lib/schemas";

export const dynamicParams = true;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return (await staticArticleParams("page")).filter((p) => p.locale === params.locale).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  return articleMetadata("page", locale, slug);
}

export default async function StaticPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  return <ArticlePage type="page" locale={locale} slug={slug} />;
}
