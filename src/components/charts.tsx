/**
 * Minimal, dependency-free charts for the admin dashboard.
 * Single-series → no legend; values in text ink; native <title> tooltips per mark; a table view sits alongside.
 */

export function DailyBars({ data, label }: { data: { day: string; clicks: number }[]; label: string }) {
  const W = 720;
  const H = 180;
  const pad = { l: 32, r: 8, t: 12, b: 22 };
  const max = Math.max(1, ...data.map((d) => d.clicks));
  const n = Math.max(1, data.length);
  const slot = (W - pad.l - pad.r) / n;
  const bw = Math.max(2, slot - 2); // 2px surface gap between bars
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const peak = data.reduce((best, d, i) => (d.clicks > (data[best]?.clicks ?? -1) ? i : best), 0);
  const ticks = [0, Math.round(max / 2), max];
  return (
    <figure>
      <figcaption className="mb-2 text-sm font-semibold">{label}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label}: bar chart, ${data.length} days, maximum ${max}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth="1" />
            <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="var(--fg-subtle)">
              {t}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = pad.l + i * slot + 1;
          const top = y(d.clicks);
          const h = H - pad.b - top;
          const r = Math.min(4, bw / 2, h);
          // Rounded data-end, square at the baseline.
          const path = h <= 0 ? "" : `M${x},${H - pad.b} V${top + r} Q${x},${top} ${x + r},${top} H${x + bw - r} Q${x + bw},${top} ${x + bw},${top + r} V${H - pad.b} Z`;
          return (
            <g key={d.day} className="group">
              <rect x={x - 1} y={pad.t} width={slot} height={H - pad.t - pad.b} fill="transparent" />
              {path && <path d={path} fill="var(--chart)" className="transition-opacity group-hover:opacity-80" />}
              <title>{`${d.day}: ${d.clicks}`}</title>
              {i === peak && d.clicks > 0 && (
                <text x={x + bw / 2} y={top - 3} textAnchor="middle" fontSize="10" fill="var(--fg-muted)">
                  {d.clicks}
                </text>
              )}
            </g>
          );
        })}
        <text x={pad.l} y={H - 6} fontSize="10" fill="var(--fg-subtle)">
          {data[0]?.day}
        </text>
        <text x={W - pad.r} y={H - 6} fontSize="10" textAnchor="end" fill="var(--fg-subtle)">
          {data.at(-1)?.day}
        </text>
      </svg>
    </figure>
  );
}

/** Ranked horizontal bars with the value as text (a table in disguise — readable without color). */
export function RankBars({ rows, title, empty = "No data yet." }: { rows: { label: string; value: number; sub?: string }[]; title: string; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <section className="rounded-2xl border border-line bg-card p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-fg-subtle">{empty}</p>
      ) : (
        <table className="mt-3 w-full text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} title={`${r.label}: ${r.value}`}>
                <td className="w-2/5 truncate py-1 pr-2">{r.label}</td>
                <td className="py-1">
                  <div className="h-2 rounded-r-[4px] bg-[var(--chart)]" style={{ width: `${(r.value / max) * 100}%`, minWidth: 2 }} />
                </td>
                <td className="w-16 py-1 pl-2 text-right tabular">
                  {r.value}
                  {r.sub && <span className="block text-xs text-fg-subtle">{r.sub}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
