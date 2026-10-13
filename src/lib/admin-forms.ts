import {
  ARTICLE_TYPES,
  BACKUP_METHODS,
  CONNECTIVITY,
  FACT_FIELDS,
  FACT_STATUS,
  FORM_FACTORS,
  OPEN_LEVEL,
  PLATFORMS,
  productDataSchema,
  type ArticleType,
  type ContentStatus,
  type Locale,
  type ProductData,
} from "./schemas";
import type { ArticleInput } from "./repo/articles";

/** Thrown for user-correctable form problems; the message is shown in the admin UI. */
export class FormError extends Error {}

const STATUSES: ContentStatus[] = ["draft", "review", "published", "archived"];
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function str(fd: FormData, k: string): string {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
}
function num(fd: FormData, k: string): number | null {
  const v = str(fd, k);
  if (v === "") return null;
  const n = Number(v.replace(",", "."));
  if (!Number.isFinite(n)) throw new FormError(`"${k}" must be a number.`);
  return n;
}
const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const loc = (fd: FormData, k: string) => ({ en: str(fd, `${k}.en`), de: str(fd, `${k}.de`) });
function oneOf<T extends string>(v: string, allowed: readonly T[], name: string): T {
  if (!(allowed as readonly string[]).includes(v)) throw new FormError(`Invalid value for ${name}.`);
  return v as T;
}
function many<T extends string>(fd: FormData, k: string, allowed: readonly T[]): T[] {
  return fd.getAll(k).filter((v): v is T => typeof v === "string" && (allowed as readonly string[]).includes(v));
}
/** Collect repeated row groups named like "adv.0.date", "adv.1.date"… */
function rows(fd: FormData, prefix: string): Record<string, string>[] {
  const out: Record<number, Record<string, string>> = {};
  for (const [k, v] of fd.entries()) {
    const m = k.match(new RegExp(`^${prefix}\\.(\\d+)\\.([\\w.]+)$`));
    if (m && typeof v === "string") (out[Number(m[1])] ??= {})[m[2]] = v.trim();
  }
  return Object.keys(out)
    .map(Number)
    .sort((a, b) => a - b)
    .map((i) => out[i]);
}

export interface ProductForm {
  slug: string;
  manufacturerSlug: string;
  model: string;
  status: ContentStatus;
  lastVerifiedAt: string | null;
  data: ProductData;
}

export function parseProductForm(fd: FormData): ProductForm {
  const slug = str(fd, "slug");
  if (!SLUG_RE.test(slug)) throw new FormError("Slug must be lowercase letters, numbers and hyphens.");
  const model = str(fd, "model");
  if (!model) throw new FormError("Model is required.");
  const lastVerifiedAt = str(fd, "lastVerifiedAt") || null;
  if (lastVerifiedAt && !/^\d{4}-\d{2}-\d{2}$/.test(lastVerifiedAt)) throw new FormError("Last verified must be a date.");

  const factStatus: Record<string, string> = {};
  for (const f of FACT_FIELDS) factStatus[f] = oneOf(str(fd, `fact.${f}`) || "unverified", FACT_STATUS, `fact status ${f}`);

  const imageUrl = str(fd, "image.url");
  const advisories = rows(fd, "adv")
    .filter((r) => r.date && (r["title.en"] || r["title.de"]))
    .map((r) => ({
      date: r.date,
      severity: oneOf(r.severity || "info", ["info", "warning", "critical"] as const, "advisory severity"),
      title: { en: r["title.en"] ?? "", de: r["title.de"] ?? "" },
      summary: { en: r["summary.en"] ?? "", de: r["summary.de"] ?? "" },
      url: r.url ?? "",
    }));
  const sources = rows(fd, "src")
    .filter((r) => r.url)
    .map((r) => ({ label: r.label || r.url, url: r.url }));

  const raw = {
    tagline: loc(fd, "tagline"),
    formFactor: oneOf(str(fd, "formFactor"), FORM_FACTORS, "form factor"),
    image: imageUrl ? { url: imageUrl, alt: str(fd, "image.alt") || model, credit: str(fd, "image.credit"), license: str(fd, "image.license") } : null,
    releaseYear: num(fd, "releaseYear"),
    discontinued: fd.get("discontinued") === "on",
    editions: str(fd, "editions").split(",").map((s) => s.trim()).filter(Boolean),
    prices: { GBP: num(fd, "price.GBP"), EUR: num(fd, "price.EUR"), USD: num(fd, "price.USD") },
    priceNote: loc(fd, "priceNote"),
    priceCheckedAt: str(fd, "priceCheckedAt") || null,
    bitcoinOnly: fd.get("bitcoinOnly") === "on",
    btcOnlyFirmware: fd.get("btcOnlyFirmware") === "on",
    assetsSummary: loc(fd, "assetsSummary"),
    assetBreadth: num(fd, "assetBreadth") ?? 0,
    secureElement: { present: fd.get("se.present") === "on", chip: str(fd, "se.chip"), certification: str(fd, "se.certification") },
    openSource: { firmware: oneOf(str(fd, "open.firmware"), OPEN_LEVEL, "open firmware"), hardware: oneOf(str(fd, "open.hardware"), OPEN_LEVEL, "open hardware"), note: loc(fd, "open.note") },
    connectivity: many(fd, "connectivity", CONNECTIVITY),
    airGapped: oneOf(str(fd, "airGapped"), ["full", "optional", "no"] as const, "air-gapped"),
    backup: many(fd, "backup", BACKUP_METHODS),
    passphrase: fd.get("passphrase") === "on",
    multisig: oneOf(str(fd, "multisig"), ["strong", "basic", "none"] as const, "multisig"),
    platforms: many(fd, "platforms", PLATFORMS),
    companionApps: str(fd, "companionApps"),
    display: str(fd, "display"),
    input: str(fd, "input"),
    battery: fd.get("battery") === "on",
    securityArchitecture: loc(fd, "securityArchitecture"),
    usabilityNotes: loc(fd, "usabilityNotes"),
    warranty: loc(fd, "warranty"),
    shipping: { GB: loc(fd, "shipping.GB"), DE: loc(fd, "shipping.DE") },
    pros: { en: lines(str(fd, "pros.en")), de: lines(str(fd, "pros.de")) },
    cons: { en: lines(str(fd, "cons.en")), de: lines(str(fd, "cons.de")) },
    bestFor: loc(fd, "bestFor"),
    avoidIf: loc(fd, "avoidIf"),
    scores: {
      security: num(fd, "score.security") ?? 0,
      backup: num(fd, "score.backup") ?? 0,
      usability: num(fd, "score.usability") ?? 0,
      privacy: num(fd, "score.privacy") ?? 0,
      features: num(fd, "score.features") ?? 0,
      value: num(fd, "score.value") ?? 0,
    },
    scoreRationale: loc(fd, "scoreRationale"),
    advisories,
    sources,
    factStatus,
    officialUrl: str(fd, "officialUrl"),
  };
  const parsed = productDataSchema.safeParse(raw);
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    throw new FormError(`${i.path.join(".")}: ${i.message}`);
  }
  return {
    slug,
    manufacturerSlug: str(fd, "manufacturerSlug"),
    model,
    status: oneOf(str(fd, "status"), STATUSES, "status"),
    lastVerifiedAt,
    data: parsed.data,
  };
}

