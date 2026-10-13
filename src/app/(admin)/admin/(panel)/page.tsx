import Link from "next/link";
import { Notice, PageTitle, Stat, StatusPill } from "@/components/admin-ui";
import { requireUser } from "@/lib/auth/session";
import { query } from "@/lib/db";
import { clickSummary } from "@/lib/repo/analytics";
import { listAuthors } from "@/lib/repo/articles";
import { getSiteSettings } from "@/lib/repo/settings";
import { can } from "@/lib/auth/permissions";

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const [statusRows, queue, links, settings, authors, clicks, stale] = await Promise.all([
    query<{ kind: string; status: string; n: string }>(
      `SELECT 'product' AS kind, status::text, count(*) AS n FROM products GROUP BY status
       UNION ALL SELECT 'article', status::text, count(*) FROM articles GROUP BY status`,
    ),
    query<{ kind: string; id: string; title: string; status: string; updated_at: Date }>(
      `SELECT 'article' AS kind, id::text, title || ' (' || locale || ')' AS title, status::text, updated_at FROM articles WHERE status = 'review'
       UNION ALL SELECT 'product', slug, model, status::text, updated_at FROM products WHERE status = 'review'
       ORDER BY updated_at DESC LIMIT 15`,
    ),
    query<{ placeholders: string; broken: string; affiliate: string }>(
      `SELECT count(*) FILTER (WHERE status = 'placeholder') AS placeholders,
              count(*) FILTER (WHERE last_status_code >= 400 OR last_check_error IS NOT NULL) AS broken,
              count(*) FILTER (WHERE is_affiliate AND status = 'active') AS affiliate FROM affiliate_links`,
    ),
    getSiteSettings(),
    listAuthors(),
    can(user.role, "analytics.view") ? clickSummary(30) : Promise.resolve(null),
    query<{ slug: string; model: string; last_verified_at: string | null }>(
      `SELECT slug, model, last_verified_at FROM products WHERE status = 'published' AND (last_verified_at IS NULL OR last_verified_at < now() - interval '90 days') ORDER BY last_verified_at NULLS FIRST LIMIT 10`,
    ),
  ]);
  const count = (kind: string, status: string) => Number(statusRows.find((r) => r.kind === kind && r.status === status)?.n ?? 0);
  const todo: string[] = [];
  if (!settings.legal.entityName) todo.push("Add legal operator details (Settings) — required for the Impressum and privacy policy.");
  if (!settings.contactEmail) todo.push("Set a contact email (Settings).");
  if (authors.some((a) => a.isPlaceholder)) todo.push("Replace the placeholder author with named editors and real bios (Authors).");
  if (Number(links[0]?.affiliate ?? 0) === 0) todo.push("No active affiliate links yet — all buy buttons go to official stores. Add links once agreements exist.");

  return (
    <div>
      <PageTitle title={`Welcome, ${user.name}`} sub="Editorial workflow: draft → review (fact-check) → published. Only published content is public in production." />
      <Notice sp={sp} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Wallets published" value={count("product", "published")} sub={`${count("product", "review")} awaiting review · ${count("product", "draft")} drafts`} />
        <Stat label="Articles published" value={count("article", "published")} sub={`${count("article", "review")} awaiting review · ${count("article", "draft")} drafts`} />
        <Stat label="Outbound clicks (30d)" value={clicks?.total ?? "—"} sub={clicks ? `${clicks.affiliate} via affiliate links` : undefined} />
        <Stat label="Links" value={`${links[0]?.affiliate ?? 0} affiliate`} sub={`${links[0]?.placeholders ?? 0} placeholders · ${links[0]?.broken ?? 0} failing`} />
      </div>

      {todo.length > 0 && (
        <section className="mt-6 rounded-2xl border border-warn/30 bg-warn-soft p-5">
          <h2 className="font-semibold text-warn">Before launch</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {todo.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-semibold">Editorial queue (awaiting fact-check)</h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {queue.map((q) => (
              <li key={q.kind + q.id} className="flex items-center justify-between gap-3 py-2">
                <Link href={q.kind === "article" ? `/admin/articles/${q.id}` : `/admin/products/${q.id}`} className="hover:underline">
                  <span className="text-fg-subtle">{q.kind}:</span> {q.title}
                </Link>
                <StatusPill status={q.status} />
              </li>
            ))}
            {!queue.length && <li className="py-2 text-fg-subtle">Nothing waiting.</li>}
          </ul>
        </section>
        <section className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-semibold">Specs due for re-verification (published, &gt; 90 days)</h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {stale.map((p) => (
              <li key={p.slug} className="flex justify-between py-2">
                <Link href={`/admin/products/${p.slug}`} className="hover:underline">
                  {p.model}
                </Link>
                <span className="text-fg-subtle">{p.last_verified_at ?? "never"}</span>
              </li>
            ))}
            {!stale.length && <li className="py-2 text-fg-subtle">All published profiles verified within 90 days.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
