import Link from "next/link";

export const inputCls = "w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm focus:border-accent";

export function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-fg-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-fg-subtle">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const { label, hint, className, ...rest } = props;
  return (
    <Field label={label} hint={hint} className={className}>
      <input {...rest} className={inputCls} />
    </Field>
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  const { label, hint, className, ...rest } = props;
  return (
    <Field label={label} hint={hint} className={className}>
      <textarea rows={3} {...rest} className={inputCls} />
    </Field>
  );
}

export function Select({ label, name, value, options, hint, className }: { label: string; name: string; value?: string; options: (string | [string, string])[]; hint?: string; className?: string }) {
  return (
    <Field label={label} hint={hint} className={className}>
      <select name={name} defaultValue={value} className={inputCls}>
        {options.map((o) => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          return (
            <option key={v} value={v}>
              {l}
            </option>
          );
        })}
      </select>
    </Field>
  );
}

export function Check({ name, label, checked, value }: { name: string; label: string; checked?: boolean; value?: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} value={value} defaultChecked={checked} /> {label}
    </label>
  );
}

/** Paired EN/DE inputs for localised fields. */
export function LocalizedField({ name, label, value, multiline = false, rows = 3, hint }: { name: string; label: string; value?: { en: string; de: string }; multiline?: boolean; rows?: number; hint?: string }) {
  return (
    <fieldset className="grid gap-3 md:grid-cols-2">
      <legend className="sr-only">{label}</legend>
      {(["en", "de"] as const).map((l) =>
        multiline ? (
          <Textarea key={l} label={`${label} (${l.toUpperCase()})`} name={`${name}.${l}`} defaultValue={value?.[l] ?? ""} rows={rows} hint={hint} />
        ) : (
          <Input key={l} label={`${label} (${l.toUpperCase()})`} name={`${name}.${l}`} defaultValue={value?.[l] ?? ""} hint={hint} />
        ),
      )}
    </fieldset>
  );
}

export function Section({ title, children, desc }: { title: string; children: React.ReactNode; desc?: string }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-5">
      <h2 className="font-semibold">{title}</h2>
      {desc && <p className="mt-1 text-sm text-fg-muted">{desc}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function Notice({ sp }: { sp: Record<string, string | string[] | undefined> }) {
  const error = typeof sp.error === "string" ? sp.error : null;
  if (error) return <p role="alert" className="mb-4 rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger">{error}</p>;
  if (sp.saved) return <p role="status" className="mb-4 rounded-lg border border-ok/30 bg-ok-soft p-3 text-sm text-ok">Saved.</p>;
  if (sp.denied) return <p role="alert" className="mb-4 rounded-lg border border-warn/30 bg-warn-soft p-3 text-sm text-warn">Your role does not have access to that area.</p>;
  return null;
}

export function PageTitle({ title, action, sub }: { title: string; action?: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-fg-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Btn({ children, variant = "primary", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const v = { primary: "bg-fg text-bg", secondary: "border border-line-strong bg-card", danger: "border border-danger/40 text-danger" }[variant];
  return (
    <button {...rest} className={`rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50 ${v} ${rest.className ?? ""}`}>
      {children}
    </button>
  );
}

export function LinkBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-lg bg-fg px-4 py-2 text-sm font-semibold text-bg hover:opacity-90">
      {children}
    </Link>
  );
}

export function StatusPill({ status }: { status: string }) {
  const t: Record<string, string> = {
    published: "bg-ok-soft text-ok",
    review: "bg-warn-soft text-warn",
    draft: "bg-bg-subtle text-fg-muted",
    archived: "bg-bg-subtle text-fg-subtle",
    active: "bg-ok-soft text-ok",
    placeholder: "bg-warn-soft text-warn",
    paused: "bg-bg-subtle text-fg-muted",
  };
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${t[status] ?? "bg-bg-subtle"}`}>{status}</span>;
}

export function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-fg-subtle">{sub}</p>}
    </div>
  );
}
