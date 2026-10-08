import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.env.TEST_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
await fs.mkdir("test-results", { recursive: true });
const errors = [];
try {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const page = await browser.newPage({ reducedMotion });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(baseURL, { waitUntil: "networkidle" });
    for (const [width, height] of [
      [1440, 1000],
      [768, 900],
      [390, 844],
      [320, 640],
      [844, 390],
    ]) {
      await page.setViewportSize({ width, height });
      const scrollToProgress = async (progress) => {
        await page.evaluate((value) => {
          const track = document.querySelector(".process-track");
          window.scrollTo({
            top:
              track.getBoundingClientRect().top +
              scrollY +
              (track.offsetHeight - innerHeight) * value,
            behavior: "instant",
          });
        }, progress);
      };
      for (const index of [0, 1, 2, 3, 4, 2, 0]) {
        await scrollToProgress(index / 5 + 0.06);
        await page.waitForFunction(
          (value) =>
            document.querySelector("#step-panel").dataset.step ===
            String(value),
          index,
        );
        const geometry = await page
          .locator(".transformation-frame")
          .evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            return {
              width: bounds.width,
              height: bounds.height,
              top: bounds.top,
              bottom: bounds.bottom,
              overflow: document.documentElement.scrollWidth > innerWidth,
            };
          });
        assert.ok(
          geometry.width > 150 && geometry.height > 70,
          `Image collapsed at ${width}x${height}`,
        );
        assert.ok(
          geometry.top >= 0 && geometry.bottom <= height,
          `Image clipped at ${width}x${height}`,
        );
        assert.equal(geometry.overflow, false);
        const image = page.locator(
          index === 0
            ? ".reference-image"
            : index < 3
              ? ".mockup-image"
              : ".result-image",
        );
        await image.evaluate((element) => element.decode());
        assert.ok(await image.evaluate((element) => element.naturalWidth > 0));
        if (index !== 3)
          assert.ok(
            await image.evaluate(
              (element) => Number(getComputedStyle(element).opacity) > 0.95,
            ),
            "Active image is invisible",
          );
        if (
          reducedMotion === "no-preference" &&
          [1440, 390].includes(width) &&
          [0, 1, 4].includes(index)
        ) {
          await page.screenshot({
            path: `test-results/process-${width}-step-${index + 1}.png`,
          });
        }
      }
      if (reducedMotion === "no-preference") {
        await scrollToProgress(0.7);
        await page.waitForFunction(() => {
          const clip = getComputedStyle(
            document.querySelector(".result-image"),
          ).clipPath;
          return (
            clip !== "none" &&
            clip !== "inset(0px 100% 0px 0px)" &&
            clip !== "inset(0px 0% 0px 0px)"
          );
        });
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("tab").nth(0).click();
    await page.getByRole("tab").nth(0).focus();
    await page.keyboard.press("End");
    await page.waitForFunction(
      () => document.querySelector("#step-panel").dataset.step === "4",
    );
    assert.equal(
      await page
        .getByRole("tab")
        .nth(4)
        .evaluate((el) => el === document.activeElement),
      true,
    );
    await page.getByRole("button", { name: "Volver al inicio" }).click();
    await page.waitForFunction(
      () => document.querySelector("#step-panel").dataset.step === "0",
    );
    await page.getByRole("link", { name: "Ver este proyecto" }).click();
    await page.waitForURL(`${baseURL}/galeria/#el-amigo`);
    await page.waitForFunction(() => {
      const rect = document.querySelector("#el-amigo").getBoundingClientRect();
      return rect.top >= 0 && rect.top < innerHeight;
    });
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    "OK: forward/reverse scroll, five stages, photo visibility and geometry, print wipe, keyboard, project link, desktop/tablet/mobile/landscape and reduced motion.",
  );
} finally {
  await browser.close();
}
