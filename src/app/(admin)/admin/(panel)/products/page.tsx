import Link from "next/link";
import { LinkBtn, Notice, PageTitle, StatusPill } from "@/components/admin-ui";
import { requirePermission } from "@/lib/auth/session";
import { listAllProducts } from "@/lib/repo/products";
import { getWeights } from "@/lib/repo/settings";
import { overallScore } from "@/lib/scoring";

export default async function ProductsAdmin({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requirePermission("content.edit");
  const sp = await searchParams;
  const [products, weights] = await Promise.all([listAllProducts(), getWeights()]);
  return (
    <div>
      <PageTitle title="Wallets" sub="Product database. Every attribute carries a fact status; prices are shown as unverified until confirmed." action={<LinkBtn href="/admin/products/new">Add wallet</LinkBtn>} />
      <Notice sp={sp} />
      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-bg-subtle text-left text-xs uppercase tracking-wide text-fg-subtle">
            <tr>
              <th className="p-3">Model</th>
              <th className="p-3">Manufacturer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Score</th>
              <th className="p-3">Price (EUR/USD/GBP)</th>
              <th className="p-3">Last verified</th>
              <th className="p-3">Advisories</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.slug}>
                <td className="p-3 font-medium">
                  <Link href={`/admin/products/${p.slug}`} className="hover:underline">
                    {p.model}
                  </Link>
                </td>
                <td className="p-3 text-fg-muted">{p.manufacturer.name}</td>
                <td className="p-3">
                  <StatusPill status={p.status} />
                </td>
                <td className="p-3 tabular">{overallScore(p.data.scores, weights).toFixed(1)}</td>
                <td className="p-3 tabular text-fg-muted">
                  {[p.data.prices.EUR, p.data.prices.USD, p.data.prices.GBP].map((v) => v ?? "–").join(" / ")} <span className="text-xs">({p.data.factStatus.price ?? "?"})</span>
                </td>
                <td className="p-3 text-fg-muted">{p.lastVerifiedAt ?? "never"}</td>
                <td className="p-3">{p.data.advisories.length || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
