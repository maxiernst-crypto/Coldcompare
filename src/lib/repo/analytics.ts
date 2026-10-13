import { query } from "../db";

export interface ClickSummary {
  total: number;
  affiliate: number;
  byDay: { day: string; clicks: number }[];
  byProduct: { product: string; clicks: number }[];
  byCountry: { country: string; clicks: number }[];
  byPage: { page: string; clicks: number }[];
  byPlacement: { placement: string; clicks: number }[];
}

export async function clickSummary(days: number): Promise<ClickSummary> {
  const since = `now() - ($1::int * interval '1 day')`;
  const [tot, byDay, byProduct, byCountry, byPage, byPlacement] = await Promise.all([
    query<{ total: string; affiliate: string }>(
      `SELECT count(*) AS total, count(*) FILTER (WHERE is_affiliate) AS affiliate FROM outbound_clicks WHERE clicked_at >= ${since}`,
      [days],
    ),
    query<{ day: string; clicks: string }>(
      `SELECT to_char(d, 'YYYY-MM-DD') AS day, COALESCE(c.n, 0) AS clicks
       FROM generate_series((now() - ($1::int - 1) * interval '1 day')::date, now()::date, interval '1 day') d
       LEFT JOIN (SELECT clicked_at::date AS day, count(*) AS n FROM outbound_clicks WHERE clicked_at >= ${since} GROUP BY 1) c ON c.day = d::date
       ORDER BY d`,
      [days],
    ),
    query<{ product: string; clicks: string }>(
      `SELECT product_slug AS product, count(*) AS clicks FROM outbound_clicks WHERE clicked_at >= ${since} GROUP BY 1 ORDER BY 2 DESC LIMIT 20`,
      [days],
    ),
    query<{ country: string; clicks: string }>(
      `SELECT COALESCE(country, '?') AS country, count(*) AS clicks FROM outbound_clicks WHERE clicked_at >= ${since} GROUP BY 1 ORDER BY 2 DESC`,
      [days],
    ),
    query<{ page: string; clicks: string }>(
      `SELECT COALESCE(page_path, '(unknown)') AS page, count(*) AS clicks FROM outbound_clicks WHERE clicked_at >= ${since} GROUP BY 1 ORDER BY 2 DESC LIMIT 20`,
      [days],
    ),
    query<{ placement: string; clicks: string }>(
      `SELECT COALESCE(placement, '(none)') AS placement, count(*) AS clicks FROM outbound_clicks WHERE clicked_at >= ${since} GROUP BY 1 ORDER BY 2 DESC`,
      [days],
    ),
  ]);
  const n = (v: string) => Number(v);
  return {
    total: n(tot[0]?.total ?? "0"),
    affiliate: n(tot[0]?.affiliate ?? "0"),
    byDay: byDay.map((r) => ({ day: r.day, clicks: n(r.clicks) })),
    byProduct: byProduct.map((r) => ({ product: r.product, clicks: n(r.clicks) })),
    byCountry: byCountry.map((r) => ({ country: r.country, clicks: n(r.clicks) })),
    byPage: byPage.map((r) => ({ page: r.page, clicks: n(r.clicks) })),
    byPlacement: byPlacement.map((r) => ({ placement: r.placement, clicks: n(r.clicks) })),
  };
}

export interface RevenueRow {
  id: string;
  periodStart: string;
  periodEnd: string;
  network: string;
  productSlug: string | null;
  country: string | null;
  orders: number;
  revenue: number;
  currency: string;
  note: string | null;
}

export async function listRevenue(days: number): Promise<RevenueRow[]> {
  const rows = await query<{
    id: string;
    period_start: string;
    period_end: string;
    network: string;
    product_slug: string | null;
    country: string | null;
    orders: number;
    revenue: string;
    currency: string;
    note: string | null;
  }>(`SELECT * FROM revenue_reports WHERE period_end >= (now() - ($1::int * interval '1 day'))::date ORDER BY period_start DESC`, [days]);
  return rows.map((r) => ({
    id: r.id,
    periodStart: r.period_start,
    periodEnd: r.period_end,
    network: r.network,
    productSlug: r.product_slug,
    country: r.country,
    orders: r.orders,
    revenue: Number(r.revenue),
    currency: r.currency,
    note: r.note,
  }));
}

