import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/en";
import type { Locale } from "@/lib/schemas";
import { CookieSettingsButton } from "./consent";
import { MobileNav, PrefsSwitcher, ThemeToggle } from "./header-controls";
import { NewsletterForm } from "./newsletter";
import { Container, SeedWarning } from "./ui";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold tracking-tight ${className}`}>
      <svg aria-hidden width="28" height="28" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="8" fill="var(--fg)" />
        <circle cx="16" cy="13.5" r="4.5" fill="none" stroke="var(--accent)" strokeWidth="2.6" />
        <rect x="14.7" y="17" width="2.6" height="8" rx="1.3" fill="var(--accent)" />
      </svg>
      <span>
        Cold<span className="text-accent-strong">Compare</span>
      </span>
    </span>
  );
}

export function SiteHeader({ locale, d }: { locale: Locale; d: Dictionary }) {
  const links = [
    { href: `/${locale}/compare`, label: d.nav.compare },
    { href: `/${locale}/wallets`, label: d.nav.wallets },
    { href: `/${locale}/best`, label: d.nav.best },
    { href: `/${locale}/learn`, label: d.nav.learn },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded focus:bg-card focus:px-3 focus:py-2">
        {d.nav.skip}
      </a>
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}`} aria-label={`${d.meta.siteName} — ${d.nav.home}`}>
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-fg-muted hover:bg-bg-subtle hover:text-fg">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <PrefsSwitcher className="hidden lg:flex" />
          <ThemeToggle />
          <Link href={`/${locale}/quiz`} className="hidden rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-[#0b0f14] hover:brightness-105 sm:inline-flex">
            {d.nav.quiz}
          </Link>
          <MobileNav links={[...links, { href: `/${locale}/quiz`, label: d.nav.quiz }]} />
        </div>
      </Container>
    </header>
  );
}

export function SiteFooter({ locale, d, newsletterEnabled }: { locale: Locale; d: Dictionary; newsletterEnabled: boolean }) {
  const f = d.footer;
  const col = (title: string, items: { href: string; label: string }[]) => (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-fg-muted">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="hover:text-fg">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <footer className="mt-20 border-t border-line bg-bg-subtle">
      <Container className="py-12">
        {newsletterEnabled && (
          <div className="mb-10 grid grid-cols-1 gap-6 rounded-2xl border border-line bg-card p-5 sm:p-6 md:grid-cols-2 md:items-center [&>*]:min-w-0">
            <div>
              <h2 className="text-lg font-semibold">{d.newsletter.title}</h2>
              <p className="mt-1 text-sm text-fg-muted">{d.newsletter.sub}</p>
            </div>
            <NewsletterForm />
          </div>
        )}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-fg-muted">{d.meta.tagline}</p>
            <p className="mt-3 text-xs text-fg-subtle">{d.footer.notAdvice}</p>
          </div>
          {col(f.sections.explore, [
            { href: `/${locale}/compare`, label: d.nav.compare },
            { href: `/${locale}/wallets`, label: d.nav.wallets },
            { href: `/${locale}/best`, label: d.nav.best },
            { href: `/${locale}/compare/head-to-head`, label: d.comparisons.title },
            { href: `/${locale}/learn`, label: d.nav.learn },
            { href: `/${locale}/quiz`, label: d.nav.quiz },
          ])}
          {col(f.sections.company, [
            { href: `/${locale}/about`, label: f.about },
            { href: `/${locale}/methodology`, label: f.methodology },
            { href: `/${locale}/editorial-policy`, label: f.editorial },
            { href: `/${locale}/affiliate-disclosure`, label: f.disclosure },
            { href: `/${locale}/contact`, label: f.contact },
          ])}
          <div>
            {col(f.sections.legal, [
              { href: `/${locale}/privacy`, label: f.privacy },
              { href: `/${locale}/cookies`, label: f.cookies },
              { href: `/${locale}/terms`, label: f.terms },
              { href: `/${locale}/impressum`, label: f.impressum },
            ])}
            <div className="mt-2 text-sm text-fg-muted">
              <CookieSettingsButton label={f.cookieSettings} />
            </div>
          </div>
        </div>
        <div className="mt-10 space-y-4">
          <SeedWarning d={d} compact />
          <p className="text-xs text-fg-subtle">{d.common.affiliateDisclosure}</p>
          <p className="text-xs text-fg-subtle">
            © {new Date().getFullYear()} {d.meta.siteName}. {f.rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}
