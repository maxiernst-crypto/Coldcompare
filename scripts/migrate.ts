import "./env";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pool } from "../src/lib/db";

async function main() {
  const db = pool();
  await db.query(`CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
  const dir = path.join(process.cwd(), "db", "migrations");
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  const applied = new Set((await db.query<{ name: string }>(`SELECT name FROM schema_migrations`)).rows.map((r) => r.name));
  for (const f of files) {
    if (applied.has(f)) continue;
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      await client.query(readFileSync(path.join(dir, f), "utf8"));
      await client.query(`INSERT INTO schema_migrations (name) VALUES ($1)`, [f]);
      await client.query("COMMIT");
      console.log(`applied ${f}`);
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
  console.log("migrations up to date");
  await db.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
