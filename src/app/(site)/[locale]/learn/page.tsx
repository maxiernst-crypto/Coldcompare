import type { Metadata } from "next";
import { ArticleIndex } from "@/components/article-index";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/schemas";
import { both, pageMetadata } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return pageMetadata({ locale, path: `/${locale}/learn`, title: d.learn.title, description: d.learn.sub, alternates: both("/learn") });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const d = getDictionary(locale);
  return <ArticleIndex type="learn" locale={locale} title={d.learn.title} sub={d.learn.sub} path="/learn" />;
}
