import type { MetadataRoute } from "next";
import { listAllPublicArticles } from "@/lib/repo/articles";
import { listPublicProducts } from "@/lib/repo/products";
import { articlePath } from "@/lib/resolve";
import { LOCALES } from "@/lib/schemas";
import { absolute } from "@/lib/site";
import { isPreviewMode } from "@/lib/visibility";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isPreviewMode()) return []; // preview environments are not indexed
  const [products, articles] = await Promise.all([listPublicProducts(), listAllPublicArticles()]);
  const langs = (path: string) => ({ languages: Object.fromEntries(LOCALES.map((l) => [l, absolute(`/${l}${path}`)])) });
  const entries: MetadataRoute.Sitemap = [];

  for (const path of ["", "/compare", "/wallets", "/best", "/learn", "/quiz", "/compare/head-to-head"]) {
    for (const l of LOCALES) entries.push({ url: absolute(`/${l}${path}`), changeFrequency: "weekly", priority: path === "" ? 1 : 0.8, alternates: langs(path) });
  }
  for (const p of products) {
    for (const l of LOCALES) entries.push({ url: absolute(`/${l}/wallets/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "weekly", priority: 0.9, alternates: langs(`/wallets/${p.slug}`) });
  }
  const byKey = new Map<string, typeof articles>();
  for (const a of articles) byKey.set(a.translationKey, [...(byKey.get(a.translationKey) ?? []), a]);
  for (const a of articles) {
    if (a.type === "review" || a.data.noindex) continue; // reviews live on /wallets/<slug>
    const siblings = byKey.get(a.translationKey) ?? [];
    entries.push({
      url: absolute(articlePath(a)),
      lastModified: a.updatedAt,
      changeFrequency: "monthly",
      priority: a.type === "page" ? 0.3 : 0.7,
      alternates: siblings.length > 1 ? { languages: Object.fromEntries(siblings.map((s) => [s.locale, absolute(articlePath(s))])) } : undefined,
    });
  }
  return entries;
}
