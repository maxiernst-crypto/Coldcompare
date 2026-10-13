"use client";

import { useMemo, useState } from "react";
import { renderMarkdown } from "@/lib/markdown";

/** Markdown textarea with a live preview. Shortcodes are shown as placeholders in the preview. */
export function MarkdownEditor({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const html = useMemo(
    () => (tab === "preview" ? renderMarkdown(value.replace(/^\s*\[\[([^\]]+)\]\]\s*$/gm, "> 🧩 Live block: `$1`")) : ""),
    [tab, value],
  );
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm">
        {(["write", "preview"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-3 py-1 ${tab === t ? "bg-fg text-bg" : "border border-line"}`}>
            {t === "write" ? "Write" : "Preview"}
          </button>
        ))}
        <span className="ml-auto text-xs text-fg-subtle">{words} words</span>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={28}
        className={`w-full rounded-lg border border-line-strong bg-bg p-3 font-mono text-sm ${tab === "write" ? "" : "hidden"}`}
      />
      {tab === "preview" && <div className="prose-cc min-h-[20rem] rounded-lg border border-line bg-bg p-5" dangerouslySetInnerHTML={{ __html: html }} />}
      <p className="mt-2 text-xs text-fg-subtle">
        Shortcodes (own line): <code>[[table:slug-a,slug-b]]</code> comparison table · <code>[[picks]]</code> guide picks · <code>[[product:slug]]</code> product card ·{" "}
        <code>[[weights]]</code> scoring weights · <code>[[legal]]</code> operator details · <code>[[contact]]</code> contact email. Raw HTML is not rendered.
      </p>
    </div>
  );
}
