import { test, expect } from "@playwright/test";

test("home, theme persistence, profile, and local assets", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Yongkang Qi");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  const before = await page.locator("html").getAttribute("data-theme");
  await page.locator("#theme-btn").click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    before === "dark" ? "light" : "dark"
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    before === "dark" ? "light" : "dark"
  );
  await page.screenshot({ path: "test-results/home-dark.png", fullPage: true });
  await page.getByRole("link", { name: "More about me" }).click();
  await expect(page.locator("h1")).toContainText("About me");
  await expect(page.getByRole("link", { name: "Download CV" })).toHaveCount(0);
  expect((await page.request.get("/assets/pdf/cv.pdf")).status()).toBe(200);
  expect((await page.request.get("/og.png")).status()).toBe(200);
  expect(errors).toEqual([]);
});

test("mobile menu, article math and no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  await page.locator("#menu-btn").click();
  await expect(page.locator("#menu-btn")).toHaveAttribute(
    "aria-expanded",
    "true"
  );
  await page
    .locator("#menu-items")
    .getByRole("link", { name: "Posts" })
    .click();
  await expect(page.locator("h1")).toHaveText("Posts");
  for (const path of [
    "/",
    "/about/",
    "/posts/neural-network-training-notes/",
    "/posts/competitive-programming-toolkit/",
  ]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
  }
  await page.goto("/posts/neural-network-training-notes/");
  expect(await page.locator(".katex").count()).toBeGreaterThan(0);
  await expect(page.locator(".katex-error")).toHaveCount(0);
  expect(
    await page
      .locator("article img")
      .evaluateAll(images =>
        images.every(
          img =>
            (img as HTMLImageElement).complete &&
            (img as HTMLImageElement).naturalWidth > 0
        )
      )
  ).toBe(true);
});

test("production search finds English and Chinese terms", async ({ page }) => {
  await page.goto("/search/");
  const search = page.locator(".pagefind-ui__search-input");
  await search.fill("Rust");
  await expect(
    page.locator(".pagefind-ui__result-title").first()
  ).toContainText("Rust");
  await search.fill("神经网络");
  await expect(
    page.locator(".pagefind-ui__result-title").first()
  ).toContainText("神经网络");
  await search.fill("动态规划");
  await expect(
    page.locator(".pagefind-ui__result-title").first()
  ).toBeVisible();
  await page.locator(".pagefind-ui__result-link").first().click();
  await expect(page.locator("#article")).toBeVisible();
});

test("every published note has readable headings, formulas, and mobile layout", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const { readFileSync } = await import("node:fs");
  const { imported } = JSON.parse(
    readFileSync("docs/content-migration.json", "utf8")
  );
  for (const post of imported.filter(
    (post: { draft: boolean }) => !post.draft
  )) {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`/posts/${post.slug}/`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".katex-error")).toHaveCount(0);
    const headings = await page
      .locator("#article :is(h2,h3,h4,h5,h6)")
      .evaluateAll(elements =>
        elements.map(element => Number(element.tagName.slice(1)))
      );
    expect(headings[0], post.slug).toBe(2);
    for (let i = 1; i < headings.length; i++)
      expect(headings[i], post.slug).toBeLessThanOrEqual(headings[i - 1] + 1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      ),
      post.slug
    ).toBe(true);
    await expect(page.locator('#article img[src^="http"]')).toHaveCount(0);
  }
  await page.goto("/posts/modern-cpp-notes/");
  await expect(page.locator("#article")).not.toContainText("==C++");
  await expect(
    page
      .locator("#article strong")
      .filter({ hasText: "C++11 提供了 constexpr" })
  ).toHaveCount(1);
  await page.goto("/posts/counting-and-differences/");
  await expect(page.locator(".katex-display")).toHaveCount(1);
  await page.locator(".katex-display").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/note-math-mobile.png" });
});
