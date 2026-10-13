"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { parseAnswers, QUIZ_QUESTIONS, recommend, type QuizAnswers } from "@/lib/quiz";
import type { ClientProduct } from "@/lib/product-view";
import { BuyButton } from "./buy-button";
import { DeviceIllustration } from "./device";
import { PriceTag } from "./price-tag";
import { usePrefs } from "./prefs";
import { ScoreBadge, SeedWarning } from "./ui";

export function Quiz({ products }: { products: ClientProduct[] }) {
  const { d, locale } = usePrefs();
  const sp = useSearchParams();
  const initial = useMemo(() => parseAnswers(Object.fromEntries(new URLSearchParams(sp?.toString() ?? ""))), [sp]);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>(initial ?? {});
  const [step, setStep] = useState(initial ? QUIZ_QUESTIONS.length : 0);
  const done = step >= QUIZ_QUESTIONS.length;
  const complete = parseAnswers(answers as Record<string, string>);

  useEffect(() => {
    if (done && complete) {
      const q = new URLSearchParams(complete as unknown as Record<string, string>).toString();
      window.history.replaceState(null, "", `${window.location.pathname}?${q}`);
    }
  }, [done, complete]);

  if (done && complete) {
    const result = recommend(products, complete);
    const byslug = new Map(products.map((p) => [p.slug, p]));
    return (
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight">{d.quiz.resultsTitle}</h2>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setStep(0);
              window.history.replaceState(null, "", window.location.pathname);
            }}
            className="rounded-lg border border-line-strong px-4 py-2 text-sm font-semibold"
          >
            {d.quiz.restart}
          </button>
        </div>
        {result.top.length === 0 && <p className="rounded-2xl border border-dashed border-line p-8 text-center text-fg-muted">{d.quiz.noResults}</p>}
        <ol className="space-y-6">
          {result.top.map((r, i) => {
            const p = byslug.get(r.slug)!;
            return (
              <li key={r.slug} className="rounded-2xl border border-line bg-card p-6">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-xl bg-bg-subtle">
                    <DeviceIllustration formFactor={p.formFactor} label={p.imageAlt} imageUrl={p.imageUrl} className="h-16 w-16" />
                    <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-[#0b0f14]">{i + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold">{p.model}</h3>
                    <p className="text-sm text-fg-muted">{p.tagline}</p>
                  </div>
                  <ScoreBadge score={p.overall} label={d.common.editorialScore} />
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  <div>
                    <h4 className="text-sm font-semibold text-ok">{d.quiz.why}</h4>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {r.reasons.map((c) => (
                        <li key={c}>✓ {d.quiz.reasons[c]}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-warn">{d.quiz.limitations}</h4>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {r.limitations.length ? r.limitations.map((c) => <li key={c}>• {d.quiz.limits[c]}</li>) : <li className="text-fg-subtle">—</li>}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{d.quiz.security}</h4>
                    <ul className="mt-2 space-y-1.5 text-sm text-fg-muted">
                      {r.security.map((c) => (
                        <li key={c}>• {d.quiz.sec[c]}</li>
                      ))}
                      {p.advisories
                        .filter((a) => a.severity === "critical")
                        .map((a) => (
                          <li key={a.title} className="font-medium text-danger">
                            ⚠ {a.title}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
                  <PriceTag prices={p.prices} status={p.factStatus.price} />
                  <div className="ml-auto flex flex-wrap gap-2">
                    <Link href={`/${locale}/wallets/${p.slug}`} className="rounded-lg border border-line-strong px-4 py-2.5 text-sm font-semibold hover:border-accent">
                      {d.common.readReview}
                    </Link>
                    <BuyButton slug={p.slug} locale={locale} placement={`quiz-result-${i + 1}`} label={d.common.visitStore} />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        {result.alternatives.length > 0 && (
          <section>
            <h3 className="font-semibold">{d.quiz.alternatives}</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {result.alternatives.map((r) => (
                <li key={r.slug}>
                  <Link href={`/${locale}/wallets/${r.slug}`} className="inline-block rounded-full border border-line px-3 py-1 text-sm hover:border-accent">
                    {byslug.get(r.slug)?.model}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/${locale}/compare?w=${result.top.map((r) => r.slug).join(",")}`} className="inline-block rounded-full bg-fg px-3 py-1 text-sm font-medium text-bg">
                  {d.common.compare} →
                </Link>
              </li>
            </ul>
          </section>
        )}
        <p className="text-sm text-fg-subtle">{d.quiz.method}</p>
        <p className="text-xs text-fg-subtle">{d.common.affiliateShort}</p>
        <SeedWarning d={d} compact />
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[Math.min(step, QUIZ_QUESTIONS.length - 1)];
  const qd = d.quiz.questions[q.key];
  const current = answers[q.key];
  const isLast = step === QUIZ_QUESTIONS.length - 1;

  return (
    <div className="rounded-2xl border border-line bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between text-sm text-fg-subtle">
        <span>{d.quiz.progress.replace("{n}", String(step + 1)).replace("{total}", String(QUIZ_QUESTIONS.length))}</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-bg-subtle" aria-hidden>
        <div className="h-1.5 rounded-full bg-accent transition-all" style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
      </div>
      <fieldset className="mt-6">
        <legend className="text-xl font-bold">{qd.q}</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {q.options.map((o) => {
            const label = (qd.o as Record<string, string>)[o];
            const on = current === o;
            return (
              <label key={o} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${on ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong"}`}>
                <input
                  type="radio"
                  name={q.key}
                  value={o}
                  checked={on}
                  onChange={() => setAnswers({ ...answers, [q.key]: o })}
                  className="accent-[var(--accent)]"
                />
                <span className="font-medium">{label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-6 flex justify-between gap-3">
        <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="rounded-lg border border-line px-4 py-2 font-semibold disabled:opacity-40">
          {d.quiz.back}
        </button>
        <button type="button" onClick={() => setStep(step + 1)} disabled={!current} className="rounded-lg bg-fg px-5 py-2 font-semibold text-bg disabled:opacity-40">
          {isLast ? d.quiz.seeResults : d.quiz.next}
        </button>
      </div>
    </div>
  );
}
