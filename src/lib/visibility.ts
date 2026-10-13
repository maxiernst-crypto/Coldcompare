import type { ContentStatus } from "./schemas";

/**
 * Editorial gate: only "published" content is public. With CONTENT_PREVIEW=true (local/staging),
 * content awaiting editorial verification ("review") is rendered too, with a banner and noindex.
 */
export function isPreviewMode(): boolean {
  return process.env.CONTENT_PREVIEW === "true";
}

export function visibleStatuses(): ContentStatus[] {
  return isPreviewMode() ? ["published", "review"] : ["published"];
}
