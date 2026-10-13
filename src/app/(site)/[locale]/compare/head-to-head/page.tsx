import type { Metadata } from "next";
import { ArticleIndex } from "@/components/article-index";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/schemas";
import { both, pageMetadata } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return pageMetadata({ locale, path: `/${locale}/compare/head-to-head`, title: d.comparisons.title, description: d.comparisons.sub, alternates: both("/compare/head-to-head") });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const d = getDictionary(locale);
  return <ArticleIndex type="comparison" locale={locale} title={d.comparisons.title} sub={d.comparisons.sub} path="/compare/head-to-head" />;
}
