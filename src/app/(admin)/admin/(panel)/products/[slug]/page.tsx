import Link from "next/link";
import { notFound } from "next/navigation";
import { Btn, Check, Input, LocalizedField, Notice, PageTitle, Section, Select, Textarea } from "@/components/admin-ui";
import { can } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { getProduct, listManufacturers } from "@/lib/repo/products";
import { getWeights } from "@/lib/repo/settings";
import { BACKUP_METHODS, CONNECTIVITY, FACT_FIELDS, FACT_STATUS, FORM_FACTORS, OPEN_LEVEL, PLATFORMS, SCORE_KEYS, type ProductData } from "@/lib/schemas";
import { overallScore } from "@/lib/scoring";
import { deleteProductAction, saveProductAction } from "../../../actions";

const EMPTY: ProductData = {
  tagline: { en: "", de: "" },
  formFactor: "candybar",
  image: null,
  releaseYear: null,
  discontinued: false,
  editions: [],
  prices: { GBP: null, EUR: null, USD: null },
  priceNote: { en: "", de: "" },
  priceCheckedAt: null,
  bitcoinOnly: false,
  btcOnlyFirmware: false,
  assetsSummary: { en: "", de: "" },
  assetBreadth: 0,
  secureElement: { present: false, chip: "", certification: "" },
  openSource: { firmware: "unknown", hardware: "unknown", note: { en: "", de: "" } },
  connectivity: [],
  airGapped: "no",
  backup: [],
  passphrase: false,
  multisig: "none",
  platforms: [],
  companionApps: "",
  display: "",
  input: "",
  battery: false,
  securityArchitecture: { en: "", de: "" },
  usabilityNotes: { en: "", de: "" },
  warranty: { en: "", de: "" },
  shipping: { GB: { en: "", de: "" }, DE: { en: "", de: "" } },
  pros: { en: [], de: [] },
  cons: { en: [], de: [] },
  bestFor: { en: "", de: "" },
  avoidIf: { en: "", de: "" },
  scores: { security: 5, backup: 5, usability: 5, privacy: 5, features: 5, value: 5 },
  scoreRationale: { en: "", de: "" },
  advisories: [],
  sources: [],
  factStatus: {},
  officialUrl: "https://",
};

