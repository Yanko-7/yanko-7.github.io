import { test, expect } from "@playwright/test";
import { writeFile } from "node:fs/promises";

test("Article fonts use local subsets only when needed", async ({
  browser,
  baseURL,
}) => {
  test.setTimeout(90_000);
  const measurements = [];
  for (const path of [
    "/",
    "/posts/neural-network-training-notes/",
    "/posts/modern-cpp-notes/",
    "/posts/competitive-programming-toolkit/",
  ]) {
    // A fresh context measures a first visit without a warm browser font cache.
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const fonts = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .filter(
          entry =>
            (/noto-(sans|serif)-sc/.test(entry.name) ||
              entry.name.includes("jetbrains-mono")) &&
            /\.woff2?(?:\?|$)/.test(entry.name)
        )
        .map(entry => ({
          url: entry.name,
          bytes: (entry as PerformanceResourceTiming).encodedBodySize,
        }))
    );
    if (path === "/") {
      expect(fonts).toHaveLength(0);
    } else {
      expect(fonts.length).toBeGreaterThan(0);
      for (const font of fonts) {
        expect(new URL(font.url).origin).toBe(new URL(baseURL!).origin);
        if (/noto-(sans|serif)-sc/.test(font.url))
          expect(font.url).toContain("400-normal");
        expect(font.url).toMatch(/\.woff2$/);
        expect(font.bytes).toBeGreaterThan(0);
      }
      const session = await context.newCDPSession(page);
      await session.send("DOM.enable");
      await session.send("CSS.enable");
      const { root } = await session.send("DOM.getDocument");
      const { nodeId } = await session.send("DOM.querySelector", {
        nodeId: root.nodeId,
        selector: "#article p",
      });
      const used = await session.send("CSS.getPlatformFontsForNode", {
        nodeId,
      });
      expect(
        used.fonts.some(
          font =>
            font.isCustomFont &&
            font.familyName.includes("Noto Serif SC") &&
            font.glyphCount > 0
        )
      ).toBe(true);
      await expect(page.locator("#article")).toHaveCSS("font-size", "17px");
      await expect(page.locator("#article")).toHaveCSS(
        "line-height",
        "31.45px"
      );
      expect(fonts.some(font => font.url.includes("noto-sans-sc"))).toBe(false);
    }
    if (path === "/posts/neural-network-training-notes/") {
      await page.locator("#article").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "test-results/serif-desktop.png" });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator("#article").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "test-results/serif-mobile.png" });
    }
    if (path === "/posts/modern-cpp-notes/") {
      await expect(page.locator("#article pre code").first()).toHaveCSS(
        "font-family",
        /JetBrains Mono/
      );
      const session = await context.newCDPSession(page);
      await session.send("DOM.enable");
      await session.send("CSS.enable");
      const { root } = await session.send("DOM.getDocument");
      const { nodeId } = await session.send("DOM.querySelector", {
        nodeId: root.nodeId,
        selector: "#article pre code span span",
      });
      const used = await session.send("CSS.getPlatformFontsForNode", {
        nodeId,
      });
      expect(
        used.fonts.some(
          font =>
            font.isCustomFont &&
            font.familyName.includes("JetBrains Mono") &&
            font.glyphCount > 0
        )
      ).toBe(true);
      await page.locator("#article pre").first().scrollIntoViewIfNeeded();
      await page.screenshot({ path: "test-results/article-fonts.png" });
    }
    measurements.push({
      path,
      chineseChunks: fonts.filter(font => /noto-(sans|serif)-sc/.test(font.url))
        .length,
      chineseBytes: fonts
        .filter(font => /noto-(sans|serif)-sc/.test(font.url))
        .reduce((total, font) => total + font.bytes, 0),
      codeBytes: fonts
        .filter(font => font.url.includes("jetbrains-mono"))
        .reduce((total, font) => total + font.bytes, 0),
      bytes: fonts.reduce((total, font) => total + font.bytes, 0),
    });
    await context.close();
  }
  await writeFile(
    "test-results/font-transfer.json",
    JSON.stringify(measurements, null, 2)
  );
});
