import { query } from "./db";
import { checkUrl, listAllLinks, recordLinkCheck } from "./repo/links";

/** Check every non-paused outbound link and store the HTTP status. */
export async function runLinkHealthCheck(): Promise<{ checked: number; broken: number }> {
  const links = (await listAllLinks()).filter((l) => l.status !== "paused");
  let broken = 0;
  for (const l of links) {
    const r = await checkUrl(l.url);
    if (r.status == null || r.status >= 400) broken++;
    await recordLinkCheck(l.id, r.status, r.error);
  }
  return { checked: links.length, broken };
}

/** Data minimisation: delete click records older than the retention period stated in the privacy policy. */
export async function purgeOldClicks(months = 26): Promise<number> {
  const rows = await query(`DELETE FROM outbound_clicks WHERE clicked_at < now() - ($1::int * interval '1 month') RETURNING id`, [months]);
  return rows.length;
}