export const EDITORIAL_CHECKLIST = [
  "Every factual claim was checked against a primary source (official docs, source code, certificate, audit).",
  "No hands-on testing is claimed unless it actually took place.",
  "Prices, availability and firmware versions were confirmed on the date shown.",
  "Security advisories for the products covered are current and accurately summarised.",
  "Affiliate links are disclosed; recommendations were not influenced by commission.",
  "Titles, meta description and internal links are in place; no keyword stuffing.",
] as const;

export function parseArticleForm(fd: FormData, opts: { canPublish: boolean }): ArticleInput {
  const type = oneOf(str(fd, "type"), ARTICLE_TYPES, "type") as ArticleType;
  const locale = oneOf(str(fd, "locale"), ["en", "de"] as const, "locale") as Locale;
  const slug = str(fd, "slug");
  if (!SLUG_RE.test(slug)) throw new FormError("Slug must be lowercase letters, numbers and hyphens.");
  const title = str(fd, "title");
  if (!title) throw new FormError("Title is required.");
  const status = oneOf(str(fd, "status"), STATUSES, "status");
  const reviewedAt = str(fd, "reviewedAt") || null;
  if (status === "published") {
    if (!opts.canPublish) throw new FormError("Your role cannot publish. Set status to “review” for an editor to approve.");
    const ticked = EDITORIAL_CHECKLIST.every((_, i) => fd.get(`check.${i}`) === "on");
    if (!ticked) throw new FormError("Complete the editorial checklist before publishing.");
    if (!reviewedAt) throw new FormError("Set the fact-check date before publishing.");
  }
  const metaDescription = str(fd, "metaDescription") || null;
  if (metaDescription && metaDescription.length > 170) throw new FormError("Meta description should be 170 characters or fewer.");
  const faqs = rows(fd, "faq")
    .filter((r) => r.q && r.a)
    .map((r) => ({ q: r.q, a: r.a }));
  const picks = rows(fd, "pick")
    .filter((r) => r.product)
    .map((r) => ({ product: r.product, label: r.label ?? "" }));
  const sources = rows(fd, "src")
    .filter((r) => r.url)
    .map((r) => ({ label: r.label || r.url, url: r.url }));
  return {
    type,
    locale,
    slug,
    translationKey: str(fd, "translationKey") || `${type}-${slug}`,
    title,
    metaTitle: str(fd, "metaTitle") || null,
    metaDescription,
    excerpt: str(fd, "excerpt") || null,
    body: (fd.get("body") as string | null) ?? "",
    status,
    authorId: str(fd, "authorId") || null,
    productSlugs: str(fd, "productSlugs").split(",").map((s) => s.trim()).filter(Boolean),
    data: { faqs, picks, sources, verdict: str(fd, "verdict"), noindex: fd.get("noindex") === "on" },
    reviewedAt,
  };
}

/** Minimal RFC 4180 CSV parser (quotes, escaped quotes, CRLF). */
export function parseCsv(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((x) => x !== "")) out.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x !== "")) out.push(row);
  return out;
}

export function toCsv(rows: (string | number | null | undefined)[][]): string {
  return rows.map((r) => r.map((v) => (v == null ? "" : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v))).join(",")).join("\n");
}
