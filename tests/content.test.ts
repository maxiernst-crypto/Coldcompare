import { describe, expect, it } from "vitest";
import { articles } from "../content/articles";
import { manufacturers, products } from "../content/products";
import { splitShortcodes, SLUG } from "./content-helpers";
import { productDataSchema } from "@/lib/schemas";

const productSlugs = new Set(products.map((p) => p.slug));

describe("seed content integrity", () => {
  it("has at least 10 structured wallet profiles, all valid against the schema", () => {
    expect(products.length).toBeGreaterThanOrEqual(10);
    for (const p of products) expect(() => productDataSchema.parse(p.data), p.slug).not.toThrow();
  });

  it("every product references a known manufacturer", () => {
    const m = new Set<string>(manufacturers.map((x) => x.slug));
    for (const p of products) expect(m.has(p.manufacturerSlug), p.slug).toBe(true);
  });

  it("never marks seeded prices as verified (they must be confirmed by an editor)", () => {
    for (const p of products) expect(p.data.factStatus?.price, p.slug).not.toBe("verified");
  });

  it("meets the launch content targets", () => {
    const count = (type: string) => articles.filter((a) => a.type === type && a.locale === "en").length;
    expect(count("review")).toBeGreaterThanOrEqual(5);
    expect(count("comparison")).toBeGreaterThanOrEqual(5);
    expect(count("guide")).toBeGreaterThanOrEqual(5);
    expect(count("learn")).toBeGreaterThanOrEqual(10);
    for (const s of ["about", "methodology", "affiliate-disclosure"]) expect(articles.some((a) => a.type === "page" && a.slug === s)).toBe(true);
  });

  it("no seeded content is pre-published: it awaits human editorial verification", () => {
    for (const a of articles) expect(a.status ?? "review", a.slug).not.toBe("published");
  });

  it("all shortcodes, picks and product references point to existing wallets", () => {
    for (const a of articles) {
      for (const s of a.productSlugs ?? []) expect(productSlugs.has(s), `${a.slug}: ${s}`).toBe(true);
      for (const p of a.data?.picks ?? []) expect(productSlugs.has(p.product), `${a.slug}: pick ${p.product}`).toBe(true);
      for (const b of splitShortcodes(a.body)) {
        if (b.type === "table") for (const s of b.slugs) expect(productSlugs.has(s), `${a.slug}: table ${s}`).toBe(true);
        if (b.type === "product") expect(productSlugs.has(b.slug), `${a.slug}: product ${b.slug}`).toBe(true);
      }
    }
  });

  it("slugs are valid and unique per type and locale; translation keys unique per locale", () => {
    const seen = new Set<string>();
    const tk = new Set<string>();
    for (const a of articles) {
      expect(SLUG.test(a.slug), a.slug).toBe(true);
      const k = `${a.type}/${a.locale}/${a.slug}`;
      expect(seen.has(k), k).toBe(false);
      seen.add(k);
      const t = `${a.translationKey}/${a.locale}`;
      expect(tk.has(t), t).toBe(false);
      tk.add(t);
    }
  });

  it("internal links point to routes that exist", () => {
    const valid = new Set<string>();
    for (const a of articles) {
      const section = { review: "wallets", comparison: "compare", guide: "best", learn: "learn", page: "" }[a.type];
      valid.add(`/${a.locale}${section ? `/${section}` : ""}/${a.slug}`);
    }
    for (const l of ["en", "de"]) {
      for (const p of ["", "/compare", "/wallets", "/best", "/learn", "/quiz", "/compare/head-to-head"]) valid.add(`/${l}${p}`);
      for (const s of productSlugs) valid.add(`/${l}/wallets/${s}`);
    }
    const broken: string[] = [];
    for (const a of articles) {
      for (const m of a.body.matchAll(/\]\((\/[^)\s?#]+)/g)) if (!valid.has(m[1])) broken.push(`${a.locale}/${a.slug} → ${m[1]}`);
    }
    expect(broken).toEqual([]);
  });

  it("does not claim hands-on testing", () => {
    const claims = /\b(we tested|in our tests|our testing showed|hands-on test(?:ed|ing) (?:showed|revealed))\b/i;
    for (const a of articles) expect(claims.test(a.body), a.slug).toBe(false);
  });

  it("meta descriptions stay within 170 characters", () => {
    for (const a of articles) if (a.metaDescription) expect(a.metaDescription.length, a.slug).toBeLessThanOrEqual(170);
  });
});
