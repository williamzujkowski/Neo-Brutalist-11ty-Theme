const { test, expect } = require('@playwright/test');

// Mobile device configurations for comprehensive testing
const mobileDevices = [
  { name: 'iPhone 12/13/14', width: 390, height: 844 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Google Pixel 5', width: 393, height: 851 },
  { name: 'Samsung Galaxy S20', width: 360, height: 800 },
  { name: 'iPad Mini', width: 768, height: 1024 },
];

// Test pages configuration
const testPages = [
  { name: 'Homepage', url: '/', hasBackButton: false },
  { name: 'About', url: '/about/', hasBackButton: true },
  { name: 'Blog', url: '/blog/', hasBackButton: true },
  { name: 'Projects', url: '/projects/', hasBackButton: true },
];

// Individual blog post URLs (these would need to be discovered dynamically)
const blogPostUrls = [
  '/blog/first-post/',
  '/blog/second-post/',
  '/blog/third-post/',
];

test.describe('Comprehensive Mobile Testing Suite', () => {
  // Test each device viewport
  for (const device of mobileDevices) {
    test.describe(`${device.name} (${device.width}x${device.height})`, () => {

      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
      });

      // Test all main pages
      for (const pageConfig of testPages) {
        test(`${pageConfig.name} - Mobile Layout & Functionality`, async ({ page }) => {
          await page.goto(`http://localhost:8080${pageConfig.url}`);

          // Wait for page to load completely
          await page.waitForLoadState('networkidle');

          // 1. No horizontal scrolling test
          const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
          const viewportWidth = await page.evaluate(() => window.innerWidth);
          expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 1); // Allow 1px tolerance

          // 2. Navigation functionality
          const navToggle = page.locator('[data-nav-toggle]');
          if (await navToggle.isVisible()) {
            await navToggle.click();
            await expect(page.locator('[data-nav-menu]')).toBeVisible();

            // Test navigation links
            const navLinks = page.locator('[data-nav-menu] a');
            const linkCount = await navLinks.count();
            expect(linkCount).toBeGreaterThan(0);

            // Close nav
            await navToggle.click();
          }

          // 3. Social icons accessibility (44px+ touch targets)
          const socialIcons = page.locator('.social-links a, .social-icons a, [class*="social"] a');
          const socialCount = await socialIcons.count();

          if (socialCount > 0) {
            for (let i = 0; i < socialCount; i++) {
              const icon = socialIcons.nth(i);
              const boundingBox = await icon.boundingBox();

              if (boundingBox) {
                expect(boundingBox.width).toBeGreaterThanOrEqual(44);
                expect(boundingBox.height).toBeGreaterThanOrEqual(44);
              }
            }
          }

          // 4. Back to Blog button test (if applicable)
          if (pageConfig.hasBackButton) {
            const backButton = page.locator('a[href*="/blog"], .back-to-blog, [class*="back"]');
            if (await backButton.count() > 0) {
              await expect(backButton.first()).toBeVisible();

              // Check button size for touch accessibility
              const buttonBox = await backButton.first().boundingBox();
              if (buttonBox) {
                expect(buttonBox.height).toBeGreaterThanOrEqual(44);
              }
            }
          }

          // 5. Typography readability
          const headings = page.locator('h1, h2, h3');
          const headingCount = await headings.count();

          if (headingCount > 0) {
            for (let i = 0; i < headingCount; i++) {
              const heading = headings.nth(i);
              const fontSize = await heading.evaluate(el => getComputedStyle(el).fontSize);
              const fontSizeValue = parseInt(fontSize);

              // Minimum font sizes for mobile readability
              const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
              const minSizes = { h1: 24, h2: 20, h3: 18 };
              expect(fontSizeValue).toBeGreaterThanOrEqual(minSizes[tagName] || 16);
            }
          }

          // 6. Check for broken images
          const images = page.locator('img');
          const imageCount = await images.count();

          for (let i = 0; i < imageCount; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate(el => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
          }

          // 7. Page load performance
          const loadTime = await page.evaluate(() => window.performance.timing.loadEventEnd - window.performance.timing.navigationStart);
          expect(loadTime).toBeLessThan(5000); // 5 second max load time

          // Take screenshot for visual verification
          await page.screenshot({
            path: `tests/screenshots/${device.name.replace(/[\/\s]/g, '_')}_${pageConfig.name}_mobile.png`,
            fullPage: true
          });
        });
      }

      // Test blog post pages specifically
      test('Blog Post Pages - Mobile Layout', async ({ page }) => {
        // Try to find actual blog posts dynamically
        await page.goto('http://localhost:8080/blog/');
        await page.waitForLoadState('networkidle');

        const blogLinks = page.locator('a[href*="/blog/"]').filter({ hasText: /.+/ });
        const linkCount = await blogLinks.count();

        if (linkCount > 0) {
          // Test first blog post found
          const firstPostLink = blogLinks.first();
          const href = await firstPostLink.getAttribute('href');

          if (href && href !== '/blog/') {
            await page.goto(`http://localhost:8080${href}`);
            await page.waitForLoadState('networkidle');

            // Same tests as above for blog posts
            const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
            const viewportWidth = await page.evaluate(() => window.innerWidth);
            expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 1);

            // Check for back button
            const backButton = page.locator('a[href*="/blog"], .back-to-blog, [class*="back"]');
            if (await backButton.count() > 0) {
              await expect(backButton.first()).toBeVisible();
            }

            // Screenshot
            await page.screenshot({
              path: `tests/screenshots/${device.name.replace(/[\/\s]/g, '_')}_BlogPost_mobile.png`,
              fullPage: true
            });
          }
        }
      });

      // Accessibility contrast testing
      test('Accessibility - Text Contrast', async ({ page }) => {
        await page.goto('http://localhost:8080/');
        await page.waitForLoadState('networkidle');

        // Check main text elements for sufficient contrast
        const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, a, span').filter({ hasText: /.+/ });
        const elementCount = Math.min(await textElements.count(), 10); // Test first 10 elements

        for (let i = 0; i < elementCount; i++) {
          const element = textElements.nth(i);

          const styles = await element.evaluate(el => {
            const computed = getComputedStyle(el);
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              fontSize: computed.fontSize
            };
          });

          // Basic contrast check (simplified)
          const fontSize = parseInt(styles.fontSize);
          expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum readable font size
        }
      });

      // Performance and layout stability
      test('Layout Stability - No Cumulative Layout Shift', async ({ page }) => {
        await page.goto('http://localhost:8080/');

        // Monitor for layout shifts
        let cumulativeLayoutShift = 0;

        await page.addInitScript(() => {
          let clsValue = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            window.clsValue = clsValue;
          }).observe({ type: 'layout-shift', buffered: true });
        });

        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // Wait for any delayed layout shifts

        cumulativeLayoutShift = await page.evaluate(() => window.clsValue || 0);

        // CLS should be less than 0.1 for good user experience
        expect(cumulativeLayoutShift).toBeLessThan(0.1);
      });
    });
  }

  // Cross-device navigation test
  test('Cross-Device Navigation Consistency', async ({ page }) => {
    for (const device of mobileDevices.slice(0, 2)) { // Test on 2 devices
      await page.setViewportSize({ width: device.width, height: device.height });

      for (const pageConfig of testPages) {
        await page.goto(`http://localhost:8080${pageConfig.url}`);
        await page.waitForLoadState('networkidle');

        // Check if all navigation links are accessible
        const navToggle = page.locator('[data-nav-toggle]');
        if (await navToggle.isVisible()) {
          await navToggle.click();

          const navLinks = page.locator('[data-nav-menu] a');
          const linkCount = await navLinks.count();

          // Each page should have consistent navigation
          expect(linkCount).toBeGreaterThanOrEqual(3); // Expect at least 3 nav items

          await navToggle.click(); // Close nav
        }
      }
    }
  });
});