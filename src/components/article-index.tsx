import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { listPublicArticles } from "@/lib/repo/articles";
import { articlePath } from "@/lib/resolve";
import type { ArticleType, Locale } from "@/lib/schemas";
import { Breadcrumbs, Container, SeedWarning } from "./ui";

export async function ArticleIndex({ type, locale, title, sub, path }: { type: ArticleType; locale: Locale; title: string; sub: string; path: string }) {
  const d = getDictionary(locale);
  const [items, english] = await Promise.all([listPublicArticles(type, locale), locale === "en" ? Promise.resolve([]) : listPublicArticles(type, "en")]);
  const translatedKeys = new Set(items.map((i) => i.translationKey));
  const englishOnly = english.filter((e) => !translatedKeys.has(e.translationKey));
  return (
    <Container className="py-10">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: `/${locale}` }, { name: title, href: `/${locale}${path}` }]} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">{sub}</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <li key={a.id}>
            <Link href={articlePath(a)} className="flex h-full flex-col rounded-2xl border border-line bg-card p-5 transition hover:border-accent">
              <h2 className="font-semibold leading-snug">{a.title}</h2>
              {a.excerpt && <p className="mt-2 text-sm text-fg-muted">{a.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>
      {englishOnly.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">{d.common.onlyInEnglish}</h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {englishOnly.map((a) => (
              <li key={a.id}>
                <Link href={articlePath(a)} hrefLang="en" className="text-accent-strong underline underline-offset-2">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {type === "learn" && (
        <div className="mt-10">
          <SeedWarning d={d} />
        </div>
      )}
    </Container>
  );
}
