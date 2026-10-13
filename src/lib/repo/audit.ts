import { query } from "../db";

export async function audit(user: { id: string; email: string } | null, action: string, entity: string, entityId: string, detail: Record<string, unknown> = {}): Promise<void> {
  await query(`INSERT INTO audit_log (user_id, user_email, action, entity, entity_id, detail) VALUES ($1,$2,$3,$4,$5,$6)`, [
    user?.id ?? null,
    user?.email ?? null,
    action,
    entity,
    entityId,
    JSON.stringify(detail),
  ]);
}

export async function listAudit(limit = 200) {
  return query<{ id: string; at: Date; user_email: string | null; action: string; entity: string; entity_id: string; detail: Record<string, unknown> }>(
    `SELECT id, at, user_email, action, entity, entity_id, detail FROM audit_log ORDER BY at DESC LIMIT $1`,
    [limit],
  );
}
