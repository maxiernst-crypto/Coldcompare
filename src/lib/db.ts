import pg, { type PoolClient, type QueryResultRow } from "pg";

const { Pool, types } = pg;
type Pool = InstanceType<typeof Pool>;
// Return DATE columns as plain YYYY-MM-DD strings (no timezone shifting).
types.setTypeParser(1082, (v: string) => v);

declare global {
  // eslint-disable-next-line no-var
  var __ccPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
  const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(connectionString);
  return new Pool({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    ssl: isLocal || process.env.DATABASE_SSL === "false" ? undefined : { rejectUnauthorized: false },
  });
}

export function pool(): Pool {
  if (!globalThis.__ccPool) globalThis.__ccPool = createPool();
  return globalThis.__ccPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(sql: string, params: unknown[] = []): Promise<T[]> {
  const res = await pool().query<T>(sql, params);
  return res.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    const out = await fn(client);
    await client.query("COMMIT");
    return out;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

/** pg returns DATE columns as JS Date in local time; normalise to YYYY-MM-DD. */
export function toDateString(v: unknown): string | null {
  if (!v) return null;
  if (typeof v === "string") return v.slice(0, 10);
  if (v instanceof Date) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return null;
}

export function toIso(v: unknown): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  return String(v);
}
