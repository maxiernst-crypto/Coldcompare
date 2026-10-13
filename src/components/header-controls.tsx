"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Country } from "@/lib/schemas";
import { usePrefs, writeCookie } from "./prefs";

export function ThemeToggle() {
  const { d } = usePrefs();
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("cc_theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  };
  return (
    <button type="button" onClick={toggle} aria-label={d.common.theme} aria-pressed={dark} className="rounded-lg p-2 text-fg-muted hover:bg-bg-subtle hover:text-fg">
      {dark ? (
        <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}

export function PrefsSwitcher({ className = "" }: { className?: string }) {
  const { locale, d, country, setCountry } = usePrefs();
  const pathname = usePathname() ?? `/${locale}`;
  const other = locale === "en" ? "de" : "en";
  const otherPath = pathname.replace(/^\/(en|de)(?=\/|$)/, `/${other}`);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="sr-only" htmlFor="cc-country">
        {d.common.country}
      </label>
      <select
        id="cc-country"
        value={country}
        onChange={(e) => setCountry(e.target.value as Country)}
        className="rounded-lg border border-line bg-card px-2 py-1.5 text-sm text-fg-muted"
      >
        {(["GB", "DE", "INTL"] as const).map((c) => (
          <option key={c} value={c}>
            {d.countries[c]}
          </option>
        ))}
      </select>
      <Link
        href={otherPath}
        hrefLang={other}
        onClick={() => writeCookie("cc_locale", other)}
        className="rounded-lg border border-line px-2.5 py-1.5 text-sm font-medium uppercase text-fg-muted hover:border-accent hover:text-fg"
        aria-label={`${d.common.language}: ${other === "de" ? "Deutsch" : "English"}`}
      >
        {other}
      </Link>
    </div>
  );
}

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const { d } = usePrefs();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" className="rounded-lg p-2 text-fg hover:bg-bg-subtle">
        <span className="sr-only">{open ? d.nav.close : d.nav.menu}</span>
        <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div id="mobile-nav" className="absolute inset-x-0 top-full border-b border-line bg-bg shadow-lg">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-3 font-medium hover:bg-bg-subtle">
                {l.label}
              </Link>
            ))}
            <PrefsSwitcher className="mt-3 border-t border-line px-3 pt-4" />
          </nav>
        </div>
      )}
    </div>
  );
}
