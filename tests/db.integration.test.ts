/**
 * Integration tests against a real PostgreSQL database.
 * Runs only when TEST_DATABASE_URL is set (it is DROPPED and recreated — never point it at real data).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("database (integration)", () => {
  let db: typeof import("@/lib/db");

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    process.env.CONTENT_PREVIEW = "false";
    db = await import("@/lib/db");
    await db.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
    await db.query(readFileSync(path.join(process.cwd(), "db/migrations/001_init.sql"), "utf8"));
    const { products, manufacturers } = await import("../content/products");
    const m = manufacturers[0];
    await db.query(`INSERT INTO manufacturers (slug, name, hq_country, website) VALUES ($1,$2,$3,$4)`, [m.slug, m.name, m.hqCountry, m.website]);
    const { productDataSchema } = await import("@/lib/schemas");
    const p = products.find((x) => x.manufacturerSlug === m.slug)!;
    await db.query(`INSERT INTO products (slug, manufacturer_slug, model, status, data) VALUES ($1,$2,$3,'published',$4), ('hidden',$2,'Hidden','review',$4)`, [
      p.slug,
      m.slug,
      p.model,
      JSON.stringify(productDataSchema.parse(p.data)),
    ]);
  });

  afterAll(async () => {
    await db?.pool().end();
  });

  it("only exposes published products outside preview mode", async () => {
    const { listPublicProducts } = await import("@/lib/repo/products");
    const list = await listPublicProducts();
    expect(list.map((p) => p.slug)).not.toContain("hidden");
    expect(list.length).toBe(1);
  });

  it("round-trips articles with translations", async () => {
    const { saveArticle, getTranslations, getPublicArticle } = await import("@/lib/repo/articles");
    const base = { type: "learn" as const, translationKey: "k1", metaTitle: null, metaDescription: null, excerpt: null, body: "Hi", authorId: null, productSlugs: [], data: { faqs: [], picks: [], sources: [], verdict: "", noindex: false }, reviewedAt: "2026-10-13" };
    const id = await saveArticle(null, { ...base, locale: "en", slug: "hello", title: "Hello", status: "published" });
    await saveArticle(null, { ...base, locale: "de", slug: "hallo", title: "Hallo", status: "draft" });
    expect(await getPublicArticle("learn", "en", "hello")).not.toBeNull();
    expect(await getPublicArticle("learn", "de", "hallo")).toBeNull(); // draft is not public
    expect((await getTranslations("k1")).map((t) => t.locale)).toEqual(["en"]);
    const [row] = await db.query<{ published_at: Date | null }>(`SELECT published_at FROM articles WHERE id = $1`, [id]);
    expect(row.published_at).not.toBeNull();
  });

  it("records anonymous clicks and summarises them", async () => {
    const { recordClick } = await import("@/lib/repo/links");
    const { clickSummary } = await import("@/lib/repo/analytics");
    const [{ slug }] = await db.query<{ slug: string }>(`SELECT slug FROM products WHERE status = 'published'`);
    await recordClick({ productSlug: slug, linkId: null, country: "GB", locale: "en", pagePath: "/en", placement: "test", device: "desktop", isAffiliate: false });
    const s = await clickSummary(7);
    expect(s.total).toBe(1);
    expect(s.byDay).toHaveLength(7);
    expect(s.byCountry).toEqual([{ country: "GB", clicks: 1 }]);
    const cols = await db.query<{ column_name: string }>(`SELECT column_name FROM information_schema.columns WHERE table_name = 'outbound_clicks'`);
    expect(cols.map((c) => c.column_name)).not.toContain("ip");
  });

  it("imports traffic metrics idempotently", async () => {
    const { upsertTraffic, trafficSummary } = await import("@/lib/repo/analytics");
    const today = new Date().toISOString().slice(0, 10);
    const row = { day: today, source: "gsc", pagePath: "/en", query: "", sessions: null, impressions: 100, clicks: 5, position: 4 };
    await upsertTraffic([row]);
    await upsertTraffic([{ ...row, clicks: 6 }]);
    const t = await trafficSummary(7);
    expect(t.clicks).toBe(6);
    expect(t.impressions).toBe(100);
  });
});
