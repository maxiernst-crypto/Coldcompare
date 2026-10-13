import type { Dictionary } from "@/lib/i18n/en";
import { renderMarkdown, splitShortcodes } from "@/lib/markdown";
import type { ClientProduct } from "@/lib/product-view";
import type { SiteSettings } from "@/lib/repo/settings";
import { SCORE_KEYS, type ArticleData, type Locale } from "@/lib/schemas";
import type { Weights } from "@/lib/scoring";
import { CompareTable } from "./compare-table";
import { ProductCard } from "./product-card";

/** Renders article Markdown plus [[shortcodes]] with live data from the product database. */
export function Prose({
  body,
  locale,
  d,
  products,
  picks = [],
  weights,
  settings,
  placement,
}: {
  body: string;
  locale: Locale;
  d: Dictionary;
  products: Map<string, ClientProduct>;
  picks?: ArticleData["picks"];
  weights: Weights;
  settings: SiteSettings;
  placement: string;
}) {
  const blocks = splitShortcodes(body);
  return (
    <div className="prose-cc">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "md":
            return <div key={i} className="prose-cc" dangerouslySetInnerHTML={{ __html: renderMarkdown(b.text) }} />;
          case "table": {
            const list = b.slugs.map((s) => products.get(s)).filter((p): p is ClientProduct => !!p);
            if (list.length === 0) return null;
            return (
              <div key={i} className="not-prose my-8">
                <CompareTable products={list} placement={`${placement}-table`} />
                <p className="mt-2 text-xs text-fg-subtle">{d.common.claimsNote}</p>
              </div>
            );
          }
          case "product": {
            const p = products.get(b.slug);
            return p ? (
              <div key={i} className="my-6">
                <ProductCard p={p} locale={locale} d={d} placement={`${placement}-inline`} />
              </div>
            ) : null;
          }
          case "picks": {
            const list = picks.map((pk) => ({ pk, p: products.get(pk.product) })).filter((x): x is { pk: (typeof picks)[number]; p: ClientProduct } => !!x.p);
            return (
              <section key={i} aria-label={d.best.ourPicks} className="my-8 grid gap-4 md:grid-cols-2">
                {list.map(({ pk, p }, idx) => (
                  <ProductCard key={p.slug} p={p} locale={locale} d={d} rank={idx + 1} label={pk.label} placement={`${placement}-pick-${idx + 1}`} />
                ))}
              </section>
            );
          }
          case "weights":
            return (
              <table key={i}>
                <thead>
                  <tr>
                    <th>{d.compare.attribute}</th>
                    <th>{d.scores.weight}</th>
                  </tr>
                </thead>
                <tbody>
                  {SCORE_KEYS.map((k) => (
                    <tr key={k}>
                      <td>{d.scores[k]}</td>
                      <td className="tabular">{weights[k]}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case "legal": {
            const l = settings.legal;
            if (!l.entityName) {
              return (
                <blockquote key={i}>
                  <strong>{locale === "de" ? "Noch zu ergänzen:" : "To be completed:"}</strong>{" "}
                  {locale === "de"
                    ? "Die Angaben zum Betreiber (Name/Firma, Anschrift, Vertretungsberechtigte, Kontakt, ggf. Registereintrag und USt-IdNr.) werden vom Betreiber unter Admin → Einstellungen gepflegt."
                    : "Operator details (legal name, address, representative, contact, company registration and VAT ID where applicable) are maintained by the operator in Admin → Settings."}
                </blockquote>
              );
            }
            return (
              <address key={i} className="not-italic">
                <strong>{l.entityName}</strong>
                <br />
                {l.address.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    <br />
                  </span>
                ))}
                {l.representative && (
                  <>
                    {locale === "de" ? "Vertreten durch" : "Represented by"}: {l.representative}
                    <br />
                  </>
                )}
                {l.email && (
                  <>
                    E-Mail: <a href={`mailto:${l.email}`}>{l.email}</a>
                    <br />
                  </>
                )}
                {l.phone && (
                  <>
                    {locale === "de" ? "Telefon" : "Phone"}: {l.phone}
                    <br />
                  </>
                )}
                {l.register && (
                  <>
                    {l.register}
                    <br />
                  </>
                )}
                {l.vatId && <>{locale === "de" ? "USt-IdNr." : "VAT ID"}: {l.vatId}</>}
              </address>
            );
          }
          case "contact":
            return settings.contactEmail ? (
              <p key={i}>
                <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              </p>
            ) : (
              <blockquote key={i}>{locale === "de" ? "Kontaktadresse wird vom Betreiber unter Admin → Einstellungen gepflegt." : "Contact address to be set by the operator in Admin → Settings."}</blockquote>
            );
        }
      })}
    </div>
  );
}
