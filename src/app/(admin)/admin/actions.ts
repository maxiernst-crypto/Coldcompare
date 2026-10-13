"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSafeHttpUrl } from "@/lib/affiliate";
import { FormError, parseArticleForm, parseCsv, parseProductForm, SLUG_RE } from "@/lib/admin-forms";
import { hashPassword, passwordProblem } from "@/lib/auth/crypto";
import { can } from "@/lib/auth/permissions";
import { login, logout, requirePermission, requireUser, type AdminUser } from "@/lib/auth/session";
import { query } from "@/lib/db";
import { runLinkHealthCheck } from "@/lib/jobs";
import { addRevenue, deleteRevenue, upsertTraffic } from "@/lib/repo/analytics";
import { deleteArticle, getArticleById, saveArticle, saveAuthor } from "@/lib/repo/articles";
import { audit } from "@/lib/repo/audit";
import { deleteLink, getLink, saveLink } from "@/lib/repo/links";
import { deleteProduct, getProduct, upsertProduct } from "@/lib/repo/products";
import { getSiteSettings, setSetting } from "@/lib/repo/settings";
import type { Role } from "@/lib/schemas";
import { normalizeWeights, validateWeights } from "@/lib/scoring";

const s = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
};

/** Run an action; user-correctable errors are sent back to the form as ?error=… */
async function run(back: string, fn: () => Promise<string | void>): Promise<never> {
  let to: string;
  try {
    to = (await fn()) ?? `${back}${back.includes("?") ? "&" : "?"}saved=1`;
  } catch (e) {
    if (e instanceof FormError) to = `${back}${back.includes("?") ? "&" : "?"}error=${encodeURIComponent(e.message)}`;
    else if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "23505") to = `${back}${back.includes("?") ? "&" : "?"}error=${encodeURIComponent("That slug/key already exists.")}`;
    else throw e;
  }
  redirect(to);
}

