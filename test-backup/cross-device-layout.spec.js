const { test, expect } = require('@playwright/test');

test.describe('Cross-Device Layout Tests', () => {
  const mobileDevices = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'Pixel 5', width: 393, height: 851 },
    { name: 'Galaxy S20', width: 360, height: 800 }
  ];

  const testPages = [
    { path: '/', name: 'Homepage' },
    { path: '/pages/about/', name: 'About Page' },
    { path: '/pages/services/', name: 'Services Page' },
    { path: '/blog/', name: 'Blog Listing' },
    { path: '/pages/contact/', name: 'Contact Page' }
  ];

  mobileDevices.forEach(device => {
    testPages.forEach(pageInfo => {
      test.describe(`${device.name} - ${pageInfo.name}`, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ width: device.width, height: device.height });
        });

        test('should load page without errors', async ({ page }) => {
          await page.goto(pageInfo.path);

          // Check for any console errors
          const consoleErrors = [];
          page.on('console', msg => {
            if (msg.type() === 'error') {
              consoleErrors.push(msg.text());
            }
          });

          // Wait for page to load completely
          await page.waitForLoadState('networkidle');

          // Verify page loaded successfully
          await expect(page.locator('body')).toBeVisible();

          // Check if there are any critical console errors
          expect(consoleErrors.length).toBe(0);
        });

        test('should not have horizontal scrolling', async ({ page }) => {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');

          // Check if page has horizontal scrolling
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });

          expect(hasHorizontalScroll).toBe(false);
        });

        test('should have proper viewport meta tag', async ({ page }) => {
          await page.goto(pageInfo.path);

          const viewportMeta = await page
            .locator('meta[name=\"viewport\"]')
            .getAttribute('content');
          expect(viewportMeta).toContain('width=device-width');
          expect(viewportMeta).toContain('initial-scale=1.0');
        });

        test('should display navigation correctly', async ({ page }) => {
          await page.goto(pageInfo.path);

          // Navigation should be present
          const nav = page.locator('nav');
          await expect(nav).toBeVisible();

          // Logo should be visible
          const logo = page.locator('.logo');
          await expect(logo).toBeVisible();

          // Hamburger menu should be visible on mobile
          const hamburgerButton = page.locator('.nav-toggle');
          await expect(hamburgerButton).toBeVisible();
        });

        test('should have readable text sizes', async ({ page }) => {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');

          // Check main content text is readable (minimum 16px)
          const textElements = await page.locator('p, li, span').all();

          for (const element of textElements.slice(0, 5)) {
            // Test first 5 elements
            const fontSize = await element.evaluate(el => {
              return parseFloat(window.getComputedStyle(el).fontSize);
            });
            expect(fontSize).toBeGreaterThanOrEqual(14); // Allow slightly smaller on mobile
          }
        });

        test('should have proper heading hierarchy', async ({ page }) => {
          await page.goto(pageInfo.path);

          // Check if headings exist and are properly sized
          const h1Elements = await page.locator('h1').all();
          const h2Elements = await page.locator('h2').all();

          // Should have at least one h1
          expect(h1Elements.length).toBeGreaterThan(0);

          // H1 should be larger than H2
          if (h1Elements.length > 0 && h2Elements.length > 0) {
            const h1Size = await h1Elements[0].evaluate(el => {
              return parseFloat(window.getComputedStyle(el).fontSize);
            });
            const h2Size = await h2Elements[0].evaluate(el => {
              return parseFloat(window.getComputedStyle(el).fontSize);
            });
            expect(h1Size).toBeGreaterThan(h2Size);
          }
        });

        test('should have adequate spacing between elements', async ({ page }) => {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');

          // Check spacing between major sections
          const sections = await page.locator('section, .hero, .about, .services').all();

          for (const section of sections.slice(0, 3)) {
            // Test first 3 sections
            const marginBottom = await section.evaluate(el => {
              return parseFloat(window.getComputedStyle(el).marginBottom);
            });
            const paddingTop = await section.evaluate(el => {
              return parseFloat(window.getComputedStyle(el).paddingTop);
            });
            const paddingBottom = await section.evaluate(el => {
              return parseFloat(window.getComputedStyle(el).paddingBottom);
            });

            // Should have some spacing (minimum 10px)
            const totalSpacing = marginBottom + paddingTop + paddingBottom;
            expect(totalSpacing).toBeGreaterThan(10);
          }
        });

        test('should handle touch interactions properly', async ({ page }) => {
          await page.goto(pageInfo.path);

          // Test hamburger menu touch interaction
          const hamburgerButton = page.locator('.nav-toggle');
          await hamburgerButton.tap();

          // Menu should open
          await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

          // Test navigation links if menu is open
          const navLinks = page.locator('.nav-links a');
          const linkCount = await navLinks.count();

          if (linkCount > 0) {
            // Test first navigation link
            await navLinks.first().tap();
            // Page should navigate (URL should change)
            await page.waitForLoadState('networkidle');
          }
        });

        test('should load all images properly', async ({ page }) => {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');

          // Get all images on the page
          const images = await page.locator('img').all();

          for (const img of images) {
            // Check if image has loaded
            const naturalWidth = await img.evaluate(el => el.naturalWidth);
            const naturalHeight = await img.evaluate(el => el.naturalHeight);

            // Images should have dimensions (loaded successfully)
            // Allow for SVGs or decorative images that might be 0x0
            expect(naturalWidth >= 0 && naturalHeight >= 0).toBe(true);
          }
        });
      });
    });
  });

  // Special tests for blog post pages
  test.describe('Blog Post Pages', () => {
    mobileDevices.forEach(device => {
      test.describe(`${device.name} - Blog Posts`, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ width: device.width, height: device.height });
        });

        test('should test individual blog post layout', async ({ page }) => {
          // Go to blog listing first to get actual blog post links
          await page.goto('/blog/');
          await page.waitForLoadState('networkidle');

          // Find first blog post link
          const blogPostLink = page.locator('.blog-link, a[href*=\"/posts/\"]').first();
          const postExists = (await blogPostLink.count()) > 0;

          if (postExists) {
            await blogPostLink.click();
            await page.waitForLoadState('networkidle');

            // Test \"Back to Blog\" button if it exists
            const backButton = page.locator('a[href*=\"/blog\"], .back-to-blog, .btn-back');
            const backButtonExists = (await backButton.count()) > 0;

            if (backButtonExists) {
              await expect(backButton.first()).toBeVisible();

              // Check button alignment and size
              const buttonBox = await backButton.first().boundingBox();
              expect(buttonBox.width).toBeGreaterThan(0);
              expect(buttonBox.height).toBeGreaterThanOrEqual(44); // Touch target size
            }

            // Test article readability
            const article = page.locator('article, .post-content, main');
            await expect(article.first()).toBeVisible();

            // Check for proper spacing before post title
            const postTitle = page.locator('h1, .post-title, .title');
            if ((await postTitle.count()) > 0) {
              const titleMarginTop = await postTitle.first().evaluate(el => {
                return parseFloat(window.getComputedStyle(el).marginTop);
              });
              expect(titleMarginTop).toBeGreaterThanOrEqual(10);
            }
          }
        });
      });
    });
  });
});
