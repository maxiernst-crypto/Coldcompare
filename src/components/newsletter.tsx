"use client";

import { useState } from "react";
import { usePrefs } from "./prefs";

export function NewsletterForm() {
  const { d, locale } = usePrefs();
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), consent: form.get("consent") === "on", locale, website: form.get("website") }),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") return <p role="status" className="text-sm font-medium text-ok">{d.newsletter.success}</p>;

  return (
    <form onSubmit={onSubmit} className="min-w-0 space-y-2">
      <div className="flex gap-2">
        <label htmlFor="nl-email" className="sr-only">
          Email
        </label>
        <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder={d.newsletter.placeholder} className="min-w-0 flex-1 rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm" />
        {/* Honeypot field for bots */}
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button type="submit" disabled={state === "sending"} className="shrink-0 rounded-lg bg-fg px-3 py-2 text-sm font-semibold text-bg disabled:opacity-60">
          {d.newsletter.submit}
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs text-fg-muted">
        <input type="checkbox" name="consent" required className="mt-0.5" />
        <span>{d.newsletter.consent}</span>
      </label>
      {state === "error" && <p role="alert" className="text-xs text-danger">{d.newsletter.error}</p>}
    </form>
  );
}