function refreshSite() {
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------- auth
export async function loginAction(fd: FormData) {
  const r = await login(s(fd, "email"), s(fd, "password"));
  if (r === "ok") redirect("/admin");
  redirect(`/admin/login?error=${r}`);
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- products
export async function saveProductAction(fd: FormData) {
  const user = await requirePermission("content.edit");
  const original = s(fd, "originalSlug");
  await run(original ? `/admin/products/${original}` : "/admin/products/new", async () => {
    const p = parseProductForm(fd);
    const before = original ? await getProduct(original) : null;
    if (p.status === "published" && before?.status !== "published" && !can(user.role, "content.publish")) throw new FormError("Your role cannot publish.");
    if (p.status === "published" && !p.lastVerifiedAt) throw new FormError("Set the “last verified” date before publishing a product.");
    if (original && original !== p.slug) await query(`UPDATE products SET slug = $2 WHERE slug = $1`, [original, p.slug]);
    await upsertProduct(p);
    await audit(user, before ? "product.update" : "product.create", "product", p.slug, { status: p.status });
    refreshSite();
    return `/admin/products/${p.slug}?saved=1`;
  });
}

export async function deleteProductAction(fd: FormData) {
  const user = await requirePermission("content.publish");
  const slug = s(fd, "slug");
  await deleteProduct(slug);
  await audit(user, "product.delete", "product", slug);
  refreshSite();
  redirect("/admin/products?saved=1");
}

// ---------------------------------------------------------------- articles
export async function saveArticleAction(fd: FormData) {
  const user = await requirePermission("content.edit");
  const id = s(fd, "id") || null;
  await run(id ? `/admin/articles/${id}` : "/admin/articles/new", async () => {
    const before = id ? await getArticleById(id) : null;
    const canPublish = can(user.role, "content.publish");
    // Writers may edit drafts but cannot alter content that is already live.
    if (before?.status === "published" && !canPublish) throw new FormError("Only editors can change published content.");
    const a = parseArticleForm(fd, { canPublish });
    const newId = await saveArticle(id, a);
    await audit(user, id ? "article.update" : "article.create", "article", newId, { status: a.status, slug: a.slug, locale: a.locale });
    refreshSite();
    return `/admin/articles/${newId}?saved=1`;
  });
}

export async function deleteArticleAction(fd: FormData) {
  const user = await requirePermission("content.publish");
  const id = s(fd, "id");
  await deleteArticle(id);
  await audit(user, "article.delete", "article", id);
  refreshSite();
  redirect("/admin/articles?saved=1");
}

// ---------------------------------------------------------------- affiliate links
export async function saveLinkAction(fd: FormData) {
  const user = await requirePermission("links.manage");
  const id = s(fd, "id") || null;
  await run("/admin/links", async () => {
    const url = s(fd, "url");
    if (!isSafeHttpUrl(url)) throw new FormError("Link URL must start with https:// or http://");
    const country = s(fd, "country").toUpperCase() || "*";
    if (!/^(\*|[A-Z]{2}|INTL)$/.test(country)) throw new FormError("Country must be '*', INTL or a two-letter code like GB or DE.");
    const isAffiliate = fd.get("isAffiliate") === "on";
    const status = (["active", "placeholder", "paused"] as const).find((x) => x === s(fd, "status")) ?? "placeholder";
    if (isAffiliate && status === "placeholder") throw new FormError("An affiliate link cannot have status “placeholder”. Set it to active or paused.");
    const productSlug = s(fd, "productSlug");
    if (!(await getProduct(productSlug))) throw new FormError("Unknown product.");
    const saved = await saveLink(id, {
      productSlug,
      country,
      retailer: s(fd, "retailer") || "Official store",
      isOfficial: fd.get("isOfficial") === "on",
      network: s(fd, "network") || "none",
      url,
      isAffiliate,
      status,
      addUtm: fd.get("addUtm") === "on",
      priority: Number(s(fd, "priority") || 0) || 0,
      commissionNote: s(fd, "commissionNote") || null,
    });
    await audit(user, id ? "link.update" : "link.create", "affiliate_link", saved, { productSlug, country, isAffiliate, status });
  });
}

export async function deleteLinkAction(fd: FormData) {
  const user = await requirePermission("links.manage");
  const id = s(fd, "id");
  const link = await getLink(id);
  await deleteLink(id);
  await audit(user, "link.delete", "affiliate_link", id, { productSlug: link?.productSlug });
  redirect("/admin/links?saved=1");
}

export async function checkLinksAction() {
  const user = await requirePermission("links.manage");
  const r = await runLinkHealthCheck();
  await audit(user, "link.health_check", "affiliate_link", "*", r);
  redirect(`/admin/links?checked=${r.checked}&broken=${r.broken}`);
}

// ---------------------------------------------------------------- settings
export async function saveSettingsAction(fd: FormData) {
  const user = await requirePermission("settings.manage");
  await run("/admin/settings", async () => {
    const weights = normalizeWeights({
      security: Number(s(fd, "w.security")),
      backup: Number(s(fd, "w.backup")),
      usability: Number(s(fd, "w.usability")),
      privacy: Number(s(fd, "w.privacy")),
      features: Number(s(fd, "w.features")),
      value: Number(s(fd, "w.value")),
    });
    const problem = validateWeights(weights);
    if (problem) throw new FormError(problem);
    const current = await getSiteSettings();
    const contactEmail = s(fd, "contactEmail");
    if (s(fd, "sp.url") && !isSafeHttpUrl(s(fd, "sp.url"))) throw new FormError("Sponsored URL must be http(s).");
    await setSetting("scoring_weights", weights);
    await setSetting("site", {
      ...current,
      sponsoredSlotsEnabled: fd.get("sponsoredSlotsEnabled") === "on",
      newsletterEnabled: fd.get("newsletterEnabled") === "on",
      utmSource: s(fd, "utmSource") || "coldcompare",
      contactEmail,
      sponsored: { title: s(fd, "sp.title"), text: s(fd, "sp.text"), url: s(fd, "sp.url"), sponsor: s(fd, "sp.sponsor") },
      legal: {
        entityName: s(fd, "legal.entityName"),
        address: (fd.get("legal.address") as string | null)?.trim() ?? "",
        representative: s(fd, "legal.representative"),
        email: s(fd, "legal.email"),
        phone: s(fd, "legal.phone"),
        vatId: s(fd, "legal.vatId"),
        register: s(fd, "legal.register"),
      },
    });
    await audit(user, "settings.update", "settings", "site", { weights });
    refreshSite();
  });
}

// ---------------------------------------------------------------- revenue & traffic
export async function addRevenueAction(fd: FormData) {
  const user = await requirePermission("revenue.manage");
  await run("/admin/revenue", async () => {
    const periodStart = s(fd, "periodStart");
    const periodEnd = s(fd, "periodEnd");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(periodStart) || !/^\d{4}-\d{2}-\d{2}$/.test(periodEnd)) throw new FormError("Enter a valid period.");
    const revenue = Number(s(fd, "revenue").replace(",", "."));
    if (!Number.isFinite(revenue)) throw new FormError("Revenue must be a number.");
    await addRevenue({
      periodStart,
      periodEnd,
      network: s(fd, "network") || "direct",
      productSlug: s(fd, "productSlug") || null,
      country: s(fd, "country").toUpperCase() || null,
      orders: Number(s(fd, "orders") || 0) || 0,
      revenue,
      currency: (["EUR", "GBP", "USD"] as const).find((c) => c === s(fd, "currency")) ?? "EUR",
      note: s(fd, "note") || null,
    });
    await audit(user, "revenue.add", "revenue", periodStart, { revenue });
  });
}

export async function deleteRevenueAction(fd: FormData) {
  const user = await requirePermission("revenue.manage");
  const id = s(fd, "id");
  await deleteRevenue(id);
  await audit(user, "revenue.delete", "revenue", id);
  redirect("/admin/revenue?saved=1");
}

/**
 * Import Search Console / analytics CSV exports.
 * Accepted headers (case-insensitive): date, page, query, clicks, impressions, position, sessions.
 */
export async function importTrafficAction(fd: FormData) {
  const user = await requirePermission("revenue.manage");
  await run("/admin/analytics", async () => {
    const source = (["gsc", "ga4", "plausible", "manual"] as const).find((x) => x === s(fd, "source"));
    if (!source) throw new FormError("Choose a source.");
    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) throw new FormError("Choose a CSV file.");
    if (file.size > 5_000_000) throw new FormError("File too large (max 5 MB).");
    const table = parseCsv(await file.text());
    const [header, ...data] = table;
    const idx = (names: string[]) => header.findIndex((h) => names.includes(h.trim().toLowerCase()));
    const iDate = idx(["date", "day", "datum"]);
    if (iDate < 0) throw new FormError("CSV needs a 'date' column (YYYY-MM-DD).");
    const iPage = idx(["page", "page_path", "url", "top pages", "landing page"]);
    const iQuery = idx(["query", "top queries", "search query"]);
    const iClicks = idx(["clicks"]);
    const iImpr = idx(["impressions"]);
    const iPos = idx(["position", "avg. position", "average position"]);
    const iSess = idx(["sessions", "visits", "visitors"]);
    const n = (r: string[], i: number) => (i >= 0 && r[i] !== undefined && r[i] !== "" ? Number(r[i].replace("%", "")) : null);
    const parsed = data
      .filter((r) => /^\d{4}-\d{2}-\d{2}/.test(r[iDate] ?? ""))
      .map((r) => {
        let page = iPage >= 0 ? r[iPage] : "*";
        try {
          if (/^https?:/.test(page)) page = new URL(page).pathname;
        } catch {
          /* keep as-is */
        }
        return { day: r[iDate].slice(0, 10), source, pagePath: page || "*", query: iQuery >= 0 ? r[iQuery] ?? "" : "", sessions: n(r, iSess), impressions: n(r, iImpr), clicks: n(r, iClicks), position: n(r, iPos) };
      });
    if (!parsed.length) throw new FormError("No valid rows found.");
    const count = await upsertTraffic(parsed);
    await audit(user, "traffic.import", "traffic", source, { rows: count });
    return `/admin/analytics?imported=${count}`;
  });
}

