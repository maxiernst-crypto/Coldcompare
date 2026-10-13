import type { Metadata } from "next";
import { Suspense } from "react";
import { WalletBrowser } from "@/components/wallet-browser";
import { AffiliateNote, Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { getCatalog } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/schemas";
import { absolute, both, pageMetadata } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale);
  return pageMetadata({ locale, path: `/${locale}/wallets`, title: d.wallets.title, description: d.wallets.sub, alternates: both("/wallets") });
}

export default async function WalletsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const d = getDictionary(locale);
  const { list } = await getCatalog(locale);
  return (
    <Container className="py-10">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: `/${locale}` }, { name: d.nav.wallets, href: `/${locale}/wallets` }]} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{d.wallets.title}</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">{d.wallets.sub}</p>
      <div className="mt-2">
        <AffiliateNote d={d} locale={locale} />
      </div>
      <div className="mt-8">
        <Suspense>
          <WalletBrowser products={list} />
        </Suspense>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: d.wallets.title,
          itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absolute(`/${locale}/wallets/${p.slug}`), name: p.model })),
        }}
      />
    </Container>
  );
}
