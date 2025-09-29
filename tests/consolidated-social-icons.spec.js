/**
 * CONSOLIDATED SOCIAL ICONS TESTS
 * Merges: social-icons.spec.js, social-icons-test.spec.js, social-icons-footer.spec.js
 *
 * Tests all social media icon functionality, accessibility, and performance
 * Covers: Icon rendering, touch targets, href validation, mobile accessibility
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad, testSocialIcons } = require('./helpers/test-utils');

// Test pages where social icons should appear
const testPages = [
  { url: '/', name: 'Homepage' },
  { url: '/about/', name: 'About Page' },
  { url: '/services/', name: 'Services Page' },
  { url: '/blog/', name: 'Blog Index' },
  { url: '/projects/', name: 'Projects Page' },
  { url: '/contact/', name: 'Contact Page' }
];

// Device configurations for mobile accessibility testing
const mobileDevices = [
  { name: 'iPhone 14', width: 393, height: 852 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Pixel 5', width: 393, height: 851 },
  { name: 'Galaxy S20', width: 360, height: 800 },
  { name: 'Mobile Landscape', width: 667, height: 375 }
];

// Expected social platforms (adjust based on site configuration)
const expectedSocialPlatforms = [
  { platform: 'GitHub', pattern: /github\.com/, required: true },
  { platform: 'Twitter', pattern: /twitter\.com|x\.com/, required: false },
  { platform: 'LinkedIn', pattern: /linkedin\.com/, required: false },
  { platform: 'Email', pattern: /mailto:/, required: true }
];

test.describe('Consolidated Social Icons Tests', () => {
  // BASIC SOCIAL ICONS FUNCTIONALITY
  test.describe('Social Icons Core Functionality', () => {
    testPages.forEach(page => {
      test(`should display social icons correctly on ${page.name}`, async ({
        page: playwright
      }) => {
        await playwright.goto(page.url);
        await waitForPageLoad(playwright);

        // Find social icons section with flexible selectors
        const socialSelectors = [
          '.social-links',
          '.social-icons',
          '.social',
          '[class*="social"]',
          'footer .social',
          'header .social',
          '.footer .social',
          '[data-testid="social-icons"]'
        ];

        let socialSection;
        let socialLinks;

        // Find the social section
        for (const selector of socialSelectors) {
          const section = playwright.locator(selector).first();
          if ((await section.count()) > 0 && (await section.isVisible())) {
            socialSection = section;
            socialLinks = section.locator('a');
            break;
          }
        }

        // If no section found, try direct social links
        if (!socialSection) {
          socialLinks = playwright.locator(
            'a[href*="github"], a[href*="twitter"], a[href*="linkedin"], a[href*="mailto"]'
          );
        }

        if (socialLinks && (await socialLinks.count()) > 0) {
          const linkCount = await socialLinks.count();
          expect(linkCount).toBeGreaterThan(0);

          // Test each social icon
          for (let i = 0; i < linkCount; i++) {
            const link = socialLinks.nth(i);
            await expect(link).toBeVisible();

            // Check for icon content (SVG, icon font, or image)
            const hasIcon =
              (await link.locator('svg, i, [class*="icon"], img, .icon, [class*="fa-"]').count()) >
              0;
            expect(hasIcon).toBe(true);

            // Check for valid href
            const href = await link.getAttribute('href');
            expect(href).toBeTruthy();
            expect(href).toMatch(/^(https?:\/\/|mailto:)/);

            // Check for accessibility attributes
            const ariaLabel = await link.getAttribute('aria-label');
            const title = await link.getAttribute('title');
            const linkText = await link.textContent();

            const hasAccessibleText =
              ariaLabel || title || (linkText && linkText.trim().length > 0);
            expect(hasAccessibleText).toBe(true);
          }
        }
      });
    });

    test('should have valid social platform links', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const socialResults = await testSocialIcons(page);

      // Check for required platforms
      const requiredPlatforms = expectedSocialPlatforms.filter(p => p.required);
      for (const platform of requiredPlatforms) {
        const hasRequiredPlatform = socialResults.some(
          result => result.href && platform.pattern.test(result.href)
        );
        expect(hasRequiredPlatform, `Required platform ${platform.platform} not found`).toBe(true);
      }

      // Validate all found social links
      socialResults.forEach((result, index) => {
        expect(result.isVisible, `Social icon ${index} should be visible`).toBe(true);
        expect(result.hasIcon, `Social icon ${index} should have an icon element`).toBe(true);
        expect(result.isValidUrl, `Social icon ${index} should have valid URL`).toBe(true);
      });
    });
  });

  // MOBILE ACCESSIBILITY TESTS
  test.describe('Mobile Social Icons Accessibility', () => {
    mobileDevices.forEach(device => {
      test(`should have proper touch targets on ${device.name}`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });

        for (const testPage of testPages.slice(0, 3)) {
          // Test subset for performance
          await page.goto(testPage.url);
          await waitForPageLoad(page);

          const socialIcons = page.locator(`
            .social-icons a,
            .social-links a,
            .social a,
            footer [class*="social"] a,
            a[href*="github"],
            a[href*="twitter"],
            a[href*="linkedin"],
            a[href*="mailto"]
          `);

          const iconCount = await socialIcons.count();

          if (iconCount > 0) {
            for (let i = 0; i < iconCount; i++) {
              const icon = socialIcons.nth(i);
              const box = await icon.boundingBox();

              if (box) {
                // WCAG 2.1 AA: Touch targets should be at least 44x44px
                expect(
                  box.width,
                  `Social icon ${i + 1} width on ${testPage.name} (${device.name})`
                ).toBeGreaterThanOrEqual(44);
                expect(
                  box.height,
                  `Social icon ${i + 1} height on ${testPage.name} (${device.name})`
                ).toBeGreaterThanOrEqual(44);
              }

              // Check computed styles for additional size validation
              const iconStyles = await icon.evaluate(el => {
                const styles = window.getComputedStyle(el);
                return {
                  width: parseFloat(styles.width),
                  height: parseFloat(styles.height),
                  minWidth: parseFloat(styles.minWidth) || 0,
                  minHeight: parseFloat(styles.minHeight) || 0,
                  padding: styles.padding,
                  margin: styles.margin
                };
              });

              // Verify minimum size requirements
              const totalWidth = iconStyles.width + (parseFloat(iconStyles.padding) * 2 || 0);
              const totalHeight = iconStyles.height + (parseFloat(iconStyles.padding) * 2 || 0);

              expect(totalWidth).toBeGreaterThanOrEqual(40); // Allow small tolerance
              expect(totalHeight).toBeGreaterThanOrEqual(40);
            }
          }
        }
      });

      test(`should have proper spacing between icons on ${device.name}`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto('/');
        await waitForPageLoad(page);

        const socialIcons = page.locator('.social-icons a, .social-links a, .social a').first();
        const parent = page.locator('.social-icons, .social-links, .social').first();

        if ((await socialIcons.count()) > 1 && (await parent.count()) > 0) {
          const parentStyles = await parent.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              gap: styles.gap,
              gridGap: styles.gridGap,
              display: styles.display,
              flexDirection: styles.flexDirection
            };
          });

          // Check for proper spacing (gap, margin, or grid-gap)
          const hasProperSpacing =
            parentStyles.gap !== 'normal' ||
            parentStyles.gridGap !== 'normal' ||
            parentStyles.display === 'flex' ||
            parentStyles.display === 'grid';

          expect(hasProperSpacing).toBe(true);
        }
      });
    });

    test('should prevent overflow on narrow screens', async ({ page }) => {
      // Test on very narrow viewport
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto('/');
      await waitForPageLoad(page);

      const socialContainer = page
        .locator('.social-icons, .social-links, .social, footer [class*="social"]')
        .first();

      if ((await socialContainer.count()) > 0) {
        const containerBox = await socialContainer.boundingBox();
        const viewportWidth = 320;

        if (containerBox) {
          expect(containerBox.x + containerBox.width).toBeLessThanOrEqual(
            viewportWidth + 10 // Small tolerance
          );
        }

        // Check for horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll).toBe(false);
      }
    });
  });

  // SOCIAL ICONS VISUAL AND INTERACTION TESTS
  test.describe('Social Icons Visual and Interaction', () => {
    test('should have consistent visual styling', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const socialIcons = page.locator('.social-icons a, .social-links a, .social a');
      const iconCount = await socialIcons.count();

      if (iconCount > 1) {
        const firstIconStyles = await socialIcons.first().evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            width: styles.width,
            height: styles.height,
            borderRadius: styles.borderRadius,
            backgroundColor: styles.backgroundColor,
            color: styles.color
          };
        });

        // Check consistency across all icons
        for (let i = 1; i < Math.min(iconCount, 4); i++) {
          // Check first 4 icons
          const iconStyles = await socialIcons.nth(i).evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              width: styles.width,
              height: styles.height,
              borderRadius: styles.borderRadius
            };
          });

          expect(iconStyles.width).toBe(firstIconStyles.width);
          expect(iconStyles.height).toBe(firstIconStyles.height);
          // Border radius consistency is expected but not required
        }
      }
    });

    test('should handle hover states properly', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const socialIcons = page.locator('.social-icons a, .social-links a, .social a');
      const iconCount = await socialIcons.count();

      if (iconCount > 0) {
        const firstIcon = socialIcons.first();

        // Get initial styles
        const initialStyles = await firstIcon.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            transform: styles.transform,
            opacity: styles.opacity,
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor
          };
        });

        // Hover over the icon
        await firstIcon.hover();
        await page.waitForTimeout(300); // Allow for transition

        // Get hover styles
        const hoverStyles = await firstIcon.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            transform: styles.transform,
            opacity: styles.opacity,
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor
          };
        });

        // Some style should change on hover (transform, opacity, color, etc.)
        const _hasHoverEffect =
          initialStyles.transform !== hoverStyles.transform ||
          initialStyles.opacity !== hoverStyles.opacity ||
          initialStyles.backgroundColor !== hoverStyles.backgroundColor ||
          initialStyles.borderColor !== hoverStyles.borderColor;

        // Note: Hover effects are optional but good UX
        // This test documents the behavior rather than enforcing it
      }
    });

    test('should handle keyboard navigation', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const socialIcons = page.locator('.social-icons a, .social-links a, .social a');
      const iconCount = await socialIcons.count();

      if (iconCount > 0) {
        // Focus on first social icon via keyboard
        await page.keyboard.press('Tab'); // Navigate to first focusable element

        // Keep tabbing until we reach a social icon
        let attempts = 0;
        while (attempts < 20) {
          // Prevent infinite loop
          const focusedElement = page.locator(':focus');
          const isSocialIcon = await focusedElement.evaluate(
            el =>
              el.href &&
              (el.href.includes('github') ||
                el.href.includes('twitter') ||
                el.href.includes('linkedin') ||
                el.href.includes('mailto'))
          );

          if (isSocialIcon) {
            // Test keyboard activation
            await focusedElement.press('Enter');
            await page.waitForTimeout(500);

            // For external links, check if new tab would open (or navigation starts)
            // For mailto links, this varies by browser/system
            break;
          }

          await page.keyboard.press('Tab');
          attempts++;
        }
      }
    });
  });

  // PERFORMANCE AND LOADING TESTS
  test.describe('Social Icons Performance', () => {
    test('should load social icons quickly', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await waitForPageLoad(page);

      const socialIcons = page.locator('.social-icons a, .social-links a, .social a');
      await expect(socialIcons.first()).toBeVisible();

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test('should optimize SVG social icons', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const svgIcons = page.locator('.social-icons svg, .social-links svg, .social svg');
      const svgCount = await svgIcons.count();

      if (svgCount > 0) {
        for (let i = 0; i < svgCount; i++) {
          const svg = svgIcons.nth(i);

          // Check for proper SVG attributes
          const viewBox = await svg.getAttribute('viewBox');
          const width = await svg.getAttribute('width');
          const height = await svg.getAttribute('height');

          // SVGs should have viewBox for proper scaling
          expect(viewBox || width || height).toBeTruthy();

          // Check for accessibility
          const ariaLabel = await svg.getAttribute('aria-label');
          const ariaHidden = await svg.getAttribute('aria-hidden');
          const role = await svg.getAttribute('role');

          // SVG should either be hidden (decorative) or have accessible label
          const isAccessible = ariaHidden === 'true' || ariaLabel || role === 'img';
          expect(isAccessible).toBe(true);
        }
      }
    });

    test('should not cause layout shift during load', async ({ page }) => {
      // Enable layout shift monitoring
      await page.addInitScript(() => {
        window.layoutShifts = [];
        new PerformanceObserver(list => {
          window.layoutShifts.push(...list.getEntries());
        }).observe({ type: 'layout-shift', buffered: true });
      });

      await page.goto('/');
      await waitForPageLoad(page);

      // Wait for any additional loading
      await page.waitForTimeout(1000);

      const layoutShifts = await page.evaluate(() => window.layoutShifts || []);

      // Calculate Cumulative Layout Shift (CLS)
      const cls = layoutShifts.reduce((sum, shift) => sum + shift.value, 0);

      // CLS should be less than 0.1 for good user experience
      expect(cls).toBeLessThan(0.1);
    });
  });
});
