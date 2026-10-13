import Link from "next/link";
import { notFound } from "next/navigation";
import { Btn, Check, Input, Notice, PageTitle, Section, Select, Textarea } from "@/components/admin-ui";
import { MarkdownEditor } from "@/components/markdown-editor";
import { EDITORIAL_CHECKLIST } from "@/lib/admin-forms";
import { can } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { getArticleById, listAuthors, listTranslationsAdmin } from "@/lib/repo/articles";
import { listAllProducts } from "@/lib/repo/products";
import { articlePath } from "@/lib/resolve";
import { ARTICLE_TYPES } from "@/lib/schemas";
import { deleteArticleAction, saveArticleAction } from "../../../actions";

export default async function ArticleEdit({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>> }) {
  const user = await requirePermission("content.edit");
  const { id } = await params;
  const sp = await searchParams;
  const isNew = id === "new";
  if (!isNew && !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const a = isNew ? null : await getArticleById(id);
  if (!isNew && !a) notFound();
  const [authors, products, translations] = await Promise.all([listAuthors(), listAllProducts(), a ? listTranslationsAdmin(a.translationKey) : Promise.resolve([])]);
  const canPublish = can(user.role, "content.publish");
  const statuses = canPublish ? ["draft", "review", "published", "archived"] : ["draft", "review"];
  const faqRows = [...(a?.data.faqs ?? []), { q: "", a: "" }, { q: "", a: "" }];
  const pickRows = [...(a?.data.picks ?? []), { product: "", label: "" }];
  const srcRows = [...(a?.data.sources ?? []), { label: "", url: "" }];
  const productOptions: [string, string][] = [["", "—"], ...products.map((p) => [p.slug, p.model] as [string, string])];
  const prefill = { type: sp.type, locale: sp.locale, translationKey: sp.translationKey };

  return (
    <div className="max-w-5xl">
      <PageTitle
        title={isNew ? "New article" : a!.title}
        action={
          a && (
            <Link href={articlePath(a)} target="_blank" className="text-sm underline">
              View on site ↗
            </Link>
          )
        }
      />
      <Notice sp={sp} />
      {a && (
        <p className="mb-4 text-sm text-fg-muted">
          Translations:{" "}
          {translations.map((t) => (
            <Link key={t.id} href={`/admin/articles/${t.id}`} className="mr-2 underline">
              {t.locale.toUpperCase()} ({t.status})
            </Link>
          ))}
          {(["en", "de"] as const)
            .filter((l) => !translations.some((t) => t.locale === l))
            .map((l) => (
              <Link key={l} href={`/admin/articles/new?type=${a.type}&locale=${l}&translationKey=${encodeURIComponent(a.translationKey)}`} className="mr-2 font-medium text-accent-strong underline">
                + Create {l.toUpperCase()} translation
              </Link>
            ))}
        </p>
      )}
      <form action={saveArticleAction} className="space-y-6">
        <input type="hidden" name="id" value={a?.id ?? ""} />
        <Section title="Basics">
          <div className="grid gap-4 md:grid-cols-3">
            <Select label="Type" name="type" value={a?.type ?? prefill.type ?? "learn"} options={[...ARTICLE_TYPES]} />
            <Select label="Language" name="locale" value={a?.locale ?? prefill.locale ?? "en"} options={["en", "de"]} />
            <Select label="Status" name="status" value={a?.status ?? "draft"} options={statuses} hint={canPublish ? "Publishing requires the checklist below." : "Writers submit for review; editors publish."} />
            <Input label="Title (H1)" name="title" defaultValue={a?.title} required className="md:col-span-2" />
            <Input label="Slug" name="slug" defaultValue={a?.slug} required pattern="[a-z0-9-]+" hint="Reviews: use the wallet's slug." />
            <Input label="Translation key" name="translationKey" defaultValue={a?.translationKey ?? prefill.translationKey} hint="Same key = translations of each other (hreflang)." />
            <Select label="Author" name="authorId" value={a?.authorId ?? "editorial-team"} options={[["", "—"], ...authors.map((x) => [x.id, x.name] as [string, string])]} />
            <Input label="Fact-checked on" name="reviewedAt" type="date" defaultValue={a?.reviewedAt ?? ""} />
            <Input label="Products (comma-separated slugs)" name="productSlugs" defaultValue={a?.productSlugs.join(", ")} className="md:col-span-3" hint="Review: [wallet]. Comparison: [a, b]. Used for related links." />
          </div>
        </Section>
        <Section title="SEO">
          <Input label="Meta title (optional; used as full <title>)" name="metaTitle" defaultValue={a?.metaTitle ?? ""} maxLength={70} hint="≈ 50–60 characters." />
          <Textarea label="Meta description" name="metaDescription" defaultValue={a?.metaDescription ?? ""} maxLength={170} rows={2} hint="≈ 140–160 characters, unique per page." />
          <Textarea label="Excerpt / standfirst" name="excerpt" defaultValue={a?.excerpt ?? ""} rows={2} />
          <Check name="noindex" label="noindex (keep out of search engines)" checked={a?.data.noindex} />
        </Section>
        <Section title="Body">
          <Textarea label="Quick verdict (reviews & comparisons)" name="verdict" defaultValue={a?.data.verdict ?? ""} rows={3} />
          <MarkdownEditor name="body" defaultValue={a?.body ?? ""} />
        </Section>
        <Section title="Guide picks" desc="Ranked picks for [[picks]]. Choose for editorial reasons only — never commission.">
          {pickRows.map((p, i) => (
            <div key={i} className="grid gap-3 md:grid-cols-[1fr_2fr]">
              <Select label={`Pick ${i + 1}`} name={`pick.${i}.product`} value={p.product} options={productOptions} />
              <Input label="Label" name={`pick.${i}.label`} defaultValue={p.label} />
            </div>
          ))}
        </Section>
        <Section title="FAQs">
          {faqRows.map((f, i) => (
            <div key={i} className="grid gap-3 md:grid-cols-2">
              <Input label="Question" name={`faq.${i}.q`} defaultValue={f.q} />
              <Textarea label="Answer" name={`faq.${i}.a`} defaultValue={f.a} rows={2} />
            </div>
          ))}
        </Section>
        <Section title="Sources">
          {srcRows.map((s, i) => (
            <div key={i} className="grid gap-3 md:grid-cols-2">
              <Input label="Label" name={`src.${i}.label`} defaultValue={s.label} />
              <Input label="URL" name={`src.${i}.url`} type="url" defaultValue={s.url} />
            </div>
          ))}
        </Section>
        {canPublish && (
          <Section title="Editorial checklist (required to publish)">
            {EDITORIAL_CHECKLIST.map((c, i) => (
              <Check key={i} name={`check.${i}`} label={c} />
            ))}
          </Section>
        )}
        <div className="sticky bottom-0 flex gap-3 border-t border-line bg-bg-subtle/95 py-4 backdrop-blur">
          <Btn type="submit">Save</Btn>
          <Link href="/admin/articles" className="rounded-lg px-4 py-2 text-sm">
            Cancel
          </Link>
        </div>
      </form>
      {a && canPublish && (
        <form action={deleteArticleAction} className="mt-10 border-t border-line pt-6">
          <input type="hidden" name="id" value={a.id} />
          <Btn variant="danger" type="submit">
            Delete article
          </Btn>
        </form>
      )}
    </div>
  );
}
