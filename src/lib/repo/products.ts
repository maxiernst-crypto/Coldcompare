import { cache } from "react";
import { query, queryOne, toDateString, toIso } from "../db";
import { productDataSchema, type ContentStatus, type Manufacturer, type Product, type ProductData } from "../schemas";
import { visibleStatuses } from "../visibility";

interface ProductRow {
  slug: string;
  manufacturer_slug: string;
  model: string;
  status: ContentStatus;
  data: unknown;
  last_verified_at: string | null;
  updated_at: Date;
  m_name: string;
  m_hq_country: string;
  m_website: string;
  m_description: Manufacturer["description"];
}

const SELECT = `
  SELECT p.slug, p.manufacturer_slug, p.model, p.status, p.data, p.last_verified_at, p.updated_at,
         m.name AS m_name, m.hq_country AS m_hq_country, m.website AS m_website, m.description AS m_description
  FROM products p JOIN manufacturers m ON m.slug = p.manufacturer_slug`;

function mapRow(r: ProductRow): Product {
  return {
    slug: r.slug,
    manufacturerSlug: r.manufacturer_slug,
    model: r.model,
    status: r.status,
    data: productDataSchema.parse(r.data),
    lastVerifiedAt: toDateString(r.last_verified_at),
    updatedAt: toIso(r.updated_at) ?? "",
    manufacturer: {
      slug: r.manufacturer_slug,
      name: r.m_name,
      hqCountry: r.m_hq_country,
      website: r.m_website,
      description: r.m_description,
    },
  };
}

/** Products visible on the public site (published, plus "review" in preview mode). */
export const listPublicProducts = cache(async (): Promise<Product[]> => {
  const rows = await query<ProductRow>(`${SELECT} WHERE p.status = ANY($1) ORDER BY m.name, p.model`, [visibleStatuses()]);
  return rows.map(mapRow);
});

export const getPublicProduct = cache(async (slug: string): Promise<Product | null> => {
  const row = await queryOne<ProductRow>(`${SELECT} WHERE p.slug = $1 AND p.status = ANY($2)`, [slug, visibleStatuses()]);
  return row ? mapRow(row) : null;
});

export async function listAllProducts(): Promise<Product[]> {
  const rows = await query<ProductRow>(`${SELECT} ORDER BY m.name, p.model`);
  return rows.map(mapRow);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const row = await queryOne<ProductRow>(`${SELECT} WHERE p.slug = $1`, [slug]);
  return row ? mapRow(row) : null;
}

export async function listManufacturers(): Promise<Manufacturer[]> {
  const rows = await query<{ slug: string; name: string; hq_country: string; website: string; description: Manufacturer["description"] }>(
    `SELECT slug, name, hq_country, website, description FROM manufacturers ORDER BY name`,
  );
  return rows.map((r) => ({ slug: r.slug, name: r.name, hqCountry: r.hq_country, website: r.website, description: r.description }));
}

export async function upsertProduct(input: {
  slug: string;
  manufacturerSlug: string;
  model: string;
  status: ContentStatus;
  data: ProductData;
  lastVerifiedAt: string | null;
}): Promise<void> {
  const data = productDataSchema.parse(input.data);
  await query(
    `INSERT INTO products (slug, manufacturer_slug, model, status, data, last_verified_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (slug) DO UPDATE SET manufacturer_slug = EXCLUDED.manufacturer_slug, model = EXCLUDED.model,
       status = EXCLUDED.status, data = EXCLUDED.data, last_verified_at = EXCLUDED.last_verified_at, updated_at = now()`,
    [input.slug, input.manufacturerSlug, input.model, input.status, JSON.stringify(data), input.lastVerifiedAt],
  );
}

export async function deleteProduct(slug: string): Promise<void> {
  await query(`DELETE FROM products WHERE slug = $1`, [slug]);
}
