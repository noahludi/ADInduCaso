import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";
import { projects } from "../src/gallery/projects.js";

const baseURL = process.env.TEST_URL || "http://127.0.0.1:5173";
const photos = projects.flatMap((project) => project.photos);
const browser = await chromium.launch({ headless: true });
const errors = [];
await fs.mkdir("test-results", { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400 && response.url().startsWith(baseURL))
      errors.push(`${response.status()} ${response.url()}`);
  });
  const response = await page.goto(`${baseURL}/galeria/`, {
    waitUntil: "networkidle",
  });
  assert.equal(response.status(), 200, "Gallery URL must open directly");
  assert.equal(await page.title(), "Galería · AD Indumentaria");
  assert.equal(await page.locator("h1").textContent(), "GALERÍA.");
  assert.equal(
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Galería", exact: true })
      .getAttribute("aria-current"),
    "page",
  );
  assert.equal(await page.locator(".mosaic-card").count(), photos.length);
  await page.locator(".mosaic-image > img").evaluateAll((images) =>
    images.forEach((image) => {
      image.loading = "eager";
    }),
  );
  const brokenImages = await page
    .locator(".mosaic-image > img")
    .evaluateAll(async (images) => {
      await Promise.all(images.map((image) => image.decode().catch(() => {})));
      return images
        .filter((image) => !image.naturalWidth)
        .map((image) => image.src);
    });
  assert.deepEqual(brokenImages, []);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "test-results/gallery-desktop.png",
    fullPage: true,
  });

  for (const [name, kind] of [
    ["Bocetos", "prototype"],
    ["Resultados reales", "result"],
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    assert.equal(
      await page.locator(".mosaic-card").count(),
      photos.filter((photo) => photo.kind === kind).length,
    );
    assert.equal(
      await page.locator(`.mosaic-card:not([data-kind="${kind}"])`).count(),
      0,
    );
  }
  await page.getByRole("button", { name: "Todas", exact: true }).click();

  assert.equal(await page.locator(".gallery-project").count(), projects.length);
  for (const project of projects) {
    await page.getByLabel("Filtrar por proyecto").selectOption(project.id);
    assert.equal(
      await page.locator(".mosaic-card").count(),
      project.photos.length,
    );
    assert.equal(await page.locator(".gallery-project").count(), 1);
    await page.locator(".mosaic-card").first().click();
    const viewer = page.getByRole("dialog");
    await viewer.waitFor({ state: "visible" });
    const hasPair =
      project.photos.some((photo) => photo.kind === "prototype") &&
      project.photos.some((photo) => photo.kind === "result");
    assert.equal(
      await viewer.getByRole("button", { name: "Ver antes y después" }).count(),
      hasPair ? 1 : 0,
    );
    if (hasPair) {
      await viewer.getByRole("button", { name: "Ver antes y después" }).click();
      assert.equal(await viewer.locator(".photo-comparison img").count(), 2);
      const sources = await viewer
        .locator(".photo-comparison img")
        .evaluateAll((images) =>
          images.map((image) => image.getAttribute("src")),
        );
      assert.ok(
        sources.every((src) =>
          project.photos.some((photo) => photo.src === src),
        ),
        "Comparison mixed unrelated projects",
      );
    }
    await page.keyboard.press("Escape");
  }
  await page.getByLabel("Filtrar por proyecto").selectOption("all");

  const opener = page.locator(".mosaic-card").first();
  await opener.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible" });
  assert.equal(
    await page.locator("body").evaluate((el) => el.style.overflow),
    "hidden",
  );
  assert.equal(
    await dialog
      .getByRole("button", { name: "Boceto", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await dialog
    .getByRole("button", { name: "Resultado real", exact: true })
    .click();
  assert.match(
    await dialog.locator(".photo-dialog-stage > img").getAttribute("src"),
    /trabajo-real/,
  );
  const firstResult = await dialog
    .locator(".photo-dialog-stage > img")
    .getAttribute("src");
  await dialog
    .getByRole("button", { name: "Foto siguiente", exact: true })
    .click();
  assert.notEqual(
    await dialog.locator(".photo-dialog-stage > img").getAttribute("src"),
    firstResult,
  );
  await page.keyboard.press("ArrowLeft");
  assert.equal(
    await dialog.locator(".photo-dialog-stage > img").getAttribute("src"),
    firstResult,
  );
  await dialog.getByRole("button", { name: "Boceto", exact: true }).click();
  assert.match(
    await dialog.locator(".photo-dialog-stage > img").getAttribute("src"),
    /buzos-preview/,
  );
  await dialog.locator(".viewer-thumbnails button").last().click();
  assert.match(
    await dialog.locator(".photo-dialog-stage > img").getAttribute("src"),
    /resultado-nuevo/,
  );
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    assert.ok(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
      "Keyboard focus escaped the dialog",
    );
  }
  await page.screenshot({ path: "test-results/gallery-viewer-desktop.png" });
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.equal(
    await page.locator("body").evaluate((el) => el.style.overflow),
    "",
  );
  assert.ok(
    await opener.evaluate((el) => el === document.activeElement),
    "Opening card should regain focus",
  );
  await opener.click();
  await page.mouse.click(5, 5);
  await dialog.waitFor({ state: "hidden" });

  for (const width of [320, 390, 680, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Gallery overflows at ${width}px`,
    );
    const filtersFit = await page
      .locator(".gallery-filters button")
      .evaluateAll((buttons) =>
        buttons.every(
          (button) => button.getBoundingClientRect().right <= innerWidth,
        ),
      );
    assert.ok(filtersFit, `Filters clipped at ${width}px`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/gallery-mobile.png",
    fullPage: true,
  });
  await page.locator(".mosaic-card").last().click();
  await dialog.waitFor({ state: "visible" });
  assert.equal(
    await dialog.evaluate((el) => el.scrollWidth > el.clientWidth),
    false,
    "Mobile viewer overflows horizontally",
  );
  await page.screenshot({ path: "test-results/gallery-viewer-mobile.png" });
  await dialog
    .getByRole("button", { name: "Cerrar foto", exact: true })
    .click();
  await dialog.waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Cómo trabajamos", exact: true })
    .click();
  await page.waitForURL(`${baseURL}/#proceso`);
  await page.getByRole("link", { name: "Ver galería", exact: true }).click();
  await page.waitForURL(`${baseURL}/galeria/`);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".mosaic-card").count(), photos.length);
  await page.goBack({ waitUntil: "networkidle" });
  assert.equal(await page.locator("#process-title").count(), 1);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(`${baseURL}/galeria/`, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () =>
      Number(
        getComputedStyle(document.querySelector(".mosaic-card")).opacity,
      ) === 1,
  );
  await page.locator(".mosaic-card").first().click();
  await dialog.waitFor({ state: "visible" });
  await page.waitForFunction(
    () =>
      Number(
        getComputedStyle(document.querySelector(".photo-dialog-stage > img"))
          .opacity,
      ) === 1,
  );
  await dialog
    .getByRole("button", { name: "Cerrar foto", exact: true })
    .click();
  assert.deepEqual(errors, []);
  console.log(
    "OK: direct gallery URL, filters, prototype/result comparison, thumbnails, keyboard, focus restore, backdrop, mobile viewer, cross-page links, reload/back, Motion and 7 viewport sizes.",
  );
} finally {
  await browser.close();
}
