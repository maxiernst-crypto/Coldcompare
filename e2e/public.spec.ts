import { expect, test } from "@playwright/test";

test("home page shows hero, CTAs, disclosure and structured data", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find the Best Hardware Wallet for Your Bitcoin & Crypto");
  await expect(page.getByRole("link", { name: "Compare Hardware Wallets" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Find My Wallet", exact: true })).toBeVisible();
  await expect(page.getByText("Some links on this website are affiliate links.").first()).toBeAttached();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join("")).toContain('"@type":"Organization"');
  const noHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(noHorizontalScroll).toBe(true);
});

test("root redirects by language and pages carry hreflang", async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({ locale: "de-DE", baseURL });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/de$/);
  const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((els) => els.map((e) => e.getAttribute("hreflang")));
  expect(alternates).toEqual(expect.arrayContaining(["en", "de", "x-default"]));
  await ctx.close();
});

test("comparison engine: select wallets, shareable URL, highlight differences", async ({ page, isMobile }) => {
  await page.goto("/en/compare?w=bitbox02");
  await expect(page.locator("table").first()).toContainText("BitBox02");
  await page.getByRole("button", { name: /Trezor Safe 3/ }).first().click();
  await expect(page).toHaveURL(/w=bitbox02,trezor-safe-3/);
  await page.getByLabel("Show only differences").check();
  await expect(page.locator("tbody th[scope=row]", { hasText: "Bitcoin-only device" })).toHaveCount(0); // both "No" → hidden
  if (!isMobile) {
    await page.reload();
    await expect(page.locator("thead")).toContainText("Trezor Safe 3");
  }
});

test("comparison engine caps the selection at four wallets", async ({ page }) => {
  await page.goto("/en/compare?w=bitbox02,trezor-safe-3,trezor-safe-5,ledger-flex");
  await page.getByRole("button", { name: /Keystone 3 Pro/ }).click();
  await expect(page.getByText("You can compare up to four wallets.")).toBeVisible();
});

test("quiz produces three explained recommendations", async ({ page }) => {
  await page.goto("/en/quiz");
  const answers = ["Bitcoin only", "Beginner", "Up to €/£200", "Desktop", "Preferred", "Not important", "Maybe later", "Simple setup"];
  for (const a of answers) {
    await page.getByLabel(a, { exact: true }).check();
    await page.getByRole("button", { name: /Next|See my recommendations/ }).click();
  }
  await expect(page.getByRole("heading", { name: "Your top matches" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Read review" })).toHaveCount(3);
  await expect(page.getByText("Why it matches").first()).toBeVisible();
  await expect(page.getByText("Security considerations").first()).toBeVisible();
  await expect(page).toHaveURL(/assets=btc/);
});

test("review page: verdict, scores, advisories, sponsored buy link and Product/Review schema", async ({ page }) => {
  await page.goto("/en/wallets/coldcard-q");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("COLDCARD Q Review");
  await expect(page.getByText("Seed-generation entropy flaw (2026)").first()).toBeVisible();
  await expect(page.getByText(/have not performed hands-on lab testing/)).toBeVisible();
  const buy = page.locator('a[href^="/go/coldcard-q"]').first();
  await expect(buy).toHaveAttribute("rel", /sponsored/);
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("");
  expect(ld).toContain('"@type":"Product"');
  expect(ld).toContain('"@type":"Review"');
  expect(ld).not.toContain("aggregateRating");
});

test("outbound redirect sends visitors to the official store", async ({ request }) => {
  const res = await request.get("/go/bitbox02?l=en&p=e2e", { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  expect(res.headers()["location"]).toContain("bitbox.swiss");
  expect(res.headers()["x-robots-tag"]).toContain("noindex");
});

test("cross-language article URLs redirect to the translation", async ({ page }) => {
  await page.goto("/de/learn/how-to-back-up-bitcoin");
  await expect(page).toHaveURL(/\/de\/learn\/seed-phrase-sicher-aufbewahren$/);
});

test("seed phrase warning is present and no page asks for a seed", async ({ page }) => {
  await page.goto("/en/learn/seed-phrases-and-recovery");
  await expect(page.getByText(/Never type your recovery phrase/).first()).toBeVisible();
  await expect(page.locator('input[name*="seed" i], textarea[name*="seed" i], input[name*="mnemonic" i]')).toHaveCount(0);
});
