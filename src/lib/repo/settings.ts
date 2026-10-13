import { cache } from "react";
import { query, queryOne } from "../db";
import { DEFAULT_WEIGHTS, normalizeWeights, type Weights } from "../scoring";

export interface SiteSettings {
  sponsoredSlotsEnabled: boolean;
  /** A single, clearly labelled sponsored placement. Never part of rankings, picks or the quiz. */
  sponsored: { title: string; text: string; url: string; sponsor: string };
  newsletterEnabled: boolean;
  utmSource: string;
  contactEmail: string;
  /** Legal entity details for the Impressum / privacy pages. Empty until the operator provides real details. */
  legal: { entityName: string; address: string; representative: string; email: string; phone: string; vatId: string; register: string };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  sponsoredSlotsEnabled: false,
  sponsored: { title: "", text: "", url: "", sponsor: "" },
  newsletterEnabled: true,
  utmSource: "coldcompare",
  contactEmail: "",
  legal: { entityName: "", address: "", representative: "", email: "", phone: "", vatId: "", register: "" },
};

async function getSetting<T>(key: string): Promise<T | null> {
  const row = await queryOne<{ value: T }>(`SELECT value FROM settings WHERE key = $1`, [key]);
  return row?.value ?? null;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await query(
    `INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, JSON.stringify(value)],
  );
}

export const getWeights = cache(async (): Promise<Weights> => {
  const w = await getSetting<Partial<Weights>>("scoring_weights");
  return w ? normalizeWeights(w) : DEFAULT_WEIGHTS;
});

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const s = await getSetting<Partial<SiteSettings>>("site");
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    legal: { ...DEFAULT_SETTINGS.legal, ...(s?.legal ?? {}) },
    sponsored: { ...DEFAULT_SETTINGS.sponsored, ...(s?.sponsored ?? {}) },
  };
});
