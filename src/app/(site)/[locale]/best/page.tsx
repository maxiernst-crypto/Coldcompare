import type { Metadata } from "next";
import { ArticleIndex } from "@/components/article-index";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/schemas";
import { both, pageMetadata } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return pageMetadata({ locale, path: `/${locale}/best`, title: d.best.title, description: d.best.sub, alternates: both("/best") });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const d = getDictionary(locale);
  return <ArticleIndex type="guide" locale={locale} title={d.best.title} sub={d.best.sub} path="/best" />;
}