// ---------------------------------------------------------------- users & authors
export async function createUserAction(fd: FormData) {
  const user = await requirePermission("users.manage");
  await run("/admin/users", async () => {
    const email = s(fd, "email").toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new FormError("Enter a valid email.");
    const pw = s(fd, "password");
    const problem = passwordProblem(pw);
    if (problem) throw new FormError(problem);
    const role = (["admin", "editor", "writer", "analyst"] as const).find((r) => r === s(fd, "role")) ?? "writer";
    await query(`INSERT INTO users (email, name, role, password_hash) VALUES ($1,$2,$3,$4)`, [email, s(fd, "name") || email, role, await hashPassword(pw)]);
    await audit(user, "user.create", "user", email, { role });
  });
}

export async function updateUserAction(fd: FormData) {
  const user = await requirePermission("users.manage");
  await run("/admin/users", async () => {
    const id = s(fd, "id");
    const role = (["admin", "editor", "writer", "analyst"] as const).find((r) => r === s(fd, "role")) as Role | undefined;
    if (!role) throw new FormError("Invalid role.");
    const disabled = fd.get("disabled") === "on";
    if (id === user.id && (role !== "admin" || disabled)) throw new FormError("You cannot demote or disable yourself.");
    const pw = s(fd, "password");
    if (pw) {
      const problem = passwordProblem(pw);
      if (problem) throw new FormError(problem);
      await query(`UPDATE users SET password_hash = $2, session_version = session_version + 1 WHERE id = $1`, [id, await hashPassword(pw)]);
    }
    await query(`UPDATE users SET role = $2, disabled = $3, session_version = session_version + CASE WHEN $3 OR $4 THEN 1 ELSE 0 END WHERE id = $1`, [id, role, disabled, fd.get("revoke") === "on"]);
    await audit(user, "user.update", "user", id, { role, disabled, passwordReset: !!pw });
  });
}

