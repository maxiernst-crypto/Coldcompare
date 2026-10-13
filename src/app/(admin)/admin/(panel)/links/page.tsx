import { Btn, Check, inputCls, Notice, PageTitle, StatusPill } from "@/components/admin-ui";
import { requirePermission } from "@/lib/auth/session";
import { listAllLinks } from "@/lib/repo/links";
import { listAllProducts } from "@/lib/repo/products";
import type { AffiliateLink } from "@/lib/schemas";
import { checkLinksAction, deleteLinkAction, saveLinkAction } from "../../actions";

const NETWORKS = ["none", "direct", "awin", "impact", "partnerize", "cj", "rakuten", "amazon", "other"];

function LinkForm({ l, products }: { l?: AffiliateLink; products: { slug: string; model: string }[] }) {
  return (
    <form action={saveLinkAction} className="grid gap-2 p-3 md:grid-cols-12 md:items-end">
      <input type="hidden" name="id" value={l?.id ?? ""} />
      <label className="md:col-span-2">
        <span className="text-xs text-fg-subtle">Product</span>
        <select name="productSlug" defaultValue={l?.productSlug} className={inputCls}>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.model}
            </option>
          ))}
        </select>
      </label>
      <label className="md:col-span-1">
        <span className="text-xs text-fg-subtle">Country</span>
        <input name="country" defaultValue={l?.country ?? "*"} className={inputCls} title="* = fallback, GB, DE, INTL" />
      </label>
      <label className="md:col-span-2">
        <span className="text-xs text-fg-subtle">Retailer</span>
        <input name="retailer" defaultValue={l?.retailer ?? "Official store"} className={inputCls} />
      </label>
      <label className="md:col-span-3">
        <span className="text-xs text-fg-subtle">URL</span>
        <input name="url" type="url" required defaultValue={l?.url} className={inputCls} />
      </label>
      <label className="md:col-span-1">
        <span className="text-xs text-fg-subtle">Network</span>
        <select name="network" defaultValue={l?.network ?? "none"} className={inputCls}>
          {NETWORKS.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <label className="md:col-span-1">
        <span className="text-xs text-fg-subtle">Status</span>
        <select name="status" defaultValue={l?.status ?? "placeholder"} className={inputCls}>
          {["active", "placeholder", "paused"].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <label className="md:col-span-1">
        <span className="text-xs text-fg-subtle">Priority</span>
        <input name="priority" type="number" defaultValue={l?.priority ?? 0} className={inputCls} />
      </label>
      <div className="flex items-center md:col-span-1">
        <Btn type="submit" variant="secondary" className="w-full">
          {l ? "Save" : "Add"}
        </Btn>
      </div>
      <div className="flex flex-wrap gap-4 md:col-span-12">
        <Check name="isAffiliate" label="Affiliate link (agreement exists)" checked={l?.isAffiliate} />
        <Check name="isOfficial" label="Official store / authorised reseller" checked={l?.isOfficial ?? true} />
        <Check name="addUtm" label="Append UTM parameters" checked={l?.addUtm} />
        <input name="commissionNote" defaultValue={l?.commissionNote ?? ""} placeholder="Internal note (never used for ranking)" className={`${inputCls} md:max-w-md`} />
        {l && (
          <span className="text-xs text-fg-subtle">
            <StatusPill status={l.status} /> last check: {l.lastCheckedAt ? `${l.lastCheckedAt.slice(0, 16).replace("T", " ")} → ${l.lastStatusCode ?? l.lastCheckError}` : "never"}
            {l.lastStatusCode && l.lastStatusCode >= 400 ? <strong className="ml-1 text-danger">BROKEN</strong> : null}
          </span>
        )}
      </div>
    </form>
  );
}

export default async function LinksAdmin({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requirePermission("links.manage");
  const sp = await searchParams;
  const [links, products] = await Promise.all([listAllLinks(), listAllProducts()]);
  const plist = products.map((p) => ({ slug: p.slug, model: p.model }));
  return (
    <div>
      <PageTitle
        title="Affiliate links"
        sub="One central place for every outbound link. Buttons on the site go through /go/<wallet>, which picks the best link for the visitor's country (exact country → '*' fallback; active before placeholder; then priority). Commission is never a ranking input."
        action={
          <form action={checkLinksAction}>
            <Btn variant="secondary">Run link health check</Btn>
          </form>
        }
      />
      <Notice sp={sp} />
      {sp.checked && (
        <p className="mb-4 rounded-lg bg-info-soft p-3 text-sm text-info">
          Checked {sp.checked} links — {sp.broken} failing.
        </p>
      )}
      <section className="mb-6 rounded-2xl border border-line bg-card">
        <h2 className="border-b border-line p-3 font-semibold">Add link</h2>
        <LinkForm products={plist} />
      </section>
      <div className="divide-y divide-line rounded-2xl border border-line bg-card">
        {links.map((l) => (
          <div key={l.id} className="relative">
            <LinkForm l={l} products={plist} />
            <form action={deleteLinkAction} className="absolute right-3 top-3">
              <input type="hidden" name="id" value={l.id} />
              <button className="text-xs text-danger underline">delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
