import { Marked, type Tokens } from "marked";

export type Block =
  | { type: "md"; text: string }
  | { type: "table"; slugs: string[] }
  | { type: "picks" }
  | { type: "product"; slug: string }
  | { type: "weights" }
  | { type: "legal" }
  | { type: "contact" };

const SHORTCODE = /^\s*\[\[(table|picks|product|weights|legal|contact)(?::([a-z0-9,\-]+))?\]\]\s*$/;

/** Split a Markdown body into Markdown chunks and block-level shortcodes (each on its own line). */
export function splitShortcodes(body: string): Block[] {
  const blocks: Block[] = [];
  let buf: string[] = [];
  const flush = () => {
    const text = buf.join("\n").trim();
    if (text) blocks.push({ type: "md", text });
    buf = [];
  };
  for (const line of body.split("\n")) {
    const m = line.match(SHORTCODE);
    if (!m) {
      buf.push(line);
      continue;
    }
    flush();
    const [, name, arg] = m;
    if (name === "table") blocks.push({ type: "table", slugs: (arg ?? "").split(",").filter(Boolean).slice(0, 4) });
    else if (name === "product" && arg) blocks.push({ type: "product", slug: arg });
    else if (name === "picks") blocks.push({ type: "picks" });
    else if (name === "weights") blocks.push({ type: "weights" });
    else if (name === "legal") blocks.push({ type: "legal" });
    else if (name === "contact") blocks.push({ type: "contact" });
  }
  flush();
  return blocks;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const marked = new Marked({
  gfm: true,
  async: false,
  renderer: {
    // Raw HTML in content is never rendered — it is shown as text. Keeps CMS content XSS-safe.
    html(token: Tokens.HTML | Tokens.Tag) {
      return escapeHtml(token.text);
    },
    heading(token: Tokens.Heading) {
      const text = this.parser.parseInline(token.tokens);
      const id = slugify(token.text);
      return `<h${token.depth} id="${id}">${text}</h${token.depth}>\n`;
    },
    link(token: Tokens.Link) {
      const text = this.parser.parseInline(token.tokens);
      const href = token.href ?? "";
      if (!/^(https?:|\/|#|mailto:)/i.test(href)) return text; // drop javascript: and other schemes
      const external = /^https?:/i.test(href);
      const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
      return `<a href="${escapeHtml(href)}"${title}${external ? ' rel="noopener noreferrer" target="_blank"' : ""}>${text}</a>`;
    },
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md) as string;
}

export function extractHeadings(body: string): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      const text = m[1].replace(/[*_`]/g, "");
      out.push({ id: slugify(text), text });
    }
  }
  return out;
}

/** Plain-text excerpt for meta descriptions when none is set. */
export function plainText(md: string, max = 160): string {
  const t = md
    .replace(/\[\[[^\]]+\]\]/g, "")
    .replace(/^#+\s.*$/gm, "")
    .replace(/[>*_`#|]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > max ? `${t.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : t;
}
