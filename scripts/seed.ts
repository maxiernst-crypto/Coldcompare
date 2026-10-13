import "./env";
import { pool } from "../src/lib/db";
import { hashPassword, passwordProblem } from "../src/lib/auth/crypto";
import { productDataSchema, articleDataSchema } from "../src/lib/schemas";
import { DEFAULT_WEIGHTS } from "../src/lib/scoring";
import { DEFAULT_SETTINGS } from "../src/lib/repo/settings";
import { manufacturers, products, SEED_CHECKED_AT } from "../content/products";
import { articles, authors } from "../content/articles";

/**
 * Idempotent seed. Existing rows are left untouched so admin edits are never overwritten.
 * Pass --force to overwrite seeded products and articles with the versions in /content.
 */
const force = process.argv.includes("--force");

async function main() {
  const db = pool();
  const conflict = (cols: string) => (force ? `DO UPDATE SET ${cols}` : "DO NOTHING");

  for (const a of authors) {
    await db.query(
      `INSERT INTO authors (id, name, role, bio, is_placeholder) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) ${conflict("name=EXCLUDED.name, role=EXCLUDED.role, bio=EXCLUDED.bio, is_placeholder=EXCLUDED.is_placeholder")}`,
      [a.id, a.name, JSON.stringify(a.role), JSON.stringify(a.bio), a.isPlaceholder],
    );
  }

  for (const m of manufacturers) {
    await db.query(
      `INSERT INTO manufacturers (slug, name, hq_country, website, description) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (slug) ${conflict("name=EXCLUDED.name, hq_country=EXCLUDED.hq_country, website=EXCLUDED.website, description=EXCLUDED.description")}`,
      [m.slug, m.name, m.hqCountry, m.website, JSON.stringify(m.description)],
    );
  }

  for (const p of products) {
    const data = productDataSchema.parse(p.data);
    // last_verified_at stays NULL: specs were researched (see priceCheckedAt) but not yet verified by an editor.
    await db.query(
      `INSERT INTO products (slug, manufacturer_slug, model, status, data, last_verified_at) VALUES ($1,$2,$3,$4,$5,NULL)
       ON CONFLICT (slug) ${conflict("manufacturer_slug=EXCLUDED.manufacturer_slug, model=EXCLUDED.model, status=EXCLUDED.status, data=EXCLUDED.data, updated_at=now()")}`,
      [p.slug, p.manufacturerSlug, p.model, p.status, JSON.stringify(data)],
    );
    // One clearly-labelled placeholder per product: the official store, not an affiliate link.
    const existing = await db.query(`SELECT 1 FROM affiliate_links WHERE product_slug = $1 LIMIT 1`, [p.slug]);
    if (existing.rowCount === 0) {
      await db.query(
        `INSERT INTO affiliate_links (product_slug, country, retailer, is_official, network, url, is_affiliate, status, add_utm, priority, commission_note)
         VALUES ($1,'*','Official store',TRUE,'none',$2,FALSE,'placeholder',FALSE,0,'PLACEHOLDER — no affiliate agreement yet. Replace URL and set is_affiliate once an agreement exists.')`,
        [p.slug, data.officialUrl],
      );
    }
  }

  for (const a of articles) {
    const data = articleDataSchema.parse(a.data ?? {});
    await db.query(
      `INSERT INTO articles (type, locale, slug, translation_key, title, meta_title, meta_description, excerpt, body, status, author_id, product_slugs, data, reviewed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NULL)
       ON CONFLICT (type, locale, slug) ${conflict(
         "translation_key=EXCLUDED.translation_key, title=EXCLUDED.title, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, excerpt=EXCLUDED.excerpt, body=EXCLUDED.body, status=EXCLUDED.status, author_id=EXCLUDED.author_id, product_slugs=EXCLUDED.product_slugs, data=EXCLUDED.data, updated_at=now()",
       )}`,
      [a.type, a.locale, a.slug, a.translationKey, a.title, a.metaTitle ?? null, a.metaDescription ?? null, a.excerpt ?? null, a.body.trim(), a.status ?? "review", a.authorId ?? "editorial-team", a.productSlugs ?? [], JSON.stringify(data)],
    );
  }

  await db.query(`INSERT INTO settings (key, value) VALUES ('scoring_weights', $1) ON CONFLICT (key) DO NOTHING`, [JSON.stringify(DEFAULT_WEIGHTS)]);
  await db.query(`INSERT INTO settings (key, value) VALUES ('site', $1) ON CONFLICT (key) DO NOTHING`, [JSON.stringify(DEFAULT_SETTINGS)]);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const users = await db.query(`SELECT 1 FROM users LIMIT 1`);
    if (users.rowCount === 0) {
      const problem = passwordProblem(password);
      if (problem) throw new Error(`ADMIN_PASSWORD: ${problem}`);
      await db.query(`INSERT INTO users (email, name, role, password_hash) VALUES ($1,'Administrator','admin',$2)`, [email.toLowerCase(), await hashPassword(password)]);
      console.log(`created first admin ${email}`);
    }
  }

  console.log(`seeded ${manufacturers.length} manufacturers, ${products.length} products, ${articles.length} articles (research date ${SEED_CHECKED_AT})${force ? " [force]" : ""}`);
  await db.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