export async function addRevenue(r: Omit<RevenueRow, "id">): Promise<void> {
  await query(
    `INSERT INTO revenue_reports (period_start, period_end, network, product_slug, country, orders, revenue, currency, note)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [r.periodStart, r.periodEnd, r.network, r.productSlug, r.country, r.orders, r.revenue, r.currency, r.note],
  );
}

export async function deleteRevenue(id: string): Promise<void> {
  await query(`DELETE FROM revenue_reports WHERE id = $1`, [id]);
}

export interface TrafficSummary {
  sessions: number;
  impressions: number;
  clicks: number;
  avgPosition: number | null;
  topPages: { page: string; clicks: number; impressions: number; ctr: number; position: number | null }[];
  topQueries: { query: string; clicks: number; impressions: number; position: number | null }[];
}

export async function trafficSummary(days: number): Promise<TrafficSummary> {
  const since = `(now() - ($1::int * interval '1 day'))::date`;
  const [tot, sess, pages, queries] = await Promise.all([
    query<{ impressions: string | null; clicks: string | null; pos: string | null }>(
      `SELECT sum(impressions) AS impressions, sum(clicks) AS clicks,
              sum(position * impressions) / NULLIF(sum(impressions) FILTER (WHERE position IS NOT NULL), 0) AS pos
       FROM traffic_metrics WHERE source = 'gsc' AND query = '' AND day >= ${since}`,
      [days],
    ),
    query<{ sessions: string | null }>(
      `SELECT sum(sessions) AS sessions FROM traffic_metrics WHERE source IN ('ga4','plausible','manual') AND day >= ${since}`,
      [days],
    ),
    query<{ page: string; clicks: string; impressions: string; pos: string | null }>(
      `SELECT page_path AS page, sum(clicks) AS clicks, sum(impressions) AS impressions,
              sum(position * impressions) / NULLIF(sum(impressions), 0) AS pos
       FROM traffic_metrics WHERE source = 'gsc' AND query = '' AND page_path <> '*' AND day >= ${since}
       GROUP BY 1 ORDER BY 2 DESC LIMIT 20`,
      [days],
    ),
    query<{ query: string; clicks: string; impressions: string; pos: string | null }>(
      `SELECT query, sum(clicks) AS clicks, sum(impressions) AS impressions, sum(position * impressions) / NULLIF(sum(impressions), 0) AS pos
       FROM traffic_metrics WHERE source = 'gsc' AND query <> '' AND day >= ${since} GROUP BY 1 ORDER BY 3 DESC LIMIT 25`,
      [days],
    ),
  ]);
  const num = (v: string | null | undefined) => (v == null ? 0 : Number(v));
  return {
    sessions: num(sess[0]?.sessions),
    impressions: num(tot[0]?.impressions),
    clicks: num(tot[0]?.clicks),
    avgPosition: tot[0]?.pos == null ? null : Math.round(Number(tot[0].pos) * 10) / 10,
    topPages: pages.map((p) => {
      const clicks = num(p.clicks);
      const impressions = num(p.impressions);
      return { page: p.page, clicks, impressions, ctr: impressions ? clicks / impressions : 0, position: p.pos == null ? null : Math.round(Number(p.pos) * 10) / 10 };
    }),
    topQueries: queries.map((q) => ({ query: q.query, clicks: num(q.clicks), impressions: num(q.impressions), position: q.pos == null ? null : Math.round(Number(q.pos) * 10) / 10 })),
  };
}

export async function upsertTraffic(rows: { day: string; source: string; pagePath: string; query: string; sessions: number | null; impressions: number | null; clicks: number | null; position: number | null }[]): Promise<number> {
  let n = 0;
  for (const r of rows) {
    await query(
      `INSERT INTO traffic_metrics (day, source, page_path, query, sessions, impressions, clicks, position)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (day, source, page_path, query) DO UPDATE SET sessions = EXCLUDED.sessions, impressions = EXCLUDED.impressions,
         clicks = EXCLUDED.clicks, position = EXCLUDED.position`,
      [r.day, r.source, r.pagePath, r.query, r.sessions, r.impressions, r.clicks, r.position],
    );
    n++;
  }
  return n;
}
