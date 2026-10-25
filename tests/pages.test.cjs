const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("@playwright/test");

// Match a GitHub project site, including Linux's case-sensitive asset paths.
test("production build works beneath the GitHub Pages repository path", async () => {
  const root = path.join(__dirname, "..", "dist");
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".txt": "text/plain",
  };
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      assert(pathname.startsWith("/Kotoba/"));
      const segments = pathname
        .slice("/Kotoba/".length)
        .split("/")
        .filter(Boolean);
      if (pathname.endsWith("/")) segments.push("index.html");
      let file = root;
      for (const segment of segments) {
        assert(segment !== "." && segment !== "..");
        assert(
          (await fs.readdir(file)).includes(segment),
          "Incorrect asset path or filename case",
        );
        file = path.join(file, segment);
      }
      response.writeHead(200, {
        "Content-Type":
          (types[path.extname(file)] || "application/octet-stream") +
          "; charset=utf-8",
      });
      response.end(await fs.readFile(file));
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      ...(process.platform === "win32" ? { channel: "msedge" } : {}),
    });
    const origin = "http://127.0.0.1:" + server.address().port;
    for (const width of [1440, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      const errors = [],
        requests = [],
        failed = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", (request) => requests.push(request.url()));
      page.on("requestfailed", (request) => failed.push(request.url()));
      page.on("response", (response) => {
        if (response.status() >= 400) failed.push(response.url());
      });
      await page.goto(origin + "/Kotoba/", { waitUntil: "networkidle" });
      assert.equal(await page.locator(".word-card").count(), 298);
      const assets = await page
        .locator('link[rel="stylesheet"], script[src]')
        .evaluateAll((elements) => elements.map((e) => e.href || e.src));
      assert(
        assets.length >= 2 &&
          assets.every((url) => url.startsWith(origin + "/Kotoba/assets/")),
      );
      const loadedFonts = await page.evaluate(async () => {
        const fonts = await document.fonts.load(
          '500 24px "Kotoba Maru"',
          "日本語",
        );
        return (
          fonts.length > 0 && fonts.every((font) => font.status === "loaded")
        );
      });
      assert(loadedFonts, "Bundled Japanese font did not load");
      await page.locator("#themeBtn").click();
      await page.waitForTimeout(300);
      assert(
        await page
          .locator("body")
          .evaluate(
            (e) =>
              e.classList.contains("dark") &&
              !e.classList.contains("theme-changing"),
          ),
      );
      for (const name of [
        "lessons",
        "grammar",
        "kana",
        "numbers",
        "settings",
        "library",
      ]) {
        await page.locator('[data-page="' + name + '"]').click();
        assert.equal(
          await page
            .locator('[data-page="' + name + '"]')
            .getAttribute("aria-current"),
          "page",
        );
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          name + " overflows at " + width,
        );
      }
      await page.locator("#searchInput").fill("taberu");
      await page.locator(".word-open").first().click();
      assert(
        await page
          .locator("#wordDetailsDialog")
          .evaluate((dialog) => dialog.open),
      );
      assert.equal(new URL(page.url()).pathname, "/Kotoba/");
      assert(
        requests.every((url) => url.startsWith(origin + "/Kotoba/")),
        "Unexpected external runtime dependency",
      );
      assert.deepEqual(failed, [], "Failed production resource requests");
      assert.deepEqual(errors, [], "Production JavaScript errors");
      await context.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
});
