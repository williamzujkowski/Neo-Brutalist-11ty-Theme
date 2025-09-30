const { test, expect } = require('@playwright/test');

const PIXEL_10_VIEWPORT = { width: 412, height: 915 };

test.describe('About Page Mobile Viewport - Pixel 10', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(PIXEL_10_VIEWPORT);
    await page.goto('http://localhost:8080/pages/about/');
  });

  test('should not have horizontal scroll', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    console.log(`Scroll width: ${scrollWidth}, Client width: ${clientWidth}`);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance
  });

  test('all sections should fit within viewport', async ({ page }) => {
    const sections = [
      '.hero-section',
      '.philosophy-section',
      '.skills-section',
      '.journey-section',
      '.approach-section',
      '.values-section',
      '.cta-section'
    ];

    for (const selector of sections) {
      const element = await page.locator(selector);
      if (await element.count() > 0) {
        const box = await element.boundingBox();
        console.log(`${selector}: right edge at ${box.x + box.width}px`);
        expect(box.x + box.width).toBeLessThanOrEqual(PIXEL_10_VIEWPORT.width + 10);
      }
    }
  });

  test('should be able to scroll to bottom', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Scrolled to: ${scrollY}px`);
    expect(scrollY).toBeGreaterThan(100);
  });

  test('all content should be visible after scrolling', async ({ page }) => {
    const ctaSection = page.locator('.cta-section');
    await ctaSection.scrollIntoViewIfNeeded();
    await expect(ctaSection).toBeVisible();

    const ctaButton = page.locator('.cta-button').first();
    await expect(ctaButton).toBeVisible();
  });
});