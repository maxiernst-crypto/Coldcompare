import type { Metadata } from "next";
import { Suspense } from "react";
import { Quiz } from "@/components/quiz";
import { Breadcrumbs, Container } from "@/components/ui";
import { getCatalog } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/schemas";
import { both, pageMetadata } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return pageMetadata({ locale, path: `/${locale}/quiz`, title: d.quiz.title, description: d.quiz.sub, alternates: both("/quiz") });
}

export default async function QuizPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const d = getDictionary(locale);
  const { list } = await getCatalog(locale);
  return (
    <Container className="max-w-3xl py-10">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: `/${locale}` }, { name: d.nav.quiz, href: `/${locale}/quiz` }]} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{d.quiz.title}</h1>
      <p className="mt-3 text-fg-muted">{d.quiz.sub}</p>
      <div className="mt-8">
        <Suspense>
          <Quiz products={list} />
        </Suspense>
      </div>
    </Container>
  );
}
