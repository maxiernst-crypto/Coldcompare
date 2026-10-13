import { PageTitle } from "@/components/admin-ui";
import { requirePermission } from "@/lib/auth/session";
import { listAudit } from "@/lib/repo/audit";

export default async function AuditAdmin() {
  await requirePermission("settings.manage");
  const rows = await listAudit(300);
  return (
    <div>
      <PageTitle title="Audit log" sub="Every change made in the admin, newest first." />
      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-bg-subtle text-left text-xs uppercase text-fg-subtle">
            <tr>
              {["When", "Who", "Action", "Entity", "Detail"].map((h) => (
                <th key={h} className="p-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap p-3">{r.at.toISOString().slice(0, 19).replace("T", " ")}</td>
                <td className="p-3">{r.user_email ?? "system"}</td>
                <td className="p-3 font-mono text-xs">{r.action}</td>
                <td className="p-3">
                  {r.entity}:{r.entity_id}
                </td>
                <td className="p-3 font-mono text-xs text-fg-muted">{JSON.stringify(r.detail)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
