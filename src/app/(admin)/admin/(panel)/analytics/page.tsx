import Link from "next/link";
import { Btn, inputCls, Notice, PageTitle, Stat } from "@/components/admin-ui";
import { DailyBars, RankBars } from "@/components/charts";
import { can } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { clickSummary, listRevenue, trafficSummary } from "@/lib/repo/analytics";
import { importTrafficAction } from "../../actions";

export default async function AnalyticsAdmin({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const user = await requirePermission("analytics.view");
  const sp = await searchParams;
  const days = [7, 30, 90, 365].includes(Number(sp.days)) ? Number(sp.days) : 30;
  const [clicks, traffic, revenue] = await Promise.all([clickSummary(days), trafficSummary(days), listRevenue(days)]);
  const revByCur = revenue.reduce<Record<string, number>>((acc, r) => ((acc[r.currency] = (acc[r.currency] ?? 0) + r.revenue), acc), {});
  const orders = revenue.reduce((s, r) => s + r.orders, 0);
  const mainCur = Object.entries(revByCur).sort((a, b) => b[1] - a[1])[0];
  const rpm = mainCur && traffic.sessions ? (mainCur[1] / traffic.sessions) * 1000 : null;
  const ctr = traffic.impressions ? (traffic.clicks / traffic.impressions) * 100 : null;
  const convRate = clicks.affiliate ? (orders / clicks.affiliate) * 100 : null;
  const revByProduct = Object.entries(revenue.reduce<Record<string, number>>((a, r) => ((a[r.productSlug ?? "(all)"] = (a[r.productSlug ?? "(all)"] ?? 0) + r.revenue), a), {}))
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value: Math.round(value) }));
  const revByCountry = Object.entries(revenue.reduce<Record<string, number>>((a, r) => ((a[r.country ?? "(all)"] = (a[r.country ?? "(all)"] ?? 0) + r.revenue), a), {}))
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value: Math.round(value) }));

  return (
    <div>
      <PageTitle
        title="Analytics"
        sub="Outbound clicks are measured first-party without personal data. Search and session metrics come from imported Search Console / GA4 / Plausible exports."
        action={
          <div className="flex gap-1 text-sm">
            {[7, 30, 90, 365].map((d) => (
              <Link key={d} href={`/admin/analytics?days=${d}`} className={`rounded-md px-3 py-1 ${d === days ? "bg-fg text-bg" : "border border-line"}`}>
                {d}d
              </Link>
            ))}
          </div>
        }
      />
      <Notice sp={sp} />
      {sp.imported && <p className="mb-4 rounded-lg bg-ok-soft p-3 text-sm text-ok">Imported {sp.imported} rows.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Organic clicks (GSC)" value={traffic.clicks.toLocaleString("en-GB")} sub={`${traffic.impressions.toLocaleString("en-GB")} impressions · CTR ${ctr == null ? "—" : `${ctr.toFixed(1)}%`}`} />
        <Stat label="Avg. position (GSC)" value={traffic.avgPosition ?? "—"} sub="impression-weighted" />
        <Stat label="Outbound clicks" value={clicks.total} sub={`${clicks.affiliate} affiliate · conv. ${convRate == null ? "—" : `${convRate.toFixed(1)}%`} (reported orders)`} />
        <Stat
          label="Revenue per 1,000 sessions"
          value={rpm == null ? "—" : `${rpm.toFixed(2)} ${mainCur?.[0]}`}
          sub={`${traffic.sessions.toLocaleString("en-GB")} sessions · ${Object.entries(revByCur).map(([c, v]) => `${v.toFixed(2)} ${c}`).join(" + ") || "no revenue reported"}`}
        />
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-card p-5">
        <DailyBars data={clicks.byDay} label={`Outbound clicks per day (last ${days} days)`} />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RankBars title="Clicks by wallet" rows={clicks.byProduct.map((r) => ({ label: r.product, value: r.clicks }))} />
        <RankBars title="Clicks by country" rows={clicks.byCountry.map((r) => ({ label: r.country, value: r.clicks }))} />
        <RankBars title="Top content by outbound clicks" rows={clicks.byPage.map((r) => ({ label: r.page, value: r.clicks }))} />
        <RankBars title="Clicks by placement" rows={clicks.byPlacement.map((r) => ({ label: r.placement, value: r.clicks }))} />
        <RankBars title="Reported revenue by wallet" rows={revByProduct} empty="Add revenue under Revenue." />
        <RankBars title="Reported revenue by country" rows={revByCountry} empty="Add revenue under Revenue." />
        <RankBars title="Top pages (organic clicks)" rows={traffic.topPages.map((p) => ({ label: p.page, value: p.clicks, sub: `pos ${p.position ?? "—"}` }))} empty="Import a Search Console 'Pages' export." />
        <RankBars title="Top queries (impressions)" rows={traffic.topQueries.map((q) => ({ label: q.query, value: q.impressions, sub: `pos ${q.position ?? "—"}` }))} empty="Import a Search Console 'Queries' export with a page/date column." />
      </div>

      {can(user.role, "revenue.manage") && (
        <section className="mt-6 rounded-2xl border border-line bg-card p-5">
          <h2 className="font-semibold">Import metrics (CSV)</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Columns (case-insensitive): <code>date</code> (required, YYYY-MM-DD), <code>page</code>, <code>query</code>, <code>clicks</code>, <code>impressions</code>, <code>position</code>, <code>sessions</code>. Re-importing the same day/page/query
            overwrites it.
          </p>
          <form action={importTrafficAction} className="mt-3 flex flex-wrap items-end gap-3">
            <select name="source" className={`${inputCls} w-auto`}>
              <option value="gsc">Google Search Console</option>
              <option value="ga4">Google Analytics 4</option>
              <option value="plausible">Plausible / privacy analytics</option>
              <option value="manual">Manual</option>
            </select>
            <input type="file" name="file" accept=".csv,text/csv" className="text-sm" />
            <Btn type="submit">Import</Btn>
          </form>
        </section>
      )}
    </div>
  );
}
