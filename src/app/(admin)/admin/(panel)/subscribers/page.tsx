import { PageTitle, Stat } from "@/components/admin-ui";
import { requirePermission } from "@/lib/auth/session";
import { query } from "@/lib/db";

export default async function SubscribersAdmin() {
  await requirePermission("settings.manage");
  const [stats] = await query<{ confirmed: string; pending: string; unsub: string }>(
    `SELECT count(*) FILTER (WHERE confirmed_at IS NOT NULL AND unsubscribed_at IS NULL) AS confirmed,
            count(*) FILTER (WHERE confirmed_at IS NULL) AS pending,
            count(*) FILTER (WHERE unsubscribed_at IS NOT NULL) AS unsub FROM newsletter_subscribers`,
  );
  return (
    <div className="max-w-3xl">
      <PageTitle title="Newsletter subscribers" sub="Double opt-in. Only confirmed, subscribed addresses are exported. Import them into your email provider." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Confirmed" value={stats.confirmed} />
        <Stat label="Pending confirmation" value={stats.pending} />
        <Stat label="Unsubscribed" value={stats.unsub} />
      </div>
      <a href="/admin-export/subscribers" className="mt-6 inline-block rounded-lg bg-fg px-4 py-2 text-sm font-semibold text-bg">
        Download confirmed subscribers (CSV)
      </a>
    </div>
  );
}