export async function changeOwnPasswordAction(fd: FormData) {
  const user: AdminUser = await requireUser();
  await run("/admin/account", async () => {
    const pw = s(fd, "password");
    const problem = passwordProblem(pw);
    if (problem) throw new FormError(problem);
    if (pw !== s(fd, "confirm")) throw new FormError("Passwords do not match.");
    await query(`UPDATE users SET password_hash = $2, session_version = session_version + 1 WHERE id = $1`, [user.id, await hashPassword(pw)]);
    await audit(user, "user.password", "user", user.id);
    return "/admin/login?error=changed";
  });
}

export async function saveAuthorAction(fd: FormData) {
  const user = await requirePermission("content.publish");
  await run("/admin/authors", async () => {
    const id = s(fd, "id");
    if (!SLUG_RE.test(id)) throw new FormError("Author ID must be a slug.");
    if (!s(fd, "name")) throw new FormError("Name is required.");
    await saveAuthor({
      id,
      name: s(fd, "name"),
      role: { en: s(fd, "role.en"), de: s(fd, "role.de") },
      bio: { en: s(fd, "bio.en"), de: s(fd, "bio.de") },
      avatarUrl: s(fd, "avatarUrl") || null,
      isPlaceholder: fd.get("isPlaceholder") === "on",
    });
    await audit(user, "author.save", "author", id);
    refreshSite();
  });
}
