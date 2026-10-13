import { describe, expect, it } from "vitest";
import { extractHeadings, plainText, renderMarkdown, slugify, splitShortcodes } from "@/lib/markdown";

describe("markdown & shortcodes", () => {
  it("splits block shortcodes from markdown", () => {
    const blocks = splitShortcodes("Intro\n\n[[table:a,b]]\n\nMore\n[[picks]]\n[[legal]]");
    expect(blocks.map((b) => b.type)).toEqual(["md", "table", "md", "picks", "legal"]);
    expect(blocks[1]).toEqual({ type: "table", slugs: ["a", "b"] });
  });

  it("limits comparison tables to four products", () => {
    const [b] = splitShortcodes("[[table:a,b,c,d,e]]");
    expect(b).toEqual({ type: "table", slugs: ["a", "b", "c", "d"] });
  });

  it("does not render raw HTML (XSS-safe CMS content)", () => {
    const html = renderMarkdown('Hello <script>alert(1)</script> <img src=x onerror="x()">');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
  });

  it("drops javascript: links and marks external links", () => {
    expect(renderMarkdown("[x](javascript:alert(1))")).not.toContain("href");
    expect(renderMarkdown("[x](https://a.com)")).toContain('rel="noopener noreferrer"');
    expect(renderMarkdown("[x](/en/learn)")).not.toContain("target=");
  });

  it("adds heading ids that match the table of contents", () => {
    const body = "## Backup and recovery\ntext\n## Final verdict";
    const html = renderMarkdown(body);
    for (const h of extractHeadings(body)) expect(html).toContain(`id="${h.id}"`);
  });

  it("slugifies German text", () => {
    expect(slugify("Größe & Übersicht")).toBe("grosse-ubersicht");
  });

  it("creates plain-text excerpts", () => {
    expect(plainText("## Title\nSome **bold** [link](/x) text [[picks]]", 100)).toBe("Some bold link text");
  });
});
