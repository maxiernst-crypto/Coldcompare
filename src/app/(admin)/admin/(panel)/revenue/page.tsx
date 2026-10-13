import { Btn, Input, Notice, PageTitle, Select } from "@/components/admin-ui";
import { requirePermission } from "@/lib/auth/session";
import { listRevenue } from "@/lib/repo/analytics";
import { listAllProducts } from "@/lib/repo/products";
import { addRevenueAction, deleteRevenueAction } from "../../actions";

export default async function RevenueAdmin({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requirePermission("revenue.manage");
  const sp = await searchParams;
  const [rows, products] = await Promise.all([listRevenue(3650), listAllProducts()]);
  return (
    <div className="max-w-5xl">
      <PageTitle title="Revenue" sub="Commission as reported by affiliate networks. Enter per period, optionally per wallet and country. Used for RPM and revenue-by-product/country reporting." />
      <Notice sp={sp} />
      <form action={addRevenueAction} className="grid gap-3 rounded-2xl border border-line bg-card p-5 md:grid-cols-4">
        <Input label="Period start" name="periodStart" type="date" required />
        <Input label="Period end" name="periodEnd" type="date" required />
        <Input label="Network" name="network" placeholder="awin, impact, direct…" />
        <Select label="Wallet (optional)" name="productSlug" options={[["", "—"], ...products.map((p) => [p.slug, p.model] as [string, string])]} />
        <Input label="Country (optional)" name="country" placeholder="GB / DE" />
        <Input label="Orders" name="orders" type="number" defaultValue={0} />
        <Input label="Commission" name="revenue" inputMode="decimal" required />
        <Select label="Currency" name="currency" options={["EUR", "GBP", "USD"]} />
        <Input label="Note" name="note" className="md:col-span-3" />
        <div className="flex items-end">
          <Btn type="submit">Add</Btn>
        </div>
      </form>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-bg-subtle text-left text-xs uppercase text-fg-subtle">
            <tr>
              {["Period", "Network", "Wallet", "Country", "Orders", "Commission", ""].map((h) => (
                <th key={h} className="p-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-3">
                  {r.periodStart} → {r.periodEnd}
                </td>
                <td className="p-3">{r.network}</td>
                <td className="p-3">{r.productSlug ?? "—"}</td>
                <td className="p-3">{r.country ?? "—"}</td>
                <td className="p-3 tabular">{r.orders}</td>
                <td className="p-3 tabular">
                  {r.revenue.toFixed(2)} {r.currency}
                </td>
                <td className="p-3">
                  <form action={deleteRevenueAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-xs text-danger underline">delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={7} className="p-3 text-fg-subtle">
                  No revenue recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
