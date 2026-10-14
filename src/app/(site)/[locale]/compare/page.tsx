import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CompareEngine } from "@/components/compare-engine";
import { AffiliateNote, Breadcrumbs, Container } from "@/components/ui";
import { getCatalog } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";
import { listPublicArticles } from "@/lib/repo/articles";
import type { Locale } from "@/lib/schemas";
import { both, pageMetadata } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return pageMetadata({
    locale,
    path: `/${locale}/compare`,
    title: locale === "de" ? "Hardware-Wallet-Vergleich: bis zu 4 Wallets nebeneinander" : "Hardware Wallet Comparison Tool: Compare up to 4 Side by Side",
    description: d.compare.sub,
    alternates: both("/compare"),
  });
}

export default async function ComparePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const d = getDictionary(locale);
  const [{ list }, comparisons] = await Promise.all([getCatalog(locale), listPublicArticles("comparison", locale)]);
  return (
    <Container className="py-10">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: `/${locale}` }, { name: d.nav.compare, href: `/${locale}/compare` }]} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{d.compare.title}</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">{d.compare.sub}</p>
      <div className="mt-2">
        <AffiliateNote d={d} locale={locale} />
      </div>
      <div className="mt-8" data-island="compare-engine">
        <Suspense>
          <CompareEngine products={list} />
        </Suspense>
      </div>
      {comparisons.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">{d.comparisons.title}</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {comparisons.map((c) => (
              <li key={c.id}>
                <Link href={`/${locale}/compare/${c.slug}`} className="block rounded-xl border border-line bg-card p-4 font-medium hover:border-accent">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
