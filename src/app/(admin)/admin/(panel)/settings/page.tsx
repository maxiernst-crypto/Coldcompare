import { Btn, Check, Input, Notice, PageTitle, Section, Textarea } from "@/components/admin-ui";
import { requirePermission } from "@/lib/auth/session";
import { getSiteSettings, getWeights } from "@/lib/repo/settings";
import { SCORE_KEYS } from "@/lib/schemas";
import { saveSettingsAction } from "../../actions";

export default async function SettingsAdmin({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requirePermission("settings.manage");
  const sp = await searchParams;
  const [s, w] = await Promise.all([getSiteSettings(), getWeights()]);
  return (
    <div className="max-w-4xl">
      <PageTitle title="Settings" />
      <Notice sp={sp} />
      <form action={saveSettingsAction} className="space-y-6">
        <Section title="Scoring weights" desc="Must total 100. Changing weights recalculates every overall score and is shown on the methodology page.">
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-6">
            {SCORE_KEYS.map((k) => (
              <Input key={k} label={`${k} %`} name={`w.${k}`} type="number" min={0} max={100} step="1" defaultValue={w[k]} />
            ))}
          </div>
        </Section>
        <Section title="Legal operator details" desc="Shown in the Impressum, privacy policy, terms and About page via [[legal]]. Enter real details only — leave empty until you have them.">
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Legal name / company" name="legal.entityName" defaultValue={s.legal.entityName} />
            <Input label="Represented by" name="legal.representative" defaultValue={s.legal.representative} />
            <Textarea label="Postal address" name="legal.address" defaultValue={s.legal.address} rows={3} />
            <div className="space-y-3">
              <Input label="Email" name="legal.email" type="email" defaultValue={s.legal.email} />
              <Input label="Phone" name="legal.phone" defaultValue={s.legal.phone} />
            </div>
            <Input label="Register entry (e.g. Amtsgericht … HRB …)" name="legal.register" defaultValue={s.legal.register} />
            <Input label="VAT ID" name="legal.vatId" defaultValue={s.legal.vatId} />
          </div>
        </Section>
        <Section title="Site">
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Public contact email" name="contactEmail" type="email" defaultValue={s.contactEmail} />
            <Input label="UTM source" name="utmSource" defaultValue={s.utmSource} />
          </div>
          <div className="flex flex-wrap gap-6">
            <Check name="newsletterEnabled" label="Newsletter signup enabled" checked={s.newsletterEnabled} />
            <Check name="sponsoredSlotsEnabled" label="Sponsored placements enabled (always labelled, never in rankings)" checked={s.sponsoredSlotsEnabled} />
          </div>
        </Section>
        <Section title="Sponsored placement" desc="Shown on the homepage only when enabled above and filled in. Always labelled “Sponsored”, visually separated and linked with rel=“sponsored”. It never affects scores, rankings, picks or the quiz.">
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Sponsor name" name="sp.sponsor" defaultValue={s.sponsored.sponsor} />
            <Input label="URL" name="sp.url" type="url" defaultValue={s.sponsored.url} />
            <Input label="Headline" name="sp.title" defaultValue={s.sponsored.title} />
            <Input label="Text" name="sp.text" defaultValue={s.sponsored.text} />
          </div>
        </Section>
        <Btn type="submit">Save settings</Btn>
      </form>
    </div>
  );
}
