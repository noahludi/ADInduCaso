import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.env.TEST_URL || "http://127.0.0.1:5173";
await fs.mkdir("test-results", { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", (route) => {
    if (new URL(route.request().url()).origin === new URL(baseURL).origin)
      return route.continue();
    return route.abort();
  });
  const response = await page.goto(baseURL, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("h1").count(), 1);
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  await page.screenshot({ path: "test-results/hero-desktop.png" });

  const tabs = page.getByRole("tab");
  assert.equal(await tabs.count(), 5);
  const titles = [
    "Nos contás tu idea.",
    "La hacemos visible.",
    "Vos das el sí.",
    "Manos a la prenda.",
    "Tu idea, puesta.",
  ];
  for (let i = 0; i < 5; i++) {
    await tabs.nth(i).click();
    assert.equal(await tabs.nth(i).getAttribute("aria-selected"), "true");
    assert.equal(
      await page.getByRole("tabpanel").locator("h3").textContent(),
      titles[i],
    );
    const brokenImages = await page
      .getByRole("tabpanel")
      .locator("img")
      .evaluateAll(async (images) => {
        await Promise.all(
          images.map((image) => image.decode().catch(() => {})),
        );
        return images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.src);
      });
    assert.deepEqual(
      brokenImages,
      [],
      `Missing process images in step ${i + 1}`,
    );
  }
  await page
    .getByRole("button", { name: "Volver al inicio", exact: true })
    .click();
  assert.equal(await tabs.nth(0).getAttribute("aria-selected"), "true");
  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
  await page.getByRole("button", { name: "El boceto", exact: true }).click();
  assert.match(
    await page.locator(".work-main-photo > img").getAttribute("src"),
    /buzos-preview/,
  );
  await page
    .getByRole("button", { name: "Ver foto 3 del trabajo terminado" })
    .click();
  assert.match(
    await page.locator(".work-main-photo > img").getAttribute("src"),
    /trabajo-real-03/,
  );
  await page
    .getByRole("button", { name: "Ver foto 1 del trabajo terminado" })
    .click();
  for (const question of await page.locator(".faq-item h3 button").all()) {
    await question.click();
    assert.equal(await question.getAttribute("aria-expanded"), "true");
    const answerId = await question.getAttribute("aria-controls");
    await page.locator(`#${answerId}`).waitFor({ state: "visible" });
    assert.equal(await page.locator(`#${answerId}`).isVisible(), true);
    await question.click();
    assert.equal(await question.getAttribute("aria-expanded"), "false");
  }
  for (const link of await page.locator('a[target="_blank"]').all()) {
    assert.match(
      await link.getAttribute("href"),
      /^https:\/\/(www\.instagram\.com\/|wa\.me\/5493434698263\?text=)/,
    );
    assert.match(await link.getAttribute("rel"), /noopener/);
  }
  const whatsappLinks = page.locator('a[href^="https://wa.me/"]');
  assert.equal(await whatsappLinks.count(), 4);
  for (const link of await whatsappLinks.all()) {
    const url = new URL(await link.getAttribute("href"));
    assert.equal(url.pathname, "/5493434698263");
    assert.equal(
      url.searchParams.get("text"),
      "¡Hola AD! Quiero consultar por unas prendas personalizadas.",
    );
  }
  const removedCopy = [
    "TU IDEA, PUESTA.",
    "INDUMENTARIA CON TU IDENTIDAD",
    "VISUALIZACIÓN 3D · BASADA EN UN TRABAJO REAL",
    "UNA IDEA TUYA. UN PROCESO COMPARTIDO.",
    "DESLIZÁ Y CONOCÉ EL PROCESO",
    "ASÍ TRABAJAMOS",
    "Vos traés la idea. Nosotros te acompañamos",
    "TODO EMPIEZA CON UN",
    "FOTO REAL · TRABAJO TERMINADO",
    "DEL DISEÑO A LA REALIDAD",
    "Una idea. Dos colores.",
    "TU PRÓXIMA PRENDA EMPIEZA CON UN MENSAJE",
    "Para tu marca, tu equipo o simplemente para vos.",
    "De una idea a algo que te representa.",
  ];
  const bodyText = await page.locator("body").innerText();
  for (const text of removedCopy)
    assert.equal(
      bodyText.includes(text),
      false,
      `Removed copy remains: ${text}`,
    );
  await page
    .locator(".process-sticky")
    .screenshot({ path: "test-results/process-desktop.png" });

  for (const width of [320, 360, 390, 680, 768, 900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    assert.equal(overflow, false, `Horizontal overflow at ${width}px`);
    for (const selector of [
      ".header-inner",
      ".hero-actions",
      ".contact-actions",
    ]) {
      const fits = await page.locator(selector).evaluate((element) =>
        [...element.children].every((child) => {
          const rect = child.getBoundingClientRect();
          return (
            rect.width === 0 ||
            (rect.left >= 0 && rect.right <= window.innerWidth + 1)
          );
        }),
      );
      assert.ok(fits, `Contact controls overflow at ${width}px: ${selector}`);
    }
    const imageGeometry = await page
      .locator(".hero-hoodies")
      .evaluate((image) => {
        const bounds = image.getBoundingClientRect();
        return {
          renderedRatio: bounds.width / bounds.height,
          naturalRatio: image.naturalWidth / image.naturalHeight,
          top: bounds.top,
          copyBottom: document
            .querySelector(".hero-copy")
            .getBoundingClientRect().bottom,
        };
      });
    assert.ok(
      Math.abs(imageGeometry.renderedRatio - imageGeometry.naturalRatio) < 0.01,
      `The hero image must retain its aspect ratio at ${width}px`,
    );
    if (width <= 680)
      assert.ok(
        imageGeometry.top >= imageGeometry.copyBottom,
        "Mobile image overlaps the heading",
      );
    if ([320, 768, 1024].includes(width)) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `test-results/responsive-${width}.png` });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Abrir menú" }).click();
  assert.equal(await page.getByRole("navigation").isVisible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("navigation").isVisible(), false);
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Cómo trabajamos" })
    .click();
  assert.equal(await page.getByRole("navigation").isVisible(), false);
  assert.match(page.url(), /#proceso$/);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  await page.screenshot({ path: "test-results/hero-mobile.png" });

  const animated = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  animated.on("pageerror", (error) => errors.push(error.message));
  await animated.goto(baseURL, { waitUntil: "networkidle" });
  await animated.waitForFunction(
    () =>
      Number(getComputedStyle(document.querySelector(".hero-art")).opacity) ===
      1,
  );
  const initialFloat = await animated
    .locator(".hoodies-float")
    .evaluate((el) => getComputedStyle(el).transform);
  await animated.waitForFunction(
    (value) =>
      getComputedStyle(document.querySelector(".hoodies-float")).transform !==
      value,
    initialFloat,
  );
  await animated.getByRole("tab").nth(2).click();
  await animated.getByRole("heading", { name: "Vos das el sí." }).waitFor();
  await animated.locator("#trabajos").scrollIntoViewIfNeeded();
  await animated
    .getByRole("button", { name: "El boceto", exact: true })
    .click();
  await animated.waitForFunction(
    () =>
      Number(
        getComputedStyle(document.querySelector(".work-main-photo > img"))
          .opacity,
      ) === 1,
  );
  await animated.locator(".faq-item h3 button").first().click();
  await animated.locator("#faq-answer-0").waitFor({ state: "visible" });
  await animated.locator(".faq-item h3 button").first().click();
  await animated.waitForFunction(
    () =>
      document.querySelector("#faq-answer-0").getBoundingClientRect().height ===
      0,
  );
  await animated.setViewportSize({ width: 390, height: 844 });
  await animated.reload({ waitUntil: "networkidle" });
  await animated.getByRole("button", { name: "Abrir menú" }).click();
  await animated
    .getByRole("navigation")
    .getByRole("link", { name: "Trabajos", exact: true })
    .click();
  await animated.waitForFunction(
    () =>
      Number(getComputedStyle(document.querySelector(".work-grid")).opacity) ===
      1,
  );
  await animated.locator("#contacto").scrollIntoViewIfNeeded();
  await animated.waitForFunction(
    () =>
      Number(
        getComputedStyle(document.querySelector(".contact-inner")).opacity,
      ) === 1,
  );
  await animated.screenshot({ path: "test-results/contact-mobile.png" });
  await animated.close();
  assert.deepEqual(errors, []);
  console.log(
    "OK: 5 scroll steps, keyboard, gallery, FAQs, Instagram + exact WhatsApp number, removed copy, mobile menu, 9 responsive sizes, desktop/mobile Motion animations and reduced motion. No browser errors.",
  );
} finally {
  await browser.close();
}
