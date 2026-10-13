import { expect, test } from "@playwright/test";

const EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "change-me-please-123";

async function login(page: import("@playwright/test").Page, email = EMAIL, password = PASSWORD) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  if (password === PASSWORD) await page.waitForURL(/\/admin$/);
}

test("admin area requires authentication", async ({ page }) => {
  await page.goto("/admin/products");
  await expect(page).toHaveURL(/\/admin\/login/);
  await login(page, EMAIL, "wrong-password-123");
  await expect(page.getByText("Invalid email or password.")).toBeVisible();
});

test("admin can sign in and see the dashboard", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("heading", { name: /Welcome/ })).toBeVisible();
  await expect(page.getByText("Editorial queue")).toBeVisible();
});

test("publishing requires the editorial checklist", async ({ page }) => {
  await login(page);
  await page.goto("/admin/articles/new");
  const slug = `e2e-${Date.now()}`;
  await page.locator('input[name="title"]').fill("E2E test article");
  await page.locator('input[name="slug"]').fill(slug);
  await page.locator('select[name="status"]').selectOption("published");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.locator('p[role="alert"]')).toContainText("checklist");
  // Save as draft instead, then delete.
  await page.locator('input[name="title"]').fill("E2E test article");
  await page.locator('input[name="slug"]').fill(slug);
  await page.locator('select[name="status"]').selectOption("draft");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Saved.")).toBeVisible();
  page.on("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete article" }).click();
  await expect(page).toHaveURL(/\/admin\/articles\?saved=1/);
});

test("analytics dashboard renders", async ({ page }) => {
  await login(page);
  await page.goto("/admin/analytics");
  await expect(page.getByText("Outbound clicks per day")).toBeVisible();
  await expect(page.getByText("Revenue per 1,000 sessions")).toBeVisible();
});
