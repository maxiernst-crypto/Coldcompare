import Link from "next/link";
import { inputCls, LinkBtn, Notice, PageTitle, StatusPill } from "@/components/admin-ui";
import { requirePermission } from "@/lib/auth/session";
import { listArticlesAdmin } from "@/lib/repo/articles";
import { ARTICLE_TYPES } from "@/lib/schemas";

export default async function ArticlesAdmin({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requirePermission("content.edit");
  const sp = await searchParams;
  const articles = await listArticlesAdmin({ type: sp.type, locale: sp.locale, status: sp.status, q: sp.q });
  return (
    <div>
      <PageTitle title="Articles" sub="Reviews, comparisons, buying guides, academy articles and site pages." action={<LinkBtn href="/admin/articles/new">New article</LinkBtn>} />
      <Notice sp={sp} />
      <form className="mb-4 grid gap-2 sm:grid-cols-5">
        <input name="q" defaultValue={sp.q} placeholder="Search title or slug" className={`${inputCls} sm:col-span-2`} />
        <select name="type" defaultValue={sp.type ?? ""} className={inputCls}>
          <option value="">All types</option>
          {ARTICLE_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select name="locale" defaultValue={sp.locale ?? ""} className={inputCls}>
          <option value="">All languages</option>
          <option value="en">en</option>
          <option value="de">de</option>
        </select>
        <select name="status" defaultValue={sp.status ?? ""} className={inputCls}>
          <option value="">All statuses</option>
          {["draft", "review", "published", "archived"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button className="rounded-lg border border-line-strong px-3 py-2 text-sm sm:col-start-5">Filter</button>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-bg-subtle text-left text-xs uppercase tracking-wide text-fg-subtle">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Lang</th>
              <th className="p-3">Status</th>
              <th className="p-3">Fact-checked</th>
              <th className="p-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {articles.map((a) => (
              <tr key={a.id}>
                <td className="p-3">
                  <Link href={`/admin/articles/${a.id}`} className="font-medium hover:underline">
                    {a.title}
                  </Link>
                  <div className="text-xs text-fg-subtle">/{a.slug}</div>
                </td>
                <td className="p-3">{a.type}</td>
                <td className="p-3 uppercase">{a.locale}</td>
                <td className="p-3">
                  <StatusPill status={a.status} />
                </td>
                <td className="p-3 text-fg-muted">{a.reviewedAt ?? "—"}</td>
                <td className="p-3 text-fg-muted">{a.updatedAt.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
