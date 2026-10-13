import "./env";
import { pool } from "../src/lib/db";
import { hashPassword, passwordProblem } from "../src/lib/auth/crypto";

/** Usage: npm run admin:create -- email@example.com "Full Name" [role]   (password from ADMIN_PASSWORD or prompt-free env) */
async function main() {
  const [email = process.env.ADMIN_EMAIL, name = "Administrator", role = "admin"] = process.argv.slice(2);
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Provide an email argument (or ADMIN_EMAIL) and ADMIN_PASSWORD in the environment.");
  const problem = passwordProblem(password);
  if (problem) throw new Error(problem);
  const hash = await hashPassword(password);
  await pool().query(
    `INSERT INTO users (email, name, role, password_hash) VALUES ($1,$2,$3,$4)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, session_version = users.session_version + 1`,
    [email.toLowerCase(), name, role, hash],
  );
  console.log(`user ${email} (${role}) ready`);
  await pool().end();
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
