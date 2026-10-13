import { z } from "zod";

export const LOCALES = ["en", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const COUNTRIES = ["GB", "DE", "INTL"] as const;
export type Country = (typeof COUNTRIES)[number];

export const CURRENCIES = ["GBP", "EUR", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const localized = z.object({ en: z.string().default(""), de: z.string().default("") });
export type Localized = z.infer<typeof localized>;

const localizedList = z.object({ en: z.array(z.string()).default([]), de: z.array(z.string()).default([]) });

/** How well a fact is established. Shown next to each attribute on the site. */
export const FACT_STATUS = ["verified", "manufacturer_claim", "unverified"] as const;
export type FactStatus = (typeof FACT_STATUS)[number];

export const CONNECTIVITY = ["usb", "bluetooth", "nfc", "qr", "microsd"] as const;
export type Connectivity = (typeof CONNECTIVITY)[number];

export const PLATFORMS = ["windows", "macos", "linux", "android", "ios"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const BACKUP_METHODS = ["bip39", "slip39", "microsd", "seedqr", "multi_card", "seed_xor", "steel_plates", "cloud_optional"] as const;
export type BackupMethod = (typeof BACKUP_METHODS)[number];

export const OPEN_LEVEL = ["yes", "partial", "no", "unknown"] as const;
export type OpenLevel = (typeof OPEN_LEVEL)[number];

export const FORM_FACTORS = ["stick", "candybar", "touch", "keyboard", "card", "phone"] as const;
export type FormFactor = (typeof FORM_FACTORS)[number];

export const SCORE_KEYS = ["security", "backup", "usability", "privacy", "features", "value"] as const;
export type ScoreKey = (typeof SCORE_KEYS)[number];

/** Attributes whose verification status is tracked individually. */
export const FACT_FIELDS = [
  "price",
  "assets",
  "secureElement",
  "openSource",
  "connectivity",
  "airGapped",
  "backup",
  "passphrase",
  "multisig",
  "platforms",
  "warranty",
] as const;
export type FactField = (typeof FACT_FIELDS)[number];

export const advisorySchema = z.object({
  date: z.string(), // ISO date
  severity: z.enum(["info", "warning", "critical"]),
  title: localized,
  summary: localized,
  url: z.string().url().or(z.literal("")).default(""),
});
export type Advisory = z.infer<typeof advisorySchema>;

export const sourceSchema = z.object({ label: z.string(), url: z.string().url() });
export type Source = z.infer<typeof sourceSchema>;

export const productDataSchema = z.object({
  tagline: localized,
  formFactor: z.enum(FORM_FACTORS),
  image: z
    .object({ url: z.string(), alt: z.string(), credit: z.string().default(""), license: z.string().default("") })
    .nullable()
    .default(null),
  releaseYear: z.number().int().nullable().default(null),
  discontinued: z.boolean().default(false),
  editions: z.array(z.string()).default([]),

  prices: z.object({ GBP: z.number().nullable().default(null), EUR: z.number().nullable().default(null), USD: z.number().nullable().default(null) }),
  priceNote: localized.default({ en: "", de: "" }),
  priceCheckedAt: z.string().nullable().default(null),

  bitcoinOnly: z.boolean(), // the device ships / is designed Bitcoin-only
  btcOnlyFirmware: z.boolean(), // a Bitcoin-only firmware/edition is available
  assetsSummary: localized,
  assetBreadth: z.number().min(0).max(5), // 0 = BTC only … 5 = thousands of assets (for sorting)

  secureElement: z.object({ present: z.boolean(), chip: z.string().default(""), certification: z.string().default("") }),
  openSource: z.object({ firmware: z.enum(OPEN_LEVEL), hardware: z.enum(OPEN_LEVEL), note: localized.default({ en: "", de: "" }) }),
  connectivity: z.array(z.enum(CONNECTIVITY)),
  airGapped: z.enum(["full", "optional", "no"]),
  backup: z.array(z.enum(BACKUP_METHODS)),
  passphrase: z.boolean(),
  multisig: z.enum(["strong", "basic", "none"]),
  platforms: z.array(z.enum(PLATFORMS)),
  companionApps: z.string().default(""),
  display: z.string().default(""),
  input: z.string().default(""),
  battery: z.boolean().default(false),
  securityArchitecture: localized,
  usabilityNotes: localized.default({ en: "", de: "" }),
  warranty: localized,
  shipping: z.object({ GB: localized, DE: localized }),

  pros: localizedList,
  cons: localizedList,
  bestFor: localized.default({ en: "", de: "" }),
  avoidIf: localized.default({ en: "", de: "" }),

  scores: z.object({
    security: z.number().min(0).max(10),
    backup: z.number().min(0).max(10),
    usability: z.number().min(0).max(10),
    privacy: z.number().min(0).max(10),
    features: z.number().min(0).max(10),
    value: z.number().min(0).max(10),
  }),
  scoreRationale: localized.default({ en: "", de: "" }),

  advisories: z.array(advisorySchema).default([]),
  sources: z.array(sourceSchema).default([]),
  factStatus: z.record(z.enum(FACT_FIELDS), z.enum(FACT_STATUS)).default({}),
  officialUrl: z.string().url(),
});
export type ProductData = z.infer<typeof productDataSchema>;
export type ProductDataInput = z.input<typeof productDataSchema>;

export type ContentStatus = "draft" | "review" | "published" | "archived";

export interface Manufacturer {
  slug: string;
  name: string;
  hqCountry: string;
  website: string;
  description: Localized;
}

export interface Product {
  slug: string;
  manufacturerSlug: string;
  manufacturer: Manufacturer;
  model: string;
  status: ContentStatus;
  data: ProductData;
  lastVerifiedAt: string | null;
  updatedAt: string;
}

export const faqSchema = z.object({ q: z.string(), a: z.string() });
export const pickSchema = z.object({ product: z.string(), label: z.string() });

export const articleDataSchema = z.object({
  faqs: z.array(faqSchema).default([]),
  picks: z.array(pickSchema).default([]),
  sources: z.array(sourceSchema).default([]),
  verdict: z.string().default(""),
  noindex: z.boolean().default(false),
});
export type ArticleData = z.infer<typeof articleDataSchema>;

export const ARTICLE_TYPES = ["review", "comparison", "guide", "learn", "page"] as const;
export type ArticleType = (typeof ARTICLE_TYPES)[number];

export interface Article {
  id: string;
  type: ArticleType;
  locale: Locale;
  slug: string;
  translationKey: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  excerpt: string | null;
  body: string;
  status: ContentStatus;
  authorId: string | null;
  productSlugs: string[];
  data: ArticleData;
  publishedAt: string | null;
  reviewedAt: string | null;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  role: Localized;
  bio: Localized;
  avatarUrl: string | null;
  isPlaceholder: boolean;
}

export interface AffiliateLink {
  id: string;
  productSlug: string;
  country: string;
  retailer: string;
  isOfficial: boolean;
  network: string;
  url: string;
  isAffiliate: boolean;
  status: "active" | "placeholder" | "paused";
  addUtm: boolean;
  priority: number;
  commissionNote: string | null;
  lastCheckedAt: string | null;
  lastStatusCode: number | null;
  lastCheckError: string | null;
}

export type Role = "admin" | "editor" | "writer" | "analyst";
