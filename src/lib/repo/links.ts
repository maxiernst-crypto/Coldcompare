import { query, queryOne, toIso } from "../db";
import type { AffiliateLink } from "../schemas";

interface LinkRow {
  id: string;
  product_slug: string;
  country: string;
  retailer: string;
  is_official: boolean;
  network: string;
  url: string;
  is_affiliate: boolean;
  status: AffiliateLink["status"];
  add_utm: boolean;
  priority: number;
  commission_note: string | null;
  last_checked_at: Date | null;
  last_status_code: number | null;
  last_check_error: string | null;
}

function mapRow(r: LinkRow): AffiliateLink {
  return {
    id: r.id,
    productSlug: r.product_slug,
    country: r.country,
    retailer: r.retailer,
    isOfficial: r.is_official,
    network: r.network,
    url: r.url,
    isAffiliate: r.is_affiliate,
    status: r.status,
    addUtm: r.add_utm,
    priority: r.priority,
    commissionNote: r.commission_note,
    lastCheckedAt: toIso(r.last_checked_at),
    lastStatusCode: r.last_status_code,
    lastCheckError: r.last_check_error,
  };
}

export async function listLinksForProduct(productSlug: string): Promise<AffiliateLink[]> {
  const rows = await query<LinkRow>(`SELECT * FROM affiliate_links WHERE product_slug = $1 ORDER BY country, priority DESC`, [productSlug]);
  return rows.map(mapRow);
}

export async function listAllLinks(): Promise<AffiliateLink[]> {
  const rows = await query<LinkRow>(`SELECT * FROM affiliate_links ORDER BY product_slug, country, priority DESC`);
  return rows.map(mapRow);
}

export async function getLink(id: string): Promise<AffiliateLink | null> {
  const row = await queryOne<LinkRow>(`SELECT * FROM affiliate_links WHERE id = $1`, [id]);
  return row ? mapRow(row) : null;
}

export type LinkInput = Omit<AffiliateLink, "id" | "lastCheckedAt" | "lastStatusCode" | "lastCheckError">;

export async function saveLink(id: string | null, l: LinkInput): Promise<string> {
  const p = [l.productSlug, l.country, l.retailer, l.isOfficial, l.network, l.url, l.isAffiliate, l.status, l.addUtm, l.priority, l.commissionNote];
  if (id) {
    await query(
      `UPDATE affiliate_links SET product_slug=$1, country=$2, retailer=$3, is_official=$4, network=$5, url=$6, is_affiliate=$7,
         status=$8, add_utm=$9, priority=$10, commission_note=$11, updated_at=now() WHERE id=$12`,
      [...p, id],
    );
    return id;
  }
  const row = await queryOne<{ id: string }>(
    `INSERT INTO affiliate_links (product_slug, country, retailer, is_official, network, url, is_affiliate, status, add_utm, priority, commission_note)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    p,
  );
  return row!.id;
}

export async function deleteLink(id: string): Promise<void> {
  await query(`DELETE FROM affiliate_links WHERE id = $1`, [id]);
}

export async function recordLinkCheck(id: string, statusCode: number | null, error: string | null): Promise<void> {
  await query(`UPDATE affiliate_links SET last_checked_at = now(), last_status_code = $2, last_check_error = $3 WHERE id = $1`, [id, statusCode, error]);
}

export async function recordClick(c: {
  productSlug: string;
  linkId: string | null;
  country: string;
  locale: string | null;
  pagePath: string | null;
  placement: string | null;
  device: string;
  isAffiliate: boolean;
}): Promise<void> {
  await query(
    `INSERT INTO outbound_clicks (product_slug, link_id, country, locale, page_path, placement, device, is_affiliate)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [c.productSlug, c.linkId, c.country, c.locale, c.pagePath, c.placement, c.device, c.isAffiliate],
  );
}

/** Check a URL is reachable. HEAD first (cheap), GET fallback for servers that reject HEAD. */
export async function checkUrl(url: string, timeoutMs = 10000): Promise<{ status: number | null; error: string | null }> {
  const attempt = async (method: "HEAD" | "GET") => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { method, redirect: "follow", signal: ctrl.signal, headers: { "user-agent": "ColdCompareLinkChecker/1.0" } });
      return res.status;
    } finally {
      clearTimeout(t);
    }
  };
  try {
    let status = await attempt("HEAD");
    if (status === 405 || status === 403 || status === 501) status = await attempt("GET");
    return { status, error: null };
  } catch (e) {
    return { status: null, error: e instanceof Error ? e.message : String(e) };
  }
}