export default async function ProductEdit({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string>> }) {
  const user = await requirePermission("content.edit");
  const { slug } = await params;
  const sp = await searchParams;
  const isNew = slug === "new";
  const product = isNew ? null : await getProduct(slug);
  if (!isNew && !product) notFound();
  const [manufacturers, weights] = await Promise.all([listManufacturers(), getWeights()]);
  const d = product?.data ?? EMPTY;
  const statuses = can(user.role, "content.publish") ? ["draft", "review", "published", "archived"] : ["draft", "review"];
  const advRows = [...d.advisories, { date: "", severity: "info" as const, title: { en: "", de: "" }, summary: { en: "", de: "" }, url: "" }];
  const srcRows = [...d.sources, { label: "", url: "" }, { label: "", url: "" }];

  return (
    <div className="max-w-5xl">
      <PageTitle
        title={isNew ? "Add wallet" : `Edit ${product!.model}`}
        sub={isNew ? undefined : `Overall score with current weights: ${overallScore(d.scores, weights).toFixed(1)}`}
        action={
          !isNew && (
            <Link href={`/en/wallets/${slug}`} target="_blank" className="text-sm underline">
              View on site ↗
            </Link>
          )
        }
      />
      <Notice sp={sp} />
      <form action={saveProductAction} className="space-y-6">
        <input type="hidden" name="originalSlug" value={isNew ? "" : slug} />
        <Section title="Basics">
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Model" name="model" defaultValue={product?.model} required />
            <Input label="Slug (URL)" name="slug" defaultValue={product?.slug} required pattern="[a-z0-9-]+" hint="Changing it changes the public URL." />
            <Select label="Manufacturer" name="manufacturerSlug" value={product?.manufacturerSlug} options={manufacturers.map((m) => [m.slug, m.name])} />
            <Select label="Status" name="status" value={product?.status ?? "draft"} options={statuses} hint="Only “published” is public in production." />
            <Input label="Specs last verified" name="lastVerifiedAt" type="date" defaultValue={product?.lastVerifiedAt ?? ""} hint="Required to publish." />
            <Select label="Form factor" name="formFactor" value={d.formFactor} options={[...FORM_FACTORS]} />
            <Input label="Release year" name="releaseYear" type="number" defaultValue={d.releaseYear ?? ""} />
            <Input label="Editions (comma-separated)" name="editions" defaultValue={d.editions.join(", ")} />
            <Input label="Official URL" name="officialUrl" type="url" defaultValue={d.officialUrl} required />
          </div>
          <LocalizedField name="tagline" label="Tagline" value={d.tagline} />
          <Check name="discontinued" label="Discontinued (excluded from quiz)" checked={d.discontinued} />
        </Section>

        <Section title="Image" desc="Only use images you have the rights to (press kit with permission, own photos). Credit and licence are shown/stored.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Image URL" name="image.url" defaultValue={d.image?.url ?? ""} />
            <Input label="Alt text" name="image.alt" defaultValue={d.image?.alt ?? ""} />
            <Input label="Credit" name="image.credit" defaultValue={d.image?.credit ?? ""} />
            <Input label="Licence / permission" name="image.license" defaultValue={d.image?.license ?? ""} />
          </div>
        </Section>

        <Section title="Price">
          <div className="grid gap-4 md:grid-cols-4">
            <Input label="GBP" name="price.GBP" inputMode="decimal" defaultValue={d.prices.GBP ?? ""} />
            <Input label="EUR" name="price.EUR" inputMode="decimal" defaultValue={d.prices.EUR ?? ""} />
            <Input label="USD" name="price.USD" inputMode="decimal" defaultValue={d.prices.USD ?? ""} />
            <Input label="Price checked on" name="priceCheckedAt" type="date" defaultValue={d.priceCheckedAt ?? ""} />
          </div>
          <LocalizedField name="priceNote" label="Price note" value={d.priceNote} />
        </Section>

        <Section title="Assets & security">
          <div className="flex flex-wrap gap-6">
            <Check name="bitcoinOnly" label="Bitcoin-only device" checked={d.bitcoinOnly} />
            <Check name="btcOnlyFirmware" label="Bitcoin-only firmware/edition available" checked={d.btcOnlyFirmware} />
            <Check name="se.present" label="Secure element" checked={d.secureElement.present} />
            <Check name="passphrase" label="Passphrase support" checked={d.passphrase} />
            <Check name="battery" label="Battery" checked={d.battery} />
          </div>
          <LocalizedField name="assetsSummary" label="Supported assets" value={d.assetsSummary} />
          <div className="grid gap-4 md:grid-cols-4">
            <Input label="Asset breadth (0–5)" name="assetBreadth" type="number" min={0} max={5} defaultValue={d.assetBreadth} hint="0 = BTC only … 5 = thousands" />
            <Input label="Secure element chip" name="se.chip" defaultValue={d.secureElement.chip} />
            <Input label="Certification" name="se.certification" defaultValue={d.secureElement.certification} />
            <Select label="Air-gapped" name="airGapped" value={d.airGapped} options={["full", "optional", "no"]} />
            <Select label="Open-source firmware" name="open.firmware" value={d.openSource.firmware} options={[...OPEN_LEVEL]} />
            <Select label="Open-source hardware" name="open.hardware" value={d.openSource.hardware} options={[...OPEN_LEVEL]} />
            <Select label="Multisig" name="multisig" value={d.multisig} options={["strong", "basic", "none"]} />
          </div>
          <LocalizedField name="open.note" label="Open-source note" value={d.openSource.note} />
          <div className="grid gap-4 md:grid-cols-3">
            <fieldset>
              <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-fg-muted">Connectivity</legend>
              <div className="flex flex-wrap gap-3">
                {CONNECTIVITY.map((c) => (
                  <Check key={c} name="connectivity" value={c} label={c} checked={d.connectivity.includes(c)} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-fg-muted">Platforms</legend>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((c) => (
                  <Check key={c} name="platforms" value={c} label={c} checked={d.platforms.includes(c)} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-fg-muted">Backup methods</legend>
              <div className="flex flex-wrap gap-3">
                {BACKUP_METHODS.map((c) => (
                  <Check key={c} name="backup" value={c} label={c} checked={d.backup.includes(c)} />
                ))}
              </div>
            </fieldset>
          </div>
          <LocalizedField name="securityArchitecture" label="Security architecture" value={d.securityArchitecture} multiline rows={5} />
        </Section>

        <Section title="Usability & logistics">
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Display" name="display" defaultValue={d.display} />
            <Input label="Input" name="input" defaultValue={d.input} />
            <Input label="Companion apps" name="companionApps" defaultValue={d.companionApps} />
          </div>
          <LocalizedField name="usabilityNotes" label="Usability notes" value={d.usabilityNotes} multiline />
          <LocalizedField name="warranty" label="Warranty" value={d.warranty} multiline rows={2} />
          <LocalizedField name="shipping.GB" label="Shipping UK" value={d.shipping.GB} multiline rows={2} />
          <LocalizedField name="shipping.DE" label="Shipping DE" value={d.shipping.DE} multiline rows={2} />
        </Section>

        <Section title="Editorial assessment" desc="Scores 0–10. Overall = weighted average using the weights in Settings.">
          <div className="grid gap-4 md:grid-cols-6">
            {SCORE_KEYS.map((k) => (
              <Input key={k} label={k} name={`score.${k}`} type="number" step="0.5" min={0} max={10} defaultValue={d.scores[k]} />
            ))}
          </div>
          <LocalizedField name="scoreRationale" label="Score rationale" value={d.scoreRationale} multiline rows={2} />
          <div className="grid gap-3 md:grid-cols-2">
            <Textarea label="Pros (EN, one per line)" name="pros.en" defaultValue={d.pros.en.join("\n")} rows={5} />
            <Textarea label="Pros (DE, one per line)" name="pros.de" defaultValue={d.pros.de.join("\n")} rows={5} />
            <Textarea label="Cons (EN, one per line)" name="cons.en" defaultValue={d.cons.en.join("\n")} rows={5} />
            <Textarea label="Cons (DE, one per line)" name="cons.de" defaultValue={d.cons.de.join("\n")} rows={5} />
          </div>
          <LocalizedField name="bestFor" label="Who should buy it" value={d.bestFor} multiline rows={2} />
          <LocalizedField name="avoidIf" label="Who should avoid it" value={d.avoidIf} multiline rows={2} />
        </Section>

        <Section title="Fact status" desc="Distinguish independently verified facts from manufacturer claims. Set “verified” only after checking a primary source or hands-on.">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {FACT_FIELDS.map((f) => (
              <Select key={f} label={f} name={`fact.${f}`} value={d.factStatus[f] ?? "unverified"} options={[...FACT_STATUS]} />
            ))}
          </div>
        </Section>

        <Section title="Security advisories" desc="Add one row per advisory/incident. Leave the last row empty to add nothing; clear the date to remove a row.">
          {advRows.map((a, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-line p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Input label="Date" name={`adv.${i}.date`} type="date" defaultValue={a.date} />
                <Select label="Severity" name={`adv.${i}.severity`} value={a.severity} options={["info", "warning", "critical"]} />
                <Input label="Source URL" name={`adv.${i}.url`} type="url" defaultValue={a.url} />
              </div>
              <LocalizedField name={`adv.${i}.title`} label="Title" value={a.title} />
              <LocalizedField name={`adv.${i}.summary`} label="Summary" value={a.summary} multiline rows={3} />
            </div>
          ))}
        </Section>

        <Section title="Sources">
          {srcRows.map((s, i) => (
            <div key={i} className="grid gap-3 md:grid-cols-2">
              <Input label="Label" name={`src.${i}.label`} defaultValue={s.label} />
              <Input label="URL" name={`src.${i}.url`} type="url" defaultValue={s.url} />
            </div>
          ))}
        </Section>

        <div className="sticky bottom-0 flex gap-3 border-t border-line bg-bg-subtle/95 py-4 backdrop-blur">
          <Btn type="submit">Save wallet</Btn>
          <Link href="/admin/products" className="rounded-lg px-4 py-2 text-sm">
            Cancel
          </Link>
        </div>
      </form>
      {!isNew && can(user.role, "content.publish") && (
        <form action={deleteProductAction} className="mt-10 border-t border-line pt-6">
          <input type="hidden" name="slug" value={slug} />
          <Btn variant="danger" type="submit">
            Delete wallet (also deletes its affiliate links)
          </Btn>
        </form>
      )}
    </div>
  );
}
