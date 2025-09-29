const { test, expect } = require('@playwright/test');

test.describe('Test Runner - Mobile Navigation and Layout Verification', () => {
  const mobileDevices = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'Pixel 5', width: 393, height: 851 },
    { name: 'Galaxy S20', width: 360, height: 800 }
  ];

  const criticalPages = [
    { path: '/', name: 'Homepage' },
    { path: '/pages/about/', name: 'About Page' },
    { path: '/blog/', name: 'Blog Listing' }
  ];

  mobileDevices.forEach(device => {
    criticalPages.forEach(pageInfo => {
      test.describe(`${device.name} (${device.width}x${device.height}) - ${pageInfo.name}`, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ width: device.width, height: device.height });
        });

        test('Critical Mobile Navigation Test', async ({ page }) => {
          // Navigate to page
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');

          // 1. Check hamburger menu is visible
          const hamburgerButton = page.locator('.nav-toggle');
          await expect(hamburgerButton).toBeVisible();

          // 2. Test hamburger menu toggle
          await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
          await hamburgerButton.click();
          await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

          // 3. Test navigation links
          const aboutLink = page.locator('.nav-links a[href*=\"about\"]');
          if ((await aboutLink.count()) > 0) {
            await aboutLink.click();
            await page.waitForLoadState('networkidle');
            expect(page.url()).toContain('about');
          }
        });

        test('Critical Layout Verification', async ({ page }) => {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');

          // 1. No horizontal scrolling
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          expect(hasHorizontalScroll).toBe(false);

          // 2. Proper touch targets
          const hamburgerButton = page.locator('.nav-toggle');
          const buttonBox = await hamburgerButton.boundingBox();
          expect(buttonBox.width).toBeGreaterThanOrEqual(44);
          expect(buttonBox.height).toBeGreaterThanOrEqual(44);

          // 3. Text readability
          const bodyTexts = await page.locator('p').all();
          if (bodyTexts.length > 0) {
            const fontSize = await bodyTexts[0].evaluate(el => {
              return parseFloat(window.getComputedStyle(el).fontSize);
            });
            expect(fontSize).toBeGreaterThanOrEqual(14);
          }
        });

        test('Typography and Contrast Verification', async ({ page }) => {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');

          // Check text contrast and readability
          const textElements = await page.locator('h1, h2, h3, p').all();

          for (const element of textElements.slice(0, 3)) {
            const isVisible = await element.isVisible();
            if (!isVisible) {
              continue;
            }

            const styles = await element.evaluate(el => {
              const computed = window.getComputedStyle(el);
              return {
                color: computed.color,
                fontSize: parseFloat(computed.fontSize),
                lineHeight: computed.lineHeight
              };
            });

            // Font size should be adequate
            expect(styles.fontSize).toBeGreaterThan(12);

            // Should have color defined
            expect(styles.color).not.toBe('');
          }
        });

        test('Social Icons and Footer Layout', async ({ page }) => {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');

          // Check social icons in footer
          const socialIcons = page.locator('.social-icon');
          const socialIconsExist = (await socialIcons.count()) > 0;

          if (socialIconsExist) {
            // Social icons should be visible and properly sized
            for (const icon of await socialIcons.all().then(icons => icons.slice(0, 3))) {
              const isVisible = await icon.isVisible();
              if (isVisible) {
                const iconBox = await icon.boundingBox();
                expect(iconBox.width).toBeGreaterThan(0);
                expect(iconBox.height).toBeGreaterThan(0);

                // Should fit within viewport
                expect(iconBox.x + iconBox.width).toBeLessThanOrEqual(device.width + 10);
              }
            }
          }
        });

        test('Blog Post Navigation (if applicable)', async ({ page }) => {
          if (pageInfo.path === '/blog/') {
            await page.goto('/blog/');
            await page.waitForLoadState('networkidle');

            // Find blog post links
            const blogPostLinks = await page.locator('.blog-link, a[href*=\"/posts/\"]').all();

            if (blogPostLinks.length > 0) {
              // Test first blog post
              await blogPostLinks[0].click();
              await page.waitForLoadState('networkidle');

              // Should be on a blog post page
              expect(page.url()).toContain('/posts/');

              // Look for back to blog button
              const backButton = page.locator('a[href*=\"/blog\"], .back-to-blog, .btn-back');
              const backButtonExists = (await backButton.count()) > 0;

              if (backButtonExists) {
                await expect(backButton.first()).toBeVisible();

                // Test back functionality
                await backButton.first().click();
                await page.waitForLoadState('networkidle');
                expect(page.url()).toContain('/blog');
              }
            }
          }
        });

        test('Link Functionality Verification', async ({ page }) => {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');

          // Test logo link
          const logo = page.locator('.logo');
          await expect(logo).toBeVisible();

          const logoHref = await logo.getAttribute('href');
          expect(logoHref).toBe('/');

          // Test external links have proper attributes
          const externalLinks = await page.locator('a[href^=\"http\"]').all();

          for (const link of externalLinks.slice(0, 2)) {
            const isVisible = await link.isVisible();
            if (!isVisible) {
              continue;
            }

            const target = await link.getAttribute('target');
            const rel = await link.getAttribute('rel');

            expect(target).toBe('_blank');
            expect(rel).toContain('noopener');
          }
        });
      });
    });
  });

  // Screenshot test for visual verification
  test.describe('Visual Regression Tests', () => {
    mobileDevices.forEach(device => {
      test(`Screenshot verification - ${device.name}`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });

        // Test homepage layout
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Take full page screenshot
        await page.screenshot({
          path: `test-results/screenshots/${device.name.replace(/\s+/g, '-')}-homepage-full.png`,
          fullPage: true
        });

        // Test mobile menu open state
        const hamburger = page.locator('.nav-toggle');
        await hamburger.click();

        await page.screenshot({
          path: `test-results/screenshots/${device.name.replace(/\s+/g, '-')}-mobile-menu-open.png`,
          fullPage: false
        });

        // Test blog page
        await page.goto('/blog/');
        await page.waitForLoadState('networkidle');

        await page.screenshot({
          path: `test-results/screenshots/${device.name.replace(/\s+/g, '-')}-blog-page.png`,
          fullPage: true
        });
      });
    });
  });
});
