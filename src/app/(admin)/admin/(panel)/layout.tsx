import Link from "next/link";
import { Logo } from "@/components/chrome";
import { can, type Permission } from "@/lib/auth/permissions";
import { requireUser } from "@/lib/auth/session";
import { isPreviewMode } from "@/lib/visibility";
import { logoutAction } from "../actions";

const NAV: { href: string; label: string; perm?: Permission }[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Wallets", perm: "content.edit" },
  { href: "/admin/articles", label: "Articles", perm: "content.edit" },
  { href: "/admin/links", label: "Affiliate links", perm: "links.manage" },
  { href: "/admin/analytics", label: "Analytics", perm: "analytics.view" },
  { href: "/admin/revenue", label: "Revenue", perm: "revenue.manage" },
  { href: "/admin/authors", label: "Authors", perm: "content.publish" },
  { href: "/admin/subscribers", label: "Subscribers", perm: "settings.manage" },
  { href: "/admin/settings", label: "Settings", perm: "settings.manage" },
  { href: "/admin/users", label: "Users", perm: "users.manage" },
  { href: "/admin/audit", label: "Audit log", perm: "settings.manage" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-line bg-card lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin">
            <Logo />
          </Link>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {NAV.filter((n) => !n.perm || can(user.role, n.perm)).map((n) => (
            <Link key={n.href} href={n.href} className="shrink-0 rounded-lg px-3 py-2 text-sm text-fg-muted hover:bg-bg-subtle hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-line p-4 text-sm lg:block">
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-fg-subtle">
            {user.email} · {user.role}
          </p>
          <div className="mt-3 flex gap-3">
            <Link href="/admin/account" className="text-xs underline">
              Account
            </Link>
            <form action={logoutAction}>
              <button className="text-xs underline">Sign out</button>
            </form>
            <Link href="/" className="text-xs underline">
              View site
            </Link>
          </div>
          {isPreviewMode() && <p className="mt-3 rounded bg-warn-soft p-2 text-xs text-warn">CONTENT_PREVIEW is on: “review” content is visible on this deployment.</p>}
        </div>
      </aside>
      <main className="min-w-0 p-4 sm:p-8">{children}</main>
    </div>
  );
}
