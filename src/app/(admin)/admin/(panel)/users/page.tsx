import { Btn, Check, Input, inputCls, Notice, PageTitle, Section, Select } from "@/components/admin-ui";
import { ROLE_DESCRIPTIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { query } from "@/lib/db";
import type { Role } from "@/lib/schemas";
import { createUserAction, updateUserAction } from "../../actions";

export default async function UsersAdmin({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requirePermission("users.manage");
  const sp = await searchParams;
  const users = await query<{ id: string; email: string; name: string; role: Role; disabled: boolean; last_login_at: Date | null }>(
    `SELECT id, email, name, role, disabled, last_login_at FROM users ORDER BY created_at`,
  );
  const roles = Object.keys(ROLE_DESCRIPTIONS) as Role[];
  return (
    <div className="max-w-5xl">
      <PageTitle title="Users & roles" />
      <Notice sp={sp} />
      <ul className="mb-6 grid gap-2 text-sm sm:grid-cols-2">
        {roles.map((r) => (
          <li key={r} className="rounded-lg border border-line bg-card p-3">
            <strong>{r}</strong> — {ROLE_DESCRIPTIONS[r]}
          </li>
        ))}
      </ul>
      <div className="space-y-3">
        {users.map((u) => (
          <form key={u.id} action={updateUserAction} className="grid gap-3 rounded-2xl border border-line bg-card p-4 md:grid-cols-6 md:items-end">
            <input type="hidden" name="id" value={u.id} />
            <div className="md:col-span-2">
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-fg-subtle">
                {u.email} · last login {u.last_login_at ? u.last_login_at.toISOString().slice(0, 16).replace("T", " ") : "never"}
              </p>
            </div>
            <label>
              <span className="text-xs text-fg-subtle">Role</span>
              <select name="role" defaultValue={u.role} className={inputCls}>
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-xs text-fg-subtle">New password (optional)</span>
              <input name="password" type="password" minLength={12} autoComplete="new-password" className={inputCls} />
            </label>
            <div className="flex flex-col gap-1">
              <Check name="disabled" label="Disabled" checked={u.disabled} />
              <Check name="revoke" label="Sign out everywhere" />
            </div>
            <Btn type="submit" variant="secondary">
              Update
            </Btn>
          </form>
        ))}
      </div>
      <form action={createUserAction} className="mt-8">
        <Section title="Invite user" desc="Share the initial password through a secure channel; ask them to change it under Account.">
          <div className="grid gap-3 md:grid-cols-4">
            <Input label="Name" name="name" required />
            <Input label="Email" name="email" type="email" required />
            <Input label="Initial password (min. 12)" name="password" type="password" minLength={12} required autoComplete="new-password" />
            <Select label="Role" name="role" value="writer" options={roles} />
          </div>
          <Btn type="submit">Create user</Btn>
        </Section>
      </form>
    </div>
  );
}
